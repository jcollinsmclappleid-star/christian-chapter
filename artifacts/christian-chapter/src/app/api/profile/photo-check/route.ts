import { NextRequest, NextResponse } from "next/server";
import { requireMemberApi } from "@/lib/member-session";
import { requestMeta } from "@/lib/auth-email";
import {
  isPhotoCheckType,
  PHOTO_CHECK_MAX_BYTES,
} from "@/lib/photo-check";
import { photoCheckView, readPhotoCheck, savePhotoCheck } from "@/lib/photo-check-store";

export async function GET() {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });
  const row = await readPhotoCheck(session.user.id);
  return NextResponse.json(photoCheckView(row));
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireMemberApi();
  if (!session) return NextResponse.json({ error }, { status: 401 });

  const form = await request.formData().catch(() => null);
  if (form?.get("consent") !== "true") {
    return NextResponse.json({ error: "Consent is required before a photograph is stored." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a photograph of your face." }, { status: 400 });
  }
  if (!isPhotoCheckType(file.type)) {
    return NextResponse.json({ error: "Use a JPEG, PNG or WebP photograph." }, { status: 422 });
  }
  if (file.size > PHOTO_CHECK_MAX_BYTES) {
    return NextResponse.json({ error: "Keep the photograph under 4MB." }, { status: 422 });
  }

  const { ip, ua } = requestMeta(request);
  const imageBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  await savePhotoCheck({
    userId: session.user.id,
    imageBase64,
    contentType: file.type,
    ipAddress: ip,
    userAgent: ua,
  });
  const row = await readPhotoCheck(session.user.id);
  return NextResponse.json(photoCheckView(row));
}
