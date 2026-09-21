import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const vendorRoot = join(root, "art", "chapter-house", "vendor");
const publicRoot = join(root, "public", "models", "furnishings");

const ASSETS = [
  { id: "sofa_03", out: "sofa.glb" },
  { id: "ArmChair_01", out: "armchair.glb" },
  { id: "WoodenTable_03", out: "table.glb" },
  { id: "CoffeeTable_01", out: "coffee-table.glb" },
  { id: "painted_wooden_chair_01", out: "chair.glb" },
  { id: "wooden_bookshelf_worn", out: "bookshelf.glb" },
  { id: "book_encyclopedia_set_01", out: "books-encyclopedia.glb" },
  { id: "vintage_oil_lamp", out: "lamp.glb" },
  { id: "brass_vase_01", out: "vase.glb" },
  { id: "potted_plant_02", out: "plant.glb" },
  { id: "painted_wooden_bench", out: "bench.glb" },
];

const HEADERS = { "User-Agent": "christian-chapter-house-build" };

async function getJson(url) {
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function getBuffer(url) {
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function pad(bytes, size = 4, fill = 0) {
  const remainder = bytes.length % size;
  if (!remainder) return bytes;
  const next = Buffer.alloc(bytes.length + (size - remainder), fill);
  bytes.copy(next);
  return next;
}

function writeGlb(json, bin) {
  const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 4, 0x20);
  const binChunk = pad(bin, 4, 0);
  const total = 12 + 8 + jsonChunk.length + 8 + binChunk.length;
  const header = Buffer.alloc(12);
  header.write("glTF", 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(total, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binChunk.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binChunk]);
}

function packGltf(gltfPath, files) {
  const gltf = JSON.parse(readFileSync(gltfPath, "utf8"));
  const parts = [];
  let offset = 0;

  const append = (bytes) => {
    const start = offset;
    const padded = pad(bytes, 4, 0);
    parts.push(padded);
    offset += padded.length;
    return { byteOffset: start, byteLength: bytes.length };
  };

  const resolveUri = (uri) => {
    if (!uri || uri.startsWith("data:")) return null;
    const bytes = files.get(uri) ?? files.get(uri.replace(/^\.\//, ""));
    if (!bytes) throw new Error(`Missing ${uri} for ${gltfPath}`);
    return bytes;
  };

  const bufferStarts = (gltf.buffers ?? []).map((buffer) => {
    if (!buffer.uri) return 0;
    const placed = append(resolveUri(buffer.uri));
    delete buffer.uri;
    return placed.byteOffset;
  });

  for (const view of gltf.bufferViews ?? []) {
    const source = view.buffer ?? 0;
    view.byteOffset = (view.byteOffset ?? 0) + (bufferStarts[source] ?? 0);
    view.buffer = 0;
  }

  gltf.bufferViews = gltf.bufferViews ?? [];
  for (const image of gltf.images ?? []) {
    if (!image.uri) continue;
    const placed = append(resolveUri(image.uri));
    image.mimeType =
      image.mimeType ??
      (image.uri.endsWith(".png") ? "image/png" : image.uri.endsWith(".webp") ? "image/webp" : "image/jpeg");
    image.bufferView = gltf.bufferViews.length;
    delete image.uri;
    gltf.bufferViews.push({ buffer: 0, byteOffset: placed.byteOffset, byteLength: placed.byteLength });
  }

  const bin = Buffer.concat(parts);
  gltf.buffers = [{ byteLength: bin.length }];
  return writeGlb(gltf, bin);
}

async function downloadAsset(asset) {
  const dest = join(publicRoot, asset.out);
  if (existsSync(dest) && process.env.FORCE_FURNISH !== "1") {
    console.log(`keep ${asset.out}`);
    return dest;
  }
  const files = await getJson(`https://api.polyhaven.com/files/${asset.id}`);
  const pack = files?.gltf?.["1k"]?.gltf ?? files?.gltf?.["2k"]?.gltf;
  if (!pack?.url) throw new Error(`No glTF package for ${asset.id}`);
  const folder = join(vendorRoot, asset.id);
  mkdirSync(join(folder, "textures"), { recursive: true });
  const gltfName = pack.url.split("/").pop();
  const gltfPath = join(folder, gltfName);
  writeFileSync(gltfPath, await getBuffer(pack.url));
  const localFiles = new Map();
  for (const [rel, info] of Object.entries(pack.include ?? {})) {
    const bytes = await getBuffer(info.url);
    const disk = join(folder, rel);
    mkdirSync(dirname(disk), { recursive: true });
    writeFileSync(disk, bytes);
    localFiles.set(rel, bytes);
    localFiles.set(`./${rel}`, bytes);
  }
  const glb = packGltf(gltfPath, localFiles);
  mkdirSync(publicRoot, { recursive: true });
  writeFileSync(dest, glb);
  console.log(`wrote ${asset.out} ${(glb.length / 1e6).toFixed(2)}MB`);
  return dest;
}

export async function fetchHouseFurnishings() {
  mkdirSync(vendorRoot, { recursive: true });
  mkdirSync(publicRoot, { recursive: true });
  for (const asset of ASSETS) {
    await downloadAsset(asset);
  }
}

const invoked = process.argv[1] && process.argv[1].includes("fetch-house-furnishings");
if (invoked) {
  fetchHouseFurnishings().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
