import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const publicModels = join(root, "public", "models");
const publicImages = join(root, "public", "images", "chapter-house");

const MATERIALS = {
  plaster: [0.961, 0.941, 0.906],
  plasterShadow: [0.894, 0.847, 0.784],
  oak: [0.42, 0.29, 0.196],
  oakDark: [0.29, 0.196, 0.141],
  brass: [0.698, 0.541, 0.322],
  evergreen: [0.161, 0.259, 0.22],
  planting: [0.51, 0.565, 0.494],
  oxblood: [0.443, 0.227, 0.251],
  stone: [0.847, 0.8, 0.737],
  path: [0.82, 0.77, 0.71],
  lawn: [0.45, 0.5, 0.43],
  ink: [0.078, 0.141, 0.122],
};

function boxGeometry(w, h, d) {
  const x = w / 2;
  const y = h / 2;
  const z = d / 2;
  const positions = [
    -x, -y, z, x, -y, z, x, y, z, -x, y, z,
    -x, -y, -z, -x, y, -z, x, y, -z, x, -y, -z,
    -x, y, -z, -x, y, z, x, y, z, x, y, -z,
    -x, -y, -z, x, -y, -z, x, -y, z, -x, -y, z,
    x, -y, -z, x, y, -z, x, y, z, x, -y, z,
    -x, -y, -z, -x, -y, z, -x, y, z, -x, y, -z,
  ];
  const normals = [
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ];
  const indices = [];
  for (let face = 0; face < 6; face += 1) {
    const o = face * 4;
    indices.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }
  return { positions, normals, indices };
}

function quatY(angle) {
  return [0, Math.sin(angle / 2), 0, Math.cos(angle / 2)];
}

function pad(bytes, size = 4) {
  const remainder = bytes.length % size;
  if (!remainder) return bytes;
  const next = Buffer.alloc(bytes.length + (size - remainder), 0x20);
  bytes.copy(next);
  return next;
}

function buildGlb() {
  const parts = [];
  const addBox = (name, parent, material, dims, position, rotationY = 0) => {
    parts.push({ name, parent, material, dims, position, rotationY, mesh: true });
  };
  const addNode = (name, parent, position) => {
    parts.push({ name, parent, material: "plaster", dims: [0.02, 0.02, 0.02], position, rotationY: 0, mesh: false });
  };

  addBox("Ground", null, "lawn", [28, 0.08, 22], [0, -0.04, 0.4]);

  addBox("Threshold", null, "stone", [2.2, 0.12, 0.9], [0, 0.06, 3.55]);
  addBox("Threshold_LeftPier", "Threshold", "ink", [0.26, 2.55, 0.3], [-0.95, 1.22, 0]);
  addBox("Threshold_RightPier", "Threshold", "ink", [0.26, 2.55, 0.3], [0.95, 1.22, 0]);
  addBox("Threshold_Lintel", "Threshold", "oak", [2.2, 0.18, 0.32], [0, 2.55, 0]);
  addBox("Threshold_LeafL", "Threshold", "oakDark", [0.68, 2.15, 0.05], [-0.42, 1.12, 0.22], 0.42);
  addBox("Threshold_LeafR", "Threshold", "oakDark", [0.68, 2.15, 0.05], [0.42, 1.12, 0.22], -0.42);
  addBox("Threshold_MullionV", "Threshold", "oak", [0.045, 1.05, 0.045], [0, 1.48, 0.34]);
  addBox("Threshold_MullionH", "Threshold", "oak", [0.56, 0.045, 0.045], [0, 1.55, 0.34]);

  addBox("Path_StoneA", null, "stone", [0.62, 0.06, 0.42], [-2.85, 0.03, -1.85]);
  addBox("Path_StoneB", null, "stone", [0.58, 0.06, 0.4], [-2.55, 0.03, -2.25]);
  addBox("Path_StoneC", null, "stone", [0.64, 0.06, 0.42], [-2.95, 0.03, -2.65]);

  addNode("Table", null, [-2.45, 0, 0.55]);
  addNode("Library", null, [2.45, 0, 0.35]);
  addNode("Path", null, [-2.8, 0, -2.2]);
  addNode("Garden", null, [2.8, 0, -2.15]);
  addNode("Courtyard", null, [0, 0, -0.35]);
  addNode("Membership", null, [0.15, 0, -2.75]);

  const materialNames = Object.keys(MATERIALS);
  const materials = materialNames.map((name) => {
    const [r, g, b] = MATERIALS[name];
    return {
      name,
      pbrMetallicRoughness: {
        baseColorFactor: [r, g, b, 1],
        metallicFactor: name === "brass" ? 0.7 : 0,
        roughnessFactor: name === "brass" ? 0.35 : 0.82,
      },
    };
  });

  const nodes = [];
  const meshes = [];
  const accessors = [];
  const bufferViews = [];
  const binParts = [];
  let binOffset = 0;
  const nodeIndexByName = new Map();

  const writeAccessor = (array, type, componentType, count) => {
    const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
    const padded = pad(bytes);
    const viewIndex = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset: binOffset,
      byteLength: bytes.length,
      target: componentType === 5126 ? 34962 : 34963,
    });
    binParts.push(padded);
    binOffset += padded.length;
    const accessorIndex = accessors.length;
    accessors.push({ bufferView: viewIndex, componentType, count, type });
    return accessorIndex;
  };

  for (const part of parts) {
    const node = { name: part.name, translation: part.position };
    if (part.rotationY) node.rotation = quatY(part.rotationY);
    if (part.mesh) {
      const geometry = boxGeometry(...part.dims);
      const positions = new Float32Array(geometry.positions);
      const normals = new Float32Array(geometry.normals);
      const indices = new Uint16Array(geometry.indices);
      let min = [Infinity, Infinity, Infinity];
      let max = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < positions.length; i += 3) {
        min = [Math.min(min[0], positions[i]), Math.min(min[1], positions[i + 1]), Math.min(min[2], positions[i + 2])];
        max = [Math.max(max[0], positions[i]), Math.max(max[1], positions[i + 1]), Math.max(max[2], positions[i + 2])];
      }
      const positionAccessor = writeAccessor(positions, "VEC3", 5126, positions.length / 3);
      accessors[positionAccessor].min = min;
      accessors[positionAccessor].max = max;
      const normalAccessor = writeAccessor(normals, "VEC3", 5126, normals.length / 3);
      const indexAccessor = writeAccessor(indices, "SCALAR", 5123, indices.length);
      const meshIndex = meshes.length;
      meshes.push({
        name: `${part.name}Mesh`,
        primitives: [
          {
            attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
            indices: indexAccessor,
            material: materialNames.indexOf(part.material),
          },
        ],
      });
      node.mesh = meshIndex;
    }
    nodeIndexByName.set(part.name, nodes.length);
    nodes.push(node);
  }

  const childrenByParent = new Map();
  for (const part of parts) {
    if (!part.parent) continue;
    const parentIndex = nodeIndexByName.get(part.parent);
    const childIndex = nodeIndexByName.get(part.name);
    if (parentIndex === undefined || childIndex === undefined) continue;
    const list = childrenByParent.get(parentIndex) ?? [];
    list.push(childIndex);
    childrenByParent.set(parentIndex, list);
  }
  for (const [parent, children] of childrenByParent) {
    nodes[parent].children = children;
  }

  const sceneRoots = parts.filter((part) => !part.parent).map((part) => nodeIndexByName.get(part.name));
  const json = {
    asset: { version: "2.0", generator: "chapter-house-author" },
    scene: 0,
    scenes: [{ name: "ChapterHouse", nodes: sceneRoots }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binOffset }],
  };

  const jsonChunk = pad(Buffer.from(JSON.stringify(json)));
  const binChunk = Buffer.concat(binParts);
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

function desktopPoster() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600" viewBox="0 0 2400 1600" role="img" aria-hidden="true">
  <rect width="2400" height="1600" fill="#E8DFD0"/>
  <ellipse cx="1200" cy="1280" rx="980" ry="180" fill="#6E7A68"/>
  <rect x="1040" y="620" width="28" height="520" fill="#14241F"/>
  <rect x="1332" y="620" width="28" height="520" fill="#14241F"/>
  <rect x="1040" y="600" width="320" height="28" fill="#6B4A32"/>
  <rect x="1190" y="680" width="8" height="280" fill="#4A3224"/>
  <rect x="1140" y="820" width="108" height="8" fill="#4A3224"/>
  <rect x="430" y="980" width="320" height="28" fill="#6B4A32"/>
  <ellipse cx="590" cy="968" rx="46" ry="16" fill="#B28A52" opacity="0.7"/>
  <rect x="1660" y="900" width="22" height="110" fill="#713A40"/>
  <rect x="1690" y="888" width="18" height="122" fill="#4A3224"/>
  <rect x="1716" y="910" width="20" height="100" fill="#294238"/>
  <rect x="1744" y="896" width="16" height="114" fill="#713A40"/>
  <rect x="360" y="1180" width="90" height="18" fill="#D8CCBC"/>
  <rect x="430" y="1210" width="80" height="16" fill="#D8CCBC"/>
  <rect x="390" y="1240" width="88" height="16" fill="#D8CCBC"/>
  <ellipse cx="1860" cy="1120" rx="70" ry="86" fill="#294238"/>
  <rect x="1848" y="1188" width="22" height="50" fill="#4A3224"/>
  <ellipse cx="1200" cy="1200" rx="70" ry="22" fill="#B28A52" opacity="0.45"/>
  <rect x="1178" y="1040" width="18" height="90" fill="#B28A52"/>
</svg>`;
}

function mobilePoster() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1170" height="1560" viewBox="0 0 1170 1560" role="img" aria-hidden="true">
  <rect width="1170" height="1560" fill="#E8DFD0"/>
  <ellipse cx="585" cy="1280" rx="460" ry="140" fill="#6E7A68"/>
  <rect x="470" y="520" width="22" height="420" fill="#14241F"/>
  <rect x="678" y="520" width="22" height="420" fill="#14241F"/>
  <rect x="470" y="504" width="230" height="22" fill="#6B4A32"/>
  <rect x="576" y="560" width="8" height="220" fill="#4A3224"/>
  <rect x="536" y="668" width="88" height="8" fill="#4A3224"/>
  <rect x="160" y="980" width="220" height="20" fill="#6B4A32"/>
  <ellipse cx="270" cy="970" rx="28" ry="10" fill="#B28A52" opacity="0.7"/>
  <rect x="820" y="900" width="16" height="90" fill="#713A40"/>
  <rect x="842" y="888" width="14" height="102" fill="#4A3224"/>
  <rect x="862" y="908" width="16" height="82" fill="#294238"/>
  <ellipse cx="900" cy="1160" rx="48" ry="60" fill="#294238"/>
  <ellipse cx="585" cy="1188" rx="48" ry="16" fill="#B28A52" opacity="0.45"/>
</svg>`;
}

export function writeChapterHouseAssets() {
  mkdirSync(publicModels, { recursive: true });
  mkdirSync(publicImages, { recursive: true });
  writeFileSync(join(publicModels, "chapter-house.glb"), buildGlb());
  writeFileSync(join(publicImages, "chapter-house-desktop.svg"), desktopPoster());
  writeFileSync(join(publicImages, "chapter-house-mobile.svg"), mobilePoster());
}

const invoked = process.argv[1] && process.argv[1].includes("author-chapter-house");
if (invoked) {
  writeChapterHouseAssets();
  console.log("Authored Chapter House architecture and posters.");
}
