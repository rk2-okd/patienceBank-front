"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

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

export type PartName = (typeof TARGET_PARTS)[number];
export const PART_LABELS_JA = {
  Core: "体の中心",
  Midline: "背骨",
  Face: "顔",
  NeckFront: "首",
  TorsoSide: "背中",
  TorsoFront: "お腹",
  Deltoid: "肩",
  UpperArm: "二の腕",
  Forearm: "腕（ひじ下）",
  Hands: "手",
  Glutes: "おしり",
  Thigh: "太もも",
  InnerThigh: "内もも",
  LowerLeg: "ふくらはぎ",
  Foot: "足",
} as const;


function Human({
  onSelect,
  selectedPart,
}: {
  onSelect?: (name: PartName) => void;
  selectedPart?: PartName | null;
}) {
  const gltf = useGLTF("/models/human.glb");

  gltf.scene.scale.set(0.1, 0.1, 0.1);
  gltf.scene.position.set(0, 1.0, 0);
  React.useEffect(() => {
    gltf.scene.traverse((obj: any) => {
      if (!obj.isMesh) return;

      const material = obj.material as THREE.MeshStandardMaterial;
      if (!material) return;

      if (obj.name === selectedPart) {
        material.color.set("#3b82f6"); // 青（Tailwind blue-500）
      } else {
        material.color.set("#ffffff"); // 元に戻す（白）
      }
    });
  }, [selectedPart, gltf.scene]);

  return (
    <primitive
      object={gltf.scene}
      onPointerDown={(e: any) => {
        e.stopPropagation();
        const name = e.object?.name as PartName | undefined;
        if (name && TARGET_PARTS.includes(name)) {
          onSelect?.(name);
        }
      }}
    />
  );
}

useGLTF.preload("/models/human.glb");

type BodyProps = {
  className?: string;
  onSelect?: (name: PartName) => void;
  selectedPart?: PartName | null;
  cameraPosition?: [number, number, number];
  fov?: number;
};

const Body: React.FC<BodyProps> = ({
  className = "w-full h-[50vh]",
  onSelect,
  selectedPart,
  cameraPosition = [0, 0, 12],
  fov = 35,
}) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: cameraPosition, fov }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Human onSelect={onSelect} selectedPart={selectedPart} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
export default Body;
