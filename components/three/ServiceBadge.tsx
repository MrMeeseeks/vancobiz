"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { ServiceKey } from "@/lib/content";

/* All four badges are built from primitives (no model downloads): dark metal bodies with
   glowing outlines in the card colour, plus one hover animation that says what the service is. */

type ModelProps = { color: string; hoverRef: RefObject<number> };

const METAL = { color: "#1a1a22", metalness: 1, roughness: 0.28 } as const;

function roundedRectPath(path: THREE.Path, w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

function heartGeometry(size: number, depth: number) {
  const s = new THREE.Shape();
  s.moveTo(5, 5);
  s.bezierCurveTo(5, 5, 4, 0, 0, 0);
  s.bezierCurveTo(-6, 0, -6, 7, -6, 7);
  s.bezierCurveTo(-6, 11, -3, 15.4, 5, 19);
  s.bezierCurveTo(12, 15.4, 16, 11, 16, 7);
  s.bezierCurveTo(16, 7, 16, 0, 10, 0);
  s.bezierCurveTo(7, 0, 5, 5, 5, 5);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: depth / size,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 1,
    bevelSegments: 4,
  });
  g.center();
  g.rotateZ(Math.PI);
  g.scale(size, size, size);
  return g;
}

/* ---------- 01 Social: chat bubble with a beating heart; likes float up on hover ---------- */

function SocialModel({ color, hoverRef }: ModelProps) {
  const bubble = useMemo(() => {
    const w = 1.7, h = 1.2, r = 0.3;
    const l = -w / 2, rt = w / 2, t = h / 2, b = -h / 2;
    const s = new THREE.Shape();
    s.moveTo(l + r, t);
    s.lineTo(rt - r, t);
    s.quadraticCurveTo(rt, t, rt, t - r);
    s.lineTo(rt, b + r);
    s.quadraticCurveTo(rt, b, rt - r, b);
    s.lineTo(l + 0.62, b);
    s.lineTo(l + 0.22, b - 0.4); // speech tail
    s.lineTo(l + 0.34, b);
    s.lineTo(l + r, b);
    s.quadraticCurveTo(l, b, l, b + r);
    s.lineTo(l, t - r);
    s.quadraticCurveTo(l, t, l + r, t);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    g.translate(0, 0.1, -0.11);
    return g;
  }, []);
  const heart = useMemo(() => heartGeometry(0.03, 0.12), []);
  const bigHeart = useRef<THREE.Mesh>(null);
  const likes = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const h = hoverRef.current ?? 0;
    if (bigHeart.current) {
      const beat = 1 + (0.06 + h * 0.14) * Math.max(0, Math.sin(t * (3 + h * 5)));
      bigHeart.current.scale.setScalar(beat);
    }
    likes.current.forEach((m, i) => {
      if (!m) return;
      const ph = (t * 0.7 + i / 5) % 1;
      m.position.set(Math.sin(i * 2.3) * 0.55 + Math.sin(t * 2 + i) * 0.06, 0.45 + ph * 1.0, 0.25);
      m.scale.setScalar(Math.sin(ph * Math.PI) * 0.4 * h);
    });
  });

  return (
    <group scale={0.85}>
      <mesh geometry={bubble}>
        <meshStandardMaterial {...METAL} />
        <Edges color={color} threshold={20} />
      </mesh>
      <mesh ref={bigHeart} geometry={heart} position={[0, 0.12, 0.2]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.3} roughness={0.3} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} ref={(m) => { likes.current[i] = m; }} geometry={heart} scale={0}>
          <meshBasicMaterial color={i % 2 ? "#ffffff" : color} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- 02 Video: vertical phone with a play button; Reels scroll on hover ---------- */

function VideoModel({ color, hoverRef }: ModelProps) {
  const frame = useMemo(() => {
    const outer = roundedRectPath(new THREE.Shape(), 0.95, 1.65, 0.16) as THREE.Shape;
    outer.holes.push(roundedRectPath(new THREE.Path(), 0.8, 1.42, 0.1));
    const g = new THREE.ExtrudeGeometry(outer, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 });
    g.translate(0, 0, -0.07);
    return g;
  }, []);
  const play = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.11, -0.14);
    s.lineTo(0.16, 0);
    s.lineTo(-0.11, 0.14);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    g.center();
    return g;
  }, []);
  const playRef = useRef<THREE.Mesh>(null);
  const clips = useRef<(THREE.Mesh | null)[]>([]);
  const scroll = useRef(0);
  const SPACING = 0.44;
  const N = 4;

  useFrame((_, delta) => {
    const h = hoverRef.current ?? 0;
    scroll.current += delta * (0.08 + h * 0.9);
    clips.current.forEach((m, i) => {
      if (!m) return;
      const y = (((i * SPACING + scroll.current) % (N * SPACING)) + N * SPACING) % (N * SPACING) - (N * SPACING) / 2;
      m.position.y = y;
      // Fade out at the top and bottom of the screen so clips never spill over the bezel.
      const fade = THREE.MathUtils.clamp((0.62 - Math.abs(y)) / 0.22, 0, 1);
      (m.material as THREE.MeshBasicMaterial).opacity = fade * (0.18 + h * 0.4);
    });
    if (playRef.current) {
      playRef.current.position.z = 0.12 + h * 0.35;
      playRef.current.scale.setScalar(1 + h * 0.25);
    }
  });

  return (
    <group>
      <mesh geometry={frame}>
        <meshStandardMaterial {...METAL} />
        <Edges color={color} threshold={20} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[0.8, 1.42]} />
        <meshBasicMaterial color="#0b0b10" />
      </mesh>
      {Array.from({ length: N }, (_, i) => (
        <mesh key={i} ref={(m) => { clips.current[i] = m; }} position={[0, 0, 0]}>
          <planeGeometry args={[0.66, 0.36]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      ))}
      <mesh ref={playRef} geometry={play} position={[0.02, 0, 0.12]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---------- 03 Photo: camera lens; the aperture opens and the glass flashes on hover ---------- */

const BLADES = 7;

function PhotoModel({ color, hoverRef }: ModelProps) {
  const blade = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.15);
    s.lineTo(0.5, -0.22);
    s.lineTo(0.5, 0.22);
    s.lineTo(0, 0.15);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  const blades = useRef<(THREE.Mesh | null)[]>([]);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const flash = useRef(0);
  const wasOpen = useRef(false);

  useFrame((_, delta) => {
    const h = hoverRef.current ?? 0;
    const r = 0.08 + h * 0.28; // iris radius (blades stay inside the bezel when open)
    blades.current.forEach((m) => {
      if (m) m.position.x = r;
    });
    const open = h > 0.6;
    if (open && !wasOpen.current) flash.current = 1; // "click"
    wasOpen.current = open;
    flash.current = Math.max(0, flash.current - delta * 2.2);
    if (glass.current) glass.current.emissiveIntensity = flash.current * 2.5;
  });

  return (
    <group scale={0.95}>
      {/* Barrel */}
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.74, 0.8, 0.55, 48, 1, true]} />
        <meshStandardMaterial {...METAL} side={THREE.DoubleSide} />
      </mesh>
      {/* Front bezel hides the blades' outer ends */}
      <mesh position-z={0.28}>
        <ringGeometry args={[0.58, 0.9, 48]} />
        <meshStandardMaterial {...METAL} side={THREE.DoubleSide} />
      </mesh>
      {[0.3, 0.05, -0.2].map((z, i) => (
        <mesh key={z} position-z={z}>
          <torusGeometry args={[i === 0 ? 0.7 : 0.79, i === 0 ? 0.035 : 0.025, 12, 64]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      {/* Aperture blades */}
      {Array.from({ length: BLADES }, (_, i) => (
        <group key={i} rotation-z={(i / BLADES) * Math.PI * 2} position-z={0.1 + i * 0.004}>
          <mesh ref={(m) => { blades.current[i] = m; }} geometry={blade} rotation-z={0.55}>
            <meshStandardMaterial color="#24242e" metalness={0.9} roughness={0.35} side={THREE.DoubleSide} />
            <Edges color={color} threshold={1} />
          </mesh>
        </group>
      ))}
      {/* Glass */}
      <mesh position-z={0.22}>
        <circleGeometry args={[0.58, 48]} />
        <meshPhysicalMaterial
          ref={glass}
          color="#151a3a"
          transparent
          opacity={0.35}
          metalness={0.2}
          roughness={0.05}
          clearcoat={1}
          emissive="#ffffff"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

/* ---------- 04 Events: two cocktail glasses clink and pop confetti on hover ---------- */

function Glass({ geo, color }: { geo: THREE.LatheGeometry; color: string }) {
  return (
    <>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.2} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geo} scale={1.01}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
      {/* Drink */}
      <mesh position-y={0.76}>
        <cylinderGeometry args={[0.34, 0.07, 0.3, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>
    </>
  );
}

const CONFETTI = 28;

function EventsModel({ color, hoverRef }: ModelProps) {
  const glassGeo = useMemo(() => {
    const pts = [
      [0.001, 0], [0.26, 0], [0.26, 0.03], [0.05, 0.06], [0.035, 0.12],
      [0.035, 0.52], [0.06, 0.56], [0.42, 0.92], [0.44, 0.94],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 18);
  }, []);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const bits = useRef<(THREE.Mesh | null)[]>([]);
  const sim = useMemo(
    () =>
      Array.from({ length: CONFETTI }, () => ({
        p: new THREE.Vector3(),
        v: new THREE.Vector3(),
        spin: new THREE.Vector3(),
        life: 0,
      })),
    [],
  );
  const clinked = useRef(false);
  const palette = useMemo(() => [color, "#ffffff", "#FFC66B", "#9B5CFF"], [color]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const h = hoverRef.current ?? 0;
    const e = h * h * (3 - 2 * h); // smoothstep
    if (left.current && right.current) {
      left.current.rotation.z = 0.16 - e * 0.5;
      right.current.rotation.z = -0.16 + e * 0.5;
      left.current.position.x = -0.46 + e * 0.1;
      right.current.position.x = 0.46 - e * 0.1;
    }
    // Clink: launch confetti once each time the glasses meet.
    if (h > 0.92 && !clinked.current) {
      clinked.current = true;
      sim.forEach((c) => {
        c.p.set(0, 0.42, 0.1);
        c.v.set((Math.random() - 0.5) * 2.6, 1.2 + Math.random() * 1.6, (Math.random() - 0.3) * 1.2);
        c.spin.set(Math.random() * 10, Math.random() * 10, Math.random() * 10);
        c.life = 1.4 + Math.random() * 0.5;
      });
    }
    if (h < 0.5) clinked.current = false;

    sim.forEach((c, i) => {
      const m = bits.current[i];
      if (!m) return;
      if (c.life <= 0) {
        m.visible = false;
        return;
      }
      c.life -= delta;
      c.v.y -= 4.2 * delta;
      c.v.multiplyScalar(1 - 0.6 * delta);
      c.p.addScaledVector(c.v, delta);
      m.visible = true;
      m.position.copy(c.p);
      m.rotation.x += c.spin.x * delta;
      m.rotation.y += c.spin.y * delta;
      m.scale.setScalar(Math.min(1, c.life * 2));
    });
  });


  return (
    <group position-y={-0.55}>
      <group ref={left} position-x={-0.46}>
        <Glass geo={glassGeo} color={color} />
      </group>
      <group ref={right} position-x={0.46}>
        <Glass geo={glassGeo} color={color} />
      </group>
      <group position-y={0.55}>
        {sim.map((_, i) => (
          <mesh key={i} ref={(m) => { bits.current[i] = m; }} visible={false}>
            <planeGeometry args={[0.07, 0.12]} />
            <meshBasicMaterial color={palette[i % palette.length]} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- shared wrapper ---------- */

function Badge({ kind, color, active }: { kind: ServiceKey; color: string; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const hoverRef = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const damp = 1 - Math.pow(0.002, delta);
    hoverRef.current = THREE.MathUtils.lerp(hoverRef.current, active ? 1 : 0, 1 - Math.pow(0.02, delta));
    // Gentle sway (not a full spin) so the icon always reads from the front.
    g.rotation.y = Math.sin(t * 0.7) * 0.35;
    g.rotation.x = Math.sin(t * 0.5) * 0.12;
    g.position.z = THREE.MathUtils.lerp(g.position.z, active ? 0.5 : 0, damp);
    g.position.y = THREE.MathUtils.lerp(g.position.y, active ? 0.05 : Math.sin(t) * 0.05, damp);
  });

  const props = { color, hoverRef };
  return (
    <group ref={group}>
      {kind === "social" && <SocialModel {...props} />}
      {kind === "video" && <VideoModel {...props} />}
      {kind === "photo" && <PhotoModel {...props} />}
      {kind === "events" && <EventsModel {...props} />}
    </group>
  );
}

export default function ServiceBadge({ kind, color, active }: { kind: ServiceKey; color: string; active: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.4], fov: 40 }} gl={{ alpha: true }} aria-hidden="true">
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 3]} intensity={25} color={color} />
      <pointLight position={[-2, -1, 2]} intensity={14} color="#ffffff" />
      <Badge kind={kind} color={color} active={active} />
    </Canvas>
  );
}
