import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function messageKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  const material =
    secret && secret.length >= 32 ? secret : "dev-placeholder-must-be-32-chars-long!!";
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("SESSION_SECRET must be set to 32+ characters in production.");
  }
  return createHash("sha256").update(`mcd-message-v1:${material}`).digest();
}

/** Seals a message for the database. This is not end-to-end encryption. Staff can still read a report copy. */
export function sealMessage(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", messageKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${enc.toString("base64url")}`;
}

export function openMessage(stored: string): string {
  if (!stored.startsWith("enc:v1:")) return stored;
  const [, , iv, tag, data] = stored.split(":");
  if (!iv || !tag || !data) return "";
  const decipher = createDecipheriv("aes-256-gcm", messageKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
}
