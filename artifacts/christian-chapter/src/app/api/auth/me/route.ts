import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { getMemberSession } from "@/lib/member-session";

export async function GET() {
  const session = await getMemberSession();
  if (!session.user?.id) return NextResponse.json({ signedIn: false, verified: false });
  const [user] = await db
    .select({ emailVerifiedAt: users.emailVerifiedAt })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return NextResponse.json({ signedIn: true, verified: Boolean(user?.emailVerifiedAt) });
}
