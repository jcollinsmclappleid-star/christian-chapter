import { eq } from "drizzle-orm";
import { db, memberProfiles, users } from "@/db";
import { sendServiceEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site-config";

export async function notifyNewIntroduction(userId: string, otherFirstName: string | null) {
  const [profile] = await db
    .select({ notify: memberProfiles.notifyIntroductions })
    .from(memberProfiles)
    .where(eq(memberProfiles.userId, userId))
    .limit(1);
  if (profile?.notify === false) return;

  const [user] = await db.select({ email: users.email }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user?.email) return;

  const name = otherFirstName?.trim() || "someone";
  const url = `${siteConfig.siteUrl}/introductions`;
  await sendServiceEmail({
    to: user.email,
    subject: "A new introduction",
    text: `There is a new introduction with ${name}. ${url}`,
    html: `<p>There is a new introduction with ${name}.</p><p><a href="${url}">Open introductions</a></p>`,
  });
}
