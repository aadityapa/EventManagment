"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// PNG texture — SVG textures decode unreliably across GPUs/browsers
const LOGO_SRC = "/brand/android-chrome-512.png";

/**
 * Real 3D brand coin — navy disc, metallic gold rim, logo on both faces.
 * Slow jewelry-display rotation with a gentle breathing tilt.
 */
function CoinMesh() {
  const group = useRef<THREE.Group>(null);
  const loaded = useLoader(THREE.TextureLoader, LOGO_SRC);
  const texture = useMemo(() => {
    const next = loaded.clone();
    next.colorSpace = THREE.SRGBColorSpace;
    next.anisotropy = 4;
    next.needsUpdate = true;
    return next;
  }, [loaded]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.5;
    // Pronounced breathing tilt so the coin's thickness reads clearly
    g.rotation.x = 0.16 + Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
  });

  return (
    <group ref={group}>
      {/* Floating logo — fully transparent background, artwork only.
          Standard material lets the gold key light glint across it as it turns. */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[2.6, 2.55]} />
        <meshStandardMaterial
          map={texture}
          transparent
          metalness={0.35}
          roughness={0.45}
          toneMapped={false}
        />
      </mesh>

      {/* Mirrored back so the logo reads correctly from both sides */}
      <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.6, 2.55]} />
        <meshStandardMaterial
          map={texture}
          transparent
          metalness={0.35}
          roughness={0.45}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function LogoCoinCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 2, 4]} intensity={1.9} color="#ffe8bf" />
      <directionalLight position={[-3, -1, 2]} intensity={0.7} color="#b47cff" />
      <Suspense fallback={null}>
        <CoinMesh />
      </Suspense>
      <Sparkles count={24} scale={5} size={2.2} speed={0.3} color="#f4d08d" opacity={0.7} />
    </Canvas>
  );
}
