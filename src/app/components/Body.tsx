"use client";

import React, { Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
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

function Loader() {
  return (
    <Html center>
      <div style={{ color: "#666", fontSize: 14 }}>Loading...</div>
    </Html>
  );
}

type BoundsNumbers = {
  sizeY: number;
  centerX: number;
  centerY: number;
  centerZ: number;
};

function Human({
  onSelect,
  selectedPart,
  onBounds,
}: {
  onSelect?: (name: PartName) => void;
  selectedPart?: PartName | null;
  onBounds?: (b: BoundsNumbers) => void;
}) {
  const gltf = useGLTF("/models/human.glb");

  const meshes = React.useMemo(() => {
    const scene = gltf.scene;

    scene.scale.set(0.1, 0.1, 0.1);
    scene.position.set(0, 0, 0);

    const list: THREE.Mesh[] = [];
    scene.traverse((obj: any) => {
      if (obj?.isMesh) list.push(obj);
    });
    return list;
  }, [gltf.scene]);

  React.useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    onBounds?.({
      sizeY: size.y,
      centerX: center.x,
      centerY: center.y,
      centerZ: center.z,
    });
  }, [gltf.scene, onBounds]);

  React.useEffect(() => {
    meshes.forEach((mesh) => {
      const material = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (!material) return;
      material.color.set(mesh.name === selectedPart ? "#3b82f6" : "#ffffff");
    });
  }, [selectedPart, meshes]);

  const handlePointerDown = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      const name = e.object?.name as PartName | undefined;
      if (name && TARGET_PARTS.includes(name)) onSelect?.(name);
    },
    [onSelect]
  );

  return <primitive object={gltf.scene} onPointerDown={handlePointerDown} />;
}

useGLTF.preload("/models/human.glb");

/**
 * ✅ 足が切れないように「安全マージン」を入れた縦フィット
 * - fill を 0.90〜0.95 あたりにして “必ず上下入る” を優先
 * - targetY は centerY（上下均等）にして足が欠けにくくする
 */
function FitCameraSafe({
  bounds,
  controlsRef,
  fov,
  fill = 0.92, // ✅ ここが肝：小さくするほど引いて上下が入る
}: {
  bounds: BoundsNumbers | null;
  controlsRef: React.RefObject<any>;
  fov: number;
  fill?: number;
}) {
  const { camera } = useThree();

  React.useEffect(() => {
    if (!bounds) return;

    const cam = camera as THREE.PerspectiveCamera;
    if (!("isPerspectiveCamera" in cam) || !cam.isPerspectiveCamera) return;

    const { sizeY, centerX, centerY, centerZ } = bounds;

    const vFov = (fov * Math.PI) / 180;
    const dist = (sizeY / 2) / (Math.tan(vFov / 2) * fill);

    cam.fov = fov;
    cam.near = Math.max(0.01, dist / 200);
    cam.far = dist * 200;

    // ✅ 上下均等に入れる（centerYを見る）
    cam.position.set(centerX, centerY, centerZ + dist);
    cam.lookAt(centerX, centerY, centerZ);
    cam.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(centerX, centerY, centerZ);
      controlsRef.current.update();
    }
  }, [bounds, camera, controlsRef, fov, fill]);

  return null;
}

type BodyProps = {
  onSelect?: (name: PartName) => void;
  selectedPart?: PartName | null;

  heightVh?: number;
  maxWidthPx?: number;
  fov?: number;

  /** 詰め具合（0.90〜0.95推奨） */
  fill?: number;
};

const Body: React.FC<BodyProps> = ({
  onSelect,
  selectedPart,
  heightVh = 100,
  maxWidthPx = 448,
  fov = 45,
  fill = 0.92,
}) => {
  const controlsRef = React.useRef<any>(null);
  const [bounds, setBounds] = React.useState<BoundsNumbers | null>(null);

  return (
    <div className="w-full mx-auto" style={{ height: `${heightVh}vh`, maxWidth: `${maxWidthPx}px` }}>
      <Canvas camera={{ fov, near: 0.01, far: 5000, position: [0, 0, 5] }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableRotate
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />

        <Suspense fallback={<Loader />}>
          <Human onSelect={onSelect} selectedPart={selectedPart} onBounds={setBounds} />
        </Suspense>

        <FitCameraSafe bounds={bounds} controlsRef={controlsRef} fov={fov} fill={fill} />
      </Canvas>
    </div>
  );
};

export default Body;
