"use client";

import { useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { HOUSE_PALETTE } from "./housePalette";

export const FURNISHING_URLS = {
  table: "/models/furnishings/table.glb",
  books: "/models/furnishings/books-encyclopedia.glb",
  lamp: "/models/furnishings/lamp.glb",
  vase: "/models/furnishings/vase.glb",
  plant: "/models/furnishings/plant.glb",
  bench: "/models/furnishings/bench.glb",
} as const;

type Vec3 = [number, number, number];

function GroundedModel({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
}) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    clone.position.y -= box.min.y;
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = Array.isArray(child.material)
        ? child.material.map((material) => material.clone())
        : child.material.clone();
    });
    return clone;
  }, [scene]);

  return <primitive object={object} position={position} rotation={rotation} scale={scale} />;
}

function Plinth({ position, radius = 0.95 }: { position: Vec3; radius?: number }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <cylinderGeometry args={[radius, radius + 0.06, 0.08, 36]} />
      <meshStandardMaterial color={HOUSE_PALETTE.limestone} roughness={0.86} metalness={0.04} />
    </mesh>
  );
}

function SymbolIsland({ name, children }: { name: string; children: ReactNode }) {
  return <group name={name}>{children}</group>;
}

export function HouseFurnishings() {
  return (
    <group name="HouseSymbols">
      <SymbolIsland name="Table">
        <Plinth position={[-2.45, 0.04, 0.55]} radius={1.15} />
        <GroundedModel url={FURNISHING_URLS.table} position={[-2.45, 0.08, 0.55]} />
        <GroundedModel url={FURNISHING_URLS.vase} position={[-2.45, 0.92, 0.55]} scale={0.34} />
      </SymbolIsland>

      <SymbolIsland name="Library">
        <Plinth position={[2.45, 0.04, 0.35]} radius={0.82} />
        <GroundedModel url={FURNISHING_URLS.books} position={[2.28, 0.08, 0.35]} />
        <GroundedModel url={FURNISHING_URLS.books} position={[2.58, 0.08, 0.35]} />
        <GroundedModel url={FURNISHING_URLS.books} position={[2.45, 0.32, 0.38]} rotation={[0, 0.2, 0]} />
      </SymbolIsland>

      <SymbolIsland name="Path">
        <GroundedModel url={FURNISHING_URLS.bench} position={[-2.85, 0, -2.55]} rotation={[0, 0.45, 0]} />
      </SymbolIsland>

      <SymbolIsland name="Garden">
        <Plinth position={[2.8, 0.04, -2.15]} radius={0.72} />
        <GroundedModel url={FURNISHING_URLS.plant} position={[2.8, 0.08, -2.15]} scale={1.2} />
      </SymbolIsland>

      <SymbolIsland name="Courtyard">
        <Plinth position={[0, 0.04, -0.35]} radius={1.05} />
        <mesh position={[0, 0.22, -0.35]} receiveShadow castShadow>
          <cylinderGeometry args={[0.58, 0.7, 0.28, 36]} />
          <meshStandardMaterial color={HOUSE_PALETTE.limestone} roughness={0.74} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.38, -0.35]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial color={HOUSE_PALETTE.sage} roughness={0.32} metalness={0.1} />
        </mesh>
      </SymbolIsland>

      <SymbolIsland name="Membership">
        <Plinth position={[0.15, 0.04, -2.75]} radius={0.55} />
        <GroundedModel url={FURNISHING_URLS.lamp} position={[0.15, 0.08, -2.75]} />
      </SymbolIsland>
    </group>
  );
}

Object.values(FURNISHING_URLS).forEach((url) => useGLTF.preload(url));
