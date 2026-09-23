import { eq } from "drizzle-orm";
import { db, billingAgreements } from "@/db";
import { MEMBER_BILLING_STARTS_ISO, MEMBER_PRICE_GBP, siteConfig } from "@/lib/site-config";

export function cardCollectionDate() {
  return new Date(MEMBER_BILLING_STARTS_ISO);
}

export async function billingStatus(userId: string) {
  const [row] = await db.select().from(billingAgreements).where(eq(billingAgreements.userId, userId)).limit(1);
  return {
    cardSaved: row?.status === "card_saved",
    collectsOn: MEMBER_BILLING_STARTS_ISO,
    stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),
  };
}

function formBody(fields: Record<string, string>) {
  return new URLSearchParams(fields).toString();
}

type StripeResult = {
  error?: { message?: string };
  url?: string;
  status?: string;
  client_reference_id?: string;
  customer?: string | null;
  subscription?: string | null;
};

async function stripe(path: string, fields?: Record<string, string>, method = "POST") {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(fields ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: fields ? formBody(fields) : undefined,
  });
  const json = (await res.json().catch(() => null)) as StripeResult | null;
  if (!res.ok || !json) {
    return { error: json?.error?.message || "Stripe could not start the card save." } as const;
  }
  return { data: json } as const;
}

function stripeError(result: { error: string } | { data: StripeResult } | null): string | null {
  if (!result) return "Card saving could not start.";
  if ("error" in result) return result.error;
  return null;
}

export async function startCardSave(user: { id: string; email: string }) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Card saving is not connected yet. Nothing is taken before 15 February 2027." };
  }
  const trialEnd = Math.floor(cardCollectionDate().getTime() / 1000);
  const origin = siteConfig.siteUrl;
  const session = await stripe("checkout/sessions", {
    mode: "subscription",
    client_reference_id: user.id,
    customer_email: user.email,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "gbp",
    "line_items[0][price_data][unit_amount]": String(MEMBER_PRICE_GBP * 100),
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": "Mature Christian Dating membership",
    "subscription_data[trial_end]": String(trialEnd),
    success_url: `${origin}/account?card=saved&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/account?card=cancelled`,
    "metadata[userId]": user.id,
  });
  const failure = stripeError(session);
  const checkout = session && "data" in session ? session.data : undefined;
  if (failure || !checkout) return { error: failure || "Card saving could not start." };
  const url = typeof checkout.url === "string" ? checkout.url : "";
  if (!url) return { error: "Card saving could not start." };
  return { url };
}

export async function confirmCardSave(userId: string, sessionId: string) {
  const session = await stripe(`checkout/sessions/${encodeURIComponent(sessionId)}`, undefined, "GET");
  const saved = session && "data" in session ? session.data : undefined;
  if (!saved || stripeError(session)) return { error: "That card save could not be confirmed." };
  if (saved.client_reference_id !== userId || saved.status !== "complete") {
    return { error: "That card save is not complete." };
  }
  const now = new Date();
  const values = {
    userId,
    stripeCustomerId: typeof saved.customer === "string" ? saved.customer : null,
    stripeSubscriptionId: typeof saved.subscription === "string" ? saved.subscription : null,
    status: "card_saved",
    collectionOn: cardCollectionDate(),
    updatedAt: now,
  };
  const [existing] = await db.select().from(billingAgreements).where(eq(billingAgreements.userId, userId)).limit(1);
  if (existing) {
    await db.update(billingAgreements).set(values).where(eq(billingAgreements.id, existing.id));
  } else {
    await db.insert(billingAgreements).values(values);
  }
  return { ok: true as const };
}
