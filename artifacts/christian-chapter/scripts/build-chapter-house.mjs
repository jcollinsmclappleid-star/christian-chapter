import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { writeChapterHouseAssets } from "./author-chapter-house.mjs";

const root = resolve(import.meta.dirname, "..");
const artRoot = join(root, "art", "chapter-house");
const buildRoot = join(artRoot, "build");
const publicModels = join(root, "public", "models");
const publicImages = join(root, "public", "images", "chapter-house");
const blenderCandidates = [
  process.env.BLENDER_BIN,
  join(process.env.HOME ?? "", "Applications", "Blender.app", "Contents", "MacOS", "Blender"),
  "/Applications/Blender.app/Contents/MacOS/Blender",
  "blender",
].filter(Boolean);
const blender = blenderCandidates.find((candidate) => candidate === "blender" || existsSync(candidate));

mkdirSync(buildRoot, { recursive: true });
mkdirSync(publicModels, { recursive: true });
mkdirSync(publicImages, { recursive: true });
writeChapterHouseAssets();

function publishBlenderOutputs() {
  const raw = join(buildRoot, "chapter-house.raw.glb");
  if (existsSync(raw)) {
    console.log("Keeping authored architecture GLB; Blender raw stays in art/chapter-house/build.");
  }
  const blend = join(buildRoot, "chapter-house.blend");
  if (existsSync(blend)) copyFileSync(blend, join(artRoot, "chapter-house.blend"));
}

if (!blender) {
  console.log("Blender not found. Shipped the authored prebuilt GLB and designed posters.");
  process.exit(0);
}

try {
  execFileSync(
    blender,
    ["--background", "--python", join(artRoot, "build_scene.py")],
    { cwd: root, stdio: "inherit", env: { ...process.env, CH_OUTPUT_ROOT: buildRoot } },
  );
} catch (error) {
  console.log("Blender render may have failed; keeping any exported GLB.");
  console.log(String(error?.message ?? error));
}

publishBlenderOutputs();

for (const name of ["desktop", "mobile"]) {
  const png = join(buildRoot, `chapter-house-${name}.png`);
  if (!existsSync(png)) continue;
  try {
    const sharp = (await import("sharp")).default;
    await Promise.all([
      sharp(png).avif({ quality: 68 }).toFile(join(publicImages, `chapter-house-${name}.avif`)),
      sharp(png).webp({ quality: 86 }).toFile(join(publicImages, `chapter-house-${name}.webp`)),
    ]);
  } catch {
    console.log("sharp not available; posters remain as designed SVG stills.");
  }
}
