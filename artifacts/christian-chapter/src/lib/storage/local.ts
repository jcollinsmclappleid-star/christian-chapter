import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".data", "uploads");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const AUDIO_EXT = new Set([".mp3", ".webm", ".m4a", ".wav"]);
const VIDEO_EXT = new Set([".mp4", ".webm"]);

export function uploadsRoot(): string {
  return ROOT;
}

function safeExt(name: string, allowed: Set<string>): string | null {
  const ext = path.extname(name).toLowerCase();
  return allowed.has(ext) ? ext : null;
}

export function imageExtension(filename: string): string | null {
  return safeExt(filename, IMAGE_EXT);
}

export function mediaExtension(filename: string, kind: "voice" | "video"): string | null {
  return safeExt(filename, kind === "voice" ? AUDIO_EXT : VIDEO_EXT);
}

export async function saveUpload(userId: string, id: string, buffer: Buffer, ext: string) {
  const dir = path.join(ROOT, userId);
  await mkdir(dir, { recursive: true });
  const filename = `${id}${ext}`;
  await writeFile(path.join(dir, filename), buffer);
  return `${userId}/${filename}`;
}

export async function readUpload(storageKey: string): Promise<Buffer> {
  const full = path.join(ROOT, storageKey);
  if (!full.startsWith(ROOT)) throw new Error("Invalid storage key.");
  return readFile(full);
}

export async function deleteUpload(storageKey: string) {
  const full = path.join(ROOT, storageKey);
  if (!full.startsWith(ROOT)) return;
  await unlink(full).catch(() => undefined);
}

export function mimeForKey(storageKey: string): string {
  const ext = path.extname(storageKey).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".m4a") return "audio/mp4";
  if (ext === ".wav") return "audio/wav";
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  return "application/octet-stream";
}
