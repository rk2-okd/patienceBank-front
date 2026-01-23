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

const TARGET_SET: ReadonlySet<string> = new Set(TARGET_PARTS);

const SELECTED_COLOR = new THREE.Color("#3b82f6");
const DEFAULT_COLOR = new THREE.Color("#ffffff");

/**
 * Human（軽量化）
 * - traverseは初回だけ
 * - 選択色の更新は「前回」「今回」だけ
 */
const Human = React.memo(function Human({
  onSelect,
  selectedPart,
  onBounds,
}: {
  onSelect?: (name: PartName) => void;
  selectedPart?: PartName | null;
  onBounds?: (b: BoundsNumbers) => void;
}) {
  const { scene } = useGLTF("/models/human.glb");

  // 1) sceneの初期設定（scale/position）は一度だけ
  React.useLayoutEffect(() => {
    scene.scale.set(0.1, 0.1, 0.1);
    scene.position.set(0, 0, 0);
  }, [scene]);

  // 2) name -> mesh の辞書を一度だけ作る（毎レンダーで配列作らない）
  const meshMap = React.useMemo(() => {
    const map = new Map<string, THREE.Mesh>();
    scene.traverse((obj: any) => {
      if (obj?.isMesh) map.set(obj.name, obj as THREE.Mesh);
    });
    return map;
  }, [scene]);

  // 3) bounds計算（sceneが変わった時だけ）
  React.useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    onBounds?.({
      sizeY: size.y,
      centerX: center.x,
      centerY: center.y,
      centerZ: center.z,
    });
  }, [scene, onBounds]);

  // 4) 選択状態の色更新：全メッシュ更新をやめる
  const prevSelectedRef = React.useRef<PartName | null>(null);

  React.useEffect(() => {
    const prev = prevSelectedRef.current;
    const next = selectedPart ?? null;

    // 前回選択を戻す
    if (prev) {
      const prevMesh = meshMap.get(prev);
      const mat = prevMesh?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.color.copy(DEFAULT_COLOR);
    }

    // 今回選択を青に
    if (next) {
      const nextMesh = meshMap.get(next);
      const mat = nextMesh?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.color.copy(SELECTED_COLOR);
    }

    prevSelectedRef.current = next;
  }, [selectedPart, meshMap]);

  const handlePointerDown = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      const name = e.object?.name as string | undefined;
      if (!name) return;
      if (TARGET_SET.has(name)) onSelect?.(name as PartName);
    },
    [onSelect]
  );

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
});

useGLTF.preload("/models/human.glb");

/**
 * ✅ 足が切れないように「安全マージン」を入れた縦フィット
 */
function FitCameraSafe({
  bounds,
  controlsRef,
  fov,
  fill = 0.92,
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
    if (!cam.isPerspectiveCamera) return;

    const { sizeY, centerX, centerY, centerZ } = bounds;

    const vFov = (fov * Math.PI) / 180;
    const dist = (sizeY / 2) / (Math.tan(vFov / 2) * fill);

    cam.fov = fov;
    cam.near = Math.max(0.01, dist / 200);
    cam.far = dist * 200;

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
    <div
      className="w-full mx-auto"
      style={{ height: `${heightVh}vh`, maxWidth: `${maxWidthPx}px` }}
    >
      <Canvas
        camera={{ fov, near: 0.01, far: 5000, position: [0, 0, 5] }}
        style={{ width: "100%", height: "100%" }}
      >
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
