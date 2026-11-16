"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  /** Window-normalised pointer (-1..1), shared with the rest of the scene. */
  pointer: RefObject<{ x: number; y: number }>;
  /** 0..1 extra agitation (hover, scroll). */
  boost: RefObject<number>;
  color: string;
  segments: number;
  reducedMotion: boolean;
  /** Max forward extent (local units) so the surface stays behind whatever sits in front. */
  maxFront?: number;
  /** Receives the current agitation (0..~1.5) each frame so other things can react to it. */
  agitationRef?: RefObject<number>;
};

const TAU = Math.PI * 2;

/**
 * A symbiote-style liquid mass. Vertices are displaced on the CPU every frame:
 * - a slow, oily surface churn (layered sines),
 * - a bulge that reaches toward the cursor and splits into spiky ridges,
 * - tendrils that whip around the body; all of it gets wilder the faster the mouse moves.
 */
export default function VenomBlob({ pointer, boost, color, segments, reducedMotion, maxFront = 0.75, agitationRef }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(1, segments, segments), [segments]);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);
  const state = useRef({ px: 0, py: 0, agitation: 0, dir: new THREE.Vector3(0, 0, 1) });
  const target = useMemo(() => new THREE.Vector3(), []);
  const tendrils = useMemo(() => [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], []);

  const { body, emissive } = useMemo(() => {
    const c = new THREE.Color(color);
    // Near-black with a purple soul: very dark body, purple only in the glow and highlights.
    return { body: c.clone().multiplyScalar(0.1), emissive: c.clone().multiplyScalar(0.6) };
  }, [color]);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((frame, rawDelta) => {
    const m = mesh.current;
    const p = pointer.current;
    if (!m || !p) return;
    const delta = Math.min(rawDelta, 0.1);
    const t = reducedMotion ? 0 : frame.clock.elapsedTime;
    const s = state.current;

    // Mouse speed -> agitation (rises fast, settles slowly).
    const speed = Math.hypot(p.x - s.px, p.y - s.py) / Math.max(delta, 1e-3);
    s.px = p.x;
    s.py = p.y;
    const want = Math.min(1.3, speed * 0.35) + (boost.current ?? 0);
    const rate = want > s.agitation ? 1 - Math.pow(0.0005, delta) : 1 - Math.pow(0.35, delta);
    s.agitation += (want - s.agitation) * rate;
    const a = reducedMotion ? 0 : s.agitation;
    if (agitationRef) agitationRef.current = a;

    // Direction the mass reaches toward (cursor sits in front of the scene).
    target.set(p.x * 1.6, p.y * 1.3, 0.35).normalize();
    s.dir.lerp(target, 1 - Math.pow(0.02, delta)).normalize();
    const dir = s.dir;

    for (let k = 0; k < 3; k++) {
      const ph = t * (0.45 + k * 0.17) + (k * TAU) / 3;
      tendrils[k].set(Math.cos(ph), Math.sin(ph * 1.3) * 0.8, 0.35 + 0.5 * Math.sin(ph * 0.7)).normalize();
    }

    const g = m.geometry;
    const pos = g.attributes.position.array as Float32Array;
    const churn = 0.07 + a * 0.08;
    const reach = 0.3 + a * 0.85;
    const whip = a * 1.1;

    for (let i = 0; i < pos.length; i += 3) {
      const nx = base[i];
      const ny = base[i + 1];
      const nz = base[i + 2];

      // Oily churn
      let r =
        1 +
        churn *
          (Math.sin(nx * 3.1 + t * 1.1) * Math.sin(ny * 2.7 + t * 0.9) * Math.sin(nz * 3.3 + t * 1.3) * 1.6 +
            Math.sin(nx * 7.0 + ny * 2.0 - t * 1.7) * 0.35 +
            Math.sin(nz * 8.0 - nx * 3.0 + t * 2.3) * 0.25);

      // Reach toward the cursor, breaking into spiky ridges near the tip.
      const d = nx * dir.x + ny * dir.y + nz * dir.z;
      if (d > 0) {
        const lobe = d * d * d * d;
        const ridges = 0.55 + 0.45 * Math.sin(nx * 19 + ny * 15 - nz * 11 + t * 4.5);
        r += reach * lobe * (0.6 + ridges * (0.4 + a));
      }

      // Whipping tendrils
      if (whip > 0.01) {
        for (let k = 0; k < 3; k++) {
          const tv = tendrils[k];
          const dk = nx * tv.x + ny * tv.y + nz * tv.z;
          if (dk > 0.85) {
            const q = (dk - 0.85) / 0.15; // 0..1 near the tendril axis
            r += whip * q * q * q * (0.7 + 0.3 * Math.sin(t * 6 + k));
          }
        }
      }

      // Never let the front surface reach the logo plane (it stays a backdrop).
      if (nz > 0.05) r = Math.min(r, maxFront / nz);

      pos[i] = nx * r;
      pos[i + 1] = ny * r;
      pos[i + 2] = nz * r;
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();

    const mat = m.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = 0.05 + a * 0.07;
  });

  return (
    <mesh ref={mesh} geometry={geo}>
      <meshPhysicalMaterial
        color={body}
        emissive={emissive}
        emissiveIntensity={0.06}
        metalness={0.6}
        roughness={0.22}
        clearcoat={0.35}
        clearcoatRoughness={0.18}
        iridescence={0.2}
        iridescenceIOR={1.4}
        envMapIntensity={0.16}
      />
    </mesh>
  );
}
