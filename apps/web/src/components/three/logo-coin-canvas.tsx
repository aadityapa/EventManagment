"use client";

import { Suspense, useRef } from "react";
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
  const texture = useLoader(THREE.TextureLoader, LOGO_SRC);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.5;
    g.rotation.x = 0.1 + Math.sin(state.clock.elapsedTime * 0.45) * 0.06;
  });

  return (
    <group ref={group}>
      {/* Coin body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.62, 1.62, 0.14, 72]} />
        <meshStandardMaterial color="#1a2a55" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Metallic gold rim */}
      <mesh>
        <torusGeometry args={[1.62, 0.075, 24, 96]} />
        <meshStandardMaterial
          color="#d8b26a"
          metalness={1}
          roughness={0.22}
          emissive="#2a1a00"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Logo — front face */}
      <mesh position={[0, 0, 0.085]}>
        <planeGeometry args={[2.2, 2.16]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>

      {/* Logo — back face */}
      <mesh position={[0, 0, -0.085]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.2, 2.16]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
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
