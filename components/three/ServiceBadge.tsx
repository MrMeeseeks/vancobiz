"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ServiceKey } from "@/lib/content";

function Shape({ kind }: { kind: ServiceKey }) {
  switch (kind) {
    case "social":
      return <octahedronGeometry args={[0.85, 0]} />;
    case "video":
      return <torusGeometry args={[0.62, 0.22, 16, 48]} />;
    case "photo":
      return <icosahedronGeometry args={[0.82, 0]} />;
    case "events":
      return <torusKnotGeometry args={[0.5, 0.16, 96, 12]} />;
  }
}

function Badge({ kind, color, active }: { kind: ServiceKey; color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const damp = 1 - Math.pow(0.002, delta);
    g.rotation.y += delta * (active ? 1.6 : 0.45);
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.25;
    // Elevate toward the viewer on hover.
    g.position.z = THREE.MathUtils.lerp(g.position.z, active ? 0.9 : 0, damp);
    g.position.y = THREE.MathUtils.lerp(g.position.y, active ? 0.15 : Math.sin(state.clock.elapsedTime) * 0.06, damp);
  });

  return (
    <group ref={group}>
      <mesh>
        <Shape kind={kind} />
        <meshStandardMaterial color="#1a1a22" metalness={1} roughness={0.25} />
      </mesh>
      <mesh scale={1.04}>
        <Shape kind={kind} />
        <meshBasicMaterial color={color} wireframe transparent opacity={active ? 0.95 : 0.55} />
      </mesh>
    </group>
  );
}

export default function ServiceBadge({
  kind,
  color,
  active,
}: {
  kind: ServiceKey;
  color: string;
  active: boolean;
}) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true }} aria-hidden="true">
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 3]} intensity={25} color={color} />
      <pointLight position={[-2, -1, 2]} intensity={12} color="#ffffff" />
      <Badge kind={kind} color={color} active={active} />
    </Canvas>
  );
}
