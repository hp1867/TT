'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  Environment,
  Sparkles,
  OrbitControls,
} from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

function Racket() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ mouse, clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = mouse.x * 0.6 + t * 0.18;
    group.current.rotation.x = -mouse.y * 0.3 + Math.sin(t * 0.7) * 0.05;
    group.current.position.y = Math.sin(t * 1.2) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={1.1}>
      {/* Handle */}
      <mesh position={[0, -1.3, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 1, 24]} />
        <meshStandardMaterial
          color="#0d0f16"
          roughness={0.35}
          metalness={0.6}
        />
      </mesh>
      {/* Handle grip */}
      <mesh position={[0, -1.45, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.55, 24]} />
        <meshStandardMaterial
          color="#161a26"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* Blade (thin disc) */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.08, 64]} />
        <meshStandardMaterial
          color="#0a0e18"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      {/* Rubber front */}
      <mesh position={[0, -0.2, 0.05]} castShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.02, 64]} />
        <meshStandardMaterial
          color="#ff1d4b"
          roughness={0.35}
          metalness={0.15}
          emissive="#3a000d"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Rubber back */}
      <mesh position={[0, -0.2, -0.05]} castShadow>
        <cylinderGeometry args={[0.92, 0.92, 0.02, 64]} />
        <meshStandardMaterial
          color="#0d0f16"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      {/* Neon edge ring */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.96, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Ball({ orbitRadius = 1.6 }: { orbitRadius?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.cos(t * 1.4) * orbitRadius;
    ref.current.position.z = Math.sin(t * 1.4) * orbitRadius;
    ref.current.position.y = Math.sin(t * 2.0) * 0.5 + 0.6;
    ref.current.rotation.x += 0.06;
    ref.current.rotation.y += 0.04;
  });
  return (
    <mesh ref={ref} castShadow>
      <icosahedronGeometry args={[0.16, 3]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#7ad8ff"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.15}
      />
    </mesh>
  );
}

function NeonRing({ tilt = 0.5 }: { tilt?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref} position={[0, -0.2, 0]} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[2.2, 0.01, 16, 200]} />
      <meshStandardMaterial
        color="#3b82ff"
        emissive="#3b82ff"
        emissiveIntensity={1.8}
        toneMapped={false}
      />
    </mesh>
  );
}

function MouseLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return;
    ref.current.position.x = (mouse.x * viewport.width) / 2;
    ref.current.position.y = (mouse.y * viewport.height) / 2;
  });
  return (
    <pointLight
      ref={ref}
      color="#00f0ff"
      intensity={20}
      distance={6}
      position={[0, 0, 2.5]}
    />
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.4, 4.6], fov: 45 }}
      >
        <color attach="background" args={['#04060a']} />
        <fog attach="fog" args={['#04060a', 6, 14]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.2}
          color="#9ec7ff"
          castShadow
        />
        <pointLight position={[-4, -2, -2]} color="#7a5cff" intensity={6} />
        <MouseLight />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
            <Racket />
          </Float>
          <Ball orbitRadius={1.7} />
          <Ball orbitRadius={2.4} />
          <NeonRing tilt={0.6} />
          <NeonRing tilt={-0.3} />
          <Sparkles
            count={140}
            scale={[8, 5, 4]}
            size={2}
            speed={0.4}
            color="#7ad8ff"
          />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
      <div className="scene-vignette" />
    </div>
  );
}
