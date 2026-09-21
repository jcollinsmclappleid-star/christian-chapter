import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/member-session";

export async function GET() {
  const session = await getMemberSession();
  return NextResponse.json({ signedIn: Boolean(session.user?.id) });
}
