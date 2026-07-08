"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
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

/** Eases the camera toward the pointer for a subtle 3D parallax drift. */
function ParallaxRig() {
  useFrame((state, delta) => {
    const { camera, pointer } = state;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.55, 2.4, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.32, 2.4, delta);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function GoldKnot() {
  const meshRef = useRef<THREE.Mesh>(null);
  const phase = 1.7;

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.getElapsedTime();
    m.rotation.y += delta * 0.22;
    m.rotation.x = Math.sin(t * 0.35 + phase) * 0.18;
    m.position.y = Math.sin(t * 0.6 + phase) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0.2, 0, 0]} rotation={[0.2, 0.1, 0]}>
      <torusKnotGeometry args={[1.05, 0.3, 220, 28]} />
      <meshStandardMaterial
        color="#d8b26a"
        metalness={1}
        roughness={0.16}
        emissive="#2a1a00"
        emissiveIntensity={0.4}
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
    g.rotation.x = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, -0.2, -0.4]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.6]} scale={1 + i * 0.28}>
          <torusGeometry args={[1.6, 0.02, 16, 200]} />
          <meshStandardMaterial
            color={i === 1 ? "#b47cff" : i === 0 ? "#f4d08d" : "#d8b26a"}
            metalness={1}
            roughness={0.35}
            emissive={i === 1 ? "#8b4dff" : "#d8b26a"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Small floating gems orbiting the centrepiece. */
function FloatingGems() {
  const gems = useMemo(
    () =>
      [
        { pos: [-2.1, 1.1, -0.6], scale: 0.16, color: "#f4d08d" },
        { pos: [2.3, -0.9, -0.8], scale: 0.2, color: "#b47cff" },
        { pos: [-1.7, -1.3, 0.2], scale: 0.12, color: "#d8b26a" },
        { pos: [1.9, 1.4, -0.3], scale: 0.14, color: "#d9a47b" },
      ] as const,
    []
  );

  return (
    <>
      {gems.map((g, i) => (
        <Float key={i} speed={1.6 + i * 0.3} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={g.pos as unknown as [number, number, number]} scale={g.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={g.color}
              metalness={1}
              roughness={0.2}
              emissive={g.color}
              emissiveIntensity={0.35}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#050816", 5, 13]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 3]} intensity={1.25} color="#f4d08d" />
      <pointLight position={[-3, 1.5, 2]} intensity={0.9} color="#d8b26a" />
      <pointLight position={[2.5, -2, 3]} intensity={0.7} color="#8b4dff" />

      <ParallaxRig />
      <GoldKnot />
      <HaloRings />
      <FloatingGems />

      <Sparkles count={110} speed={0.3} opacity={0.24} scale={[9, 5, 6]} size={2.4} color="#f4e4a1" />
      <Sparkles count={40} speed={0.18} opacity={0.16} scale={[9, 5, 6]} size={4} color="#c79bff" />
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
