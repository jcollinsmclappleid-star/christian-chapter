"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, SoftShadows, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import { DESKTOP_CAMERA, HOUSE_DESTINATIONS, HOUSE_MODEL_ROOTS, MOBILE_CAMERA, type HouseCapability, type HouseMode } from "./houseContent";
import { HOUSE_PALETTE } from "./housePalette";
import { HouseFurnishings } from "./houseFurnishings";
import type { HouseState } from "./houseState";

const MODEL_URL = "/models/chapter-house.glb";

type CanvasProps = {
  state: HouseState;
  capability: HouseCapability;
  mobile: boolean;
  paused?: boolean;
  onSelectMode: (mode: HouseMode) => void;
};

function poseFor(mode: HouseMode, mobile: boolean) {
  return (mobile ? MOBILE_CAMERA : DESKTOP_CAMERA)[mode];
}

function CameraRig({
  mode,
  mobile,
  paused,
}: {
  mode: HouseMode;
  mobile: boolean;
  paused?: boolean;
}) {
  const { camera, invalidate } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1.05, -0.6));

  useEffect(() => {
    const pose = poseFor(mode, mobile);
    if (paused) {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(targetRef.current);
      camera.position.set(...pose.position);
      targetRef.current.set(...pose.target);
      camera.lookAt(targetRef.current);
      invalidate();
      return;
    }
    const duration = mobile ? 0.7 : 1.15;
    const positionTween = gsap.to(camera.position, {
      x: pose.position[0],
      y: pose.position[1],
      z: pose.position[2],
      duration,
      ease: "power3.inOut",
      onUpdate: invalidate,
    });
    const targetTween = gsap.to(targetRef.current, {
      x: pose.target[0],
      y: pose.target[1],
      z: pose.target[2],
      duration,
      ease: "power3.inOut",
      onUpdate: () => {
        camera.lookAt(targetRef.current);
        invalidate();
      },
    });
    return () => {
      positionTween.kill();
      targetTween.kill();
    };
  }, [camera, invalidate, mobile, mode, paused]);

  return null;
}

const MATERIAL_REMAP: Record<string, string> = {
  plaster: HOUSE_PALETTE.parchment,
  plastershadow: HOUSE_PALETTE.plasterShadow,
  plaster_shadow: HOUSE_PALETTE.plasterShadow,
  oak: HOUSE_PALETTE.walnut,
  oakdark: HOUSE_PALETTE.walnutDark,
  oak_dark: HOUSE_PALETTE.walnutDark,
  wood: HOUSE_PALETTE.walnut,
  brass: HOUSE_PALETTE.gold,
  evergreen: HOUSE_PALETTE.forest,
  planting: HOUSE_PALETTE.sage,
  oxblood: HOUSE_PALETTE.oxblood,
  stone: HOUSE_PALETTE.limestone,
  path: HOUSE_PALETTE.limestone,
  lawn: HOUSE_PALETTE.ground,
  ink: HOUSE_PALETTE.ink,
};

function retintMaterial(material: THREE.Material, objectName: string) {
  if (!(material instanceof THREE.MeshStandardMaterial)) return;
  const key = material.name.replace(/\s+/g, "").toLowerCase();
  const mapped = MATERIAL_REMAP[key];
  const exterior = /pier|Threshold_Left|Threshold_Right/i.test(objectName);
  material.color.set(exterior ? HOUSE_PALETTE.ink : mapped ?? material.color);
  material.emissive.set("#000000");
  material.emissiveIntensity = 0;
  material.roughness = /brass|gold/i.test(material.name) ? 0.32 : 0.8;
  material.metalness = /brass|gold/i.test(material.name) ? 0.62 : 0.03;
  material.needsUpdate = true;
}

function cloneMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
    const cloned = Array.isArray(child.material)
      ? child.material.map((material) => material.clone())
      : child.material.clone();
    child.material = cloned;
    (Array.isArray(cloned) ? cloned : [cloned]).forEach((material) => retintMaterial(material, child.name));
  });
}

function HouseArchitecture() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    cloneMaterials(clone);
    return clone;
  }, [scene]);

  return <primitive object={model} />;
}

function SelectionGlow({ mode }: { mode: HouseMode }) {
  const destination = HOUSE_DESTINATIONS.find((item) => item.id === mode);
  if (!destination) return null;
  const [x, , z] = destination.position;
  return <pointLight position={[x, 1.7, z]} intensity={0.55} color="#F3D7A0" distance={5.5} decay={2} />;
}

function InteractionZone({
  position,
  onSelect,
}: {
  position: [number, number, number];
  onSelect: () => void;
}) {
  return (
    <mesh
      position={[position[0], 0.75, position[2]]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <boxGeometry args={[1.8, 1.5, 1.8]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function HouseWorld(props: CanvasProps) {
  const welcome = poseFor("welcome", props.mobile);

  return (
    <>
      <color attach="background" args={[HOUSE_PALETTE.sky]} />
      <fog attach="fog" args={[HOUSE_PALETTE.sky, 14, 28]} />
      <hemisphereLight args={[HOUSE_PALETTE.parchment, HOUSE_PALETTE.sage, 0.9]} />
      <directionalLight
        position={[-4, 8, 6]}
        intensity={2.1}
        color="#F6E6C4"
        castShadow
        shadow-mapSize-width={props.capability === "A" ? 2048 : 1024}
        shadow-mapSize-height={props.capability === "A" ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <ambientLight intensity={0.32} color="#F3EDE3" />
      <Environment frames={1} resolution={props.capability === "A" ? 256 : 128}>
        <Lightformer intensity={1.8} position={[0, 4, 5]} scale={[6, 2.4, 1]} color="#F8E7C6" />
        <Lightformer intensity={0.45} position={[-5, 2, 1]} scale={[3, 3, 1]} color="#C9D3C6" />
      </Environment>
      {props.capability === "A" ? <SoftShadows size={18} samples={8} focus={0.65} /> : null}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.32} scale={16} blur={2.6} far={5} frames={props.paused ? 1 : Infinity} />
      <CameraRig mode={props.state.mode} mobile={props.mobile} paused={props.paused} />
      <SelectionGlow mode={props.state.mode} />
      <Suspense fallback={null}>
        <HouseArchitecture />
        <HouseFurnishings />
        {HOUSE_MODEL_ROOTS.map((rootName) => (
          <group key={rootName} name={`${rootName}Anchor`} />
        ))}
      </Suspense>
      {HOUSE_DESTINATIONS.map((destination) => (
        <InteractionZone
          key={destination.id}
          position={destination.position}
          onSelect={() => props.onSelectMode(destination.id)}
        />
      ))}
      <mesh visible={false} position={welcome.target}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
      </mesh>
    </>
  );
}

export default function ChapterHouseCanvas(props: CanvasProps) {
  const deviceDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;
  const dpr =
    props.capability === "A"
      ? Math.min(2, Math.max(1.5, deviceDpr))
      : Math.min(1.5, Math.max(1, deviceDpr));
  const start = poseFor("welcome", props.mobile);

  return (
    <Canvas
      aria-hidden
      tabIndex={-1}
      dpr={dpr}
      frameloop={props.paused ? "demand" : "always"}
      shadows
      style={{ width: "100%", height: "100%", display: "block" }}
      camera={{
        position: start.position,
        fov: props.mobile ? 36 : 30,
        near: 0.08,
        far: 36,
      }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl, camera }) => {
        gl.setPixelRatio(dpr);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.16;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.lookAt(new THREE.Vector3(...start.target));
      }}
      onPointerMissed={() => {
        if (!props.paused) props.onSelectMode("welcome");
      }}
    >
      <HouseWorld {...props} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
