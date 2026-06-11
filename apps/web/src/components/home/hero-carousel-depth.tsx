"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

function DynamicGoldLight({ activeIndex }: { activeIndex: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const target = useRef(new THREE.Vector3(0, 0, 2));

  useFrame((state) => {
    const light = lightRef.current;
    if (!light) return;
    const t = state.clock.getElapsedTime();
    const angle = (activeIndex / 8) * Math.PI * 2 + t * 0.15;
    target.current.set(Math.cos(angle) * 1.8, Math.sin(t * 0.4) * 0.6, 2.2 + Math.sin(angle) * 0.4);
    light.position.lerp(target.current, 0.08);
    light.intensity = 1.1 + Math.sin(t * 1.2) * 0.15;
  });

  return <pointLight ref={lightRef} color="#D4AF37" intensity={1.1} distance={12} decay={2} />;
}

function DepthScene({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[2, 3, 4]} intensity={0.5} color="#F4E08D" />
      <DynamicGoldLight activeIndex={activeIndex} />
      <Sparkles count={48} speed={0.25} opacity={0.35} scale={[6, 4, 4]} size={2} color="#D4AF37" />
    </>
  );
}

export function HeroCarouselDepth({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] opacity-60" aria-hidden>
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <DepthScene activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}
