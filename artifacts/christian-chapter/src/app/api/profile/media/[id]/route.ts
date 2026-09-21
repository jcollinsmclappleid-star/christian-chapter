import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, memberMedia } from "@/db";
import { requireMemberApi } from "@/lib/member-session";
import { requireAdminApi } from "@/lib/admin-auth";
import { mimeForKey, readUpload } from "@/lib/storage/local";

async function canView(userId: string) {
  const member = await requireMemberApi();
  if (member.session?.user.id === userId) return true;
  const admin = await requireAdminApi("profiles.read");
  return Boolean(admin.session);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [row] = await db.select().from(memberMedia).where(eq(memberMedia.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!(await canView(row.userId))) {
    return NextResponse.json({ error: "Not permitted." }, { status: 403 });
  }
  try {
    const body = await readUpload(row.storageKey);
    return new NextResponse(new Uint8Array(body), {
      headers: { "Content-Type": mimeForKey(row.storageKey), "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Media is not available." }, { status: 404 });
  }
}
