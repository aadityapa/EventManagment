"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function useHero3DEnabled() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    const cores = navigator.hardwareConcurrency ?? 4;

    // Conservative defaults: keep the site smooth on low-end devices.
    return !reduced && (memory === undefined || memory >= 4) && cores >= 4;
  }, []);
}

function GoldKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = 1.7;

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.getElapsedTime();
    m.rotation.y += delta * 0.25;
    m.rotation.x = Math.sin(t * 0.35 + phase) * 0.18;
    m.position.y = Math.sin(t * 0.6 + phase) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0.2, 0, 0]} rotation={[0.2, 0.1, 0]}>
      <torusKnotGeometry args={[1.05, 0.32, 220, 28]} />
      <meshStandardMaterial
        color="#d4af37"
        metalness={1}
        roughness={0.18}
        emissive="#2a1a00"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

function HaloRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();
    g.rotation.z = t * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, -0.2, -0.4]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.6]} scale={1 + i * 0.28}>
          <torusGeometry args={[1.6, 0.02, 16, 200]} />
          <meshStandardMaterial
            color={i === 0 ? "#f4e4a1" : "#d4af37"}
            metalness={1}
            roughness={0.35}
            emissive="#d4af37"
            emissiveIntensity={0.25}
            transparent
            opacity={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["transparent"]} />
      <fog attach="fog" args={["#0a0a0a", 5, 12]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} color="#f4e4a1" />
      <pointLight position={[-3, 1.5, 2]} intensity={0.9} color="#d4af37" />

      <GoldKnot />
      <HaloRings />

      <Sparkles
        count={90}
        speed={0.3}
        opacity={0.22}
        scale={[8, 4, 6]}
        size={2.2}
        color="#f4e4a1"
      />
    </>
  );
}

export function HeroThreeCanvas() {
  const enabled = useHero3DEnabled();

  // Always render a lightweight container so layout stays stable.
  if (!enabled) return <div className="absolute inset-0" aria-hidden />;

  return (
    <div className="absolute inset-0 pointer-events-none opacity-70" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

