"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { Mesh } from "three";

const TARGET_PARTS = [
  "Core",
  "Midline",
  "Face",
  "NeckFront",
  "TorsoSide",
  "TorsoFront",
  "Deltoid",
  "UpperArm",
  "Forearm",
  "Hands",
  "Glutes",
  "Thigh",
  "InnerThigh",
  "LowerLeg",
  "Foot",
] as const;

type PartName = (typeof TARGET_PARTS)[number];

function Human({ onSelect }: { onSelect: (name: PartName) => void }) {
  const gltf = useGLTF("/models/human.glb");

  // 表示位置調整
  gltf.scene.position.set(0, -1.2, 0);

  return (
    <primitive
      object={gltf.scene}
      onPointerDown={(e: any) => {
        e.stopPropagation();
        const name = e.object?.name as PartName | undefined;
        if (name && TARGET_PARTS.includes(name)) {
          onSelect(name);
        }
      }}
    />
  );
}


export default function Page() {
  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: [0, 1.3, 5], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Human onSelect={(name) => console.log("selected:", name)} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

// Core
// Midline
// Face
// NeckFront
// TorsoSide
// Deltoid
// TorsoFront
// UpperArm
// Forearm
// Hands
// Glutes
// Thigh
// InnerThigh
// LowerLeg
// Foot