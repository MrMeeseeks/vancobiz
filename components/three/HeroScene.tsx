"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  mobile: boolean;
  reducedMotion: boolean;
};

const CYAN = new THREE.Color("#00F0FF");
const VIOLET = new THREE.Color("#7000FF");
const GOLD = new THREE.Color("#FFB800");

/** Shared pointer + scroll state, written by window listeners and read in useFrame (no re-renders). */
function useInputRefs() {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return { pointer, scroll };
}

function useVGeometry() {
  return useMemo(() => {
    // A chunky, slightly asymmetric "V" so it reads as a sculpture, not a font glyph.
    const s = new THREE.Shape();
    s.moveTo(-1.35, 1.25);
    s.lineTo(-0.62, 1.25);
    s.lineTo(0, -0.28);
    s.lineTo(0.66, 1.25);
    s.lineTo(1.38, 1.25);
    s.lineTo(0.3, -1.25);
    s.lineTo(-0.3, -1.25);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.16,
      bevelSize: 0.12,
      bevelSegments: 10,
      curveSegments: 12,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);
}

function Sculpture({ mobile, reducedMotion }: Props) {
  const group = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Mesh>(null);
  const distort = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer, scroll } = useInputRefs();
  const vGeo = useVGeometry();
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? "grab" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = scroll.current;
    const damp = 1 - Math.pow(0.001, delta); // frame-rate independent easing

    // Tilt toward the cursor.
    const targetY = pointer.current.x * 0.55 + p * 1.4 + (reducedMotion ? 0 : Math.sin(t * 0.3) * 0.12);
    const targetX = -pointer.current.y * 0.35 + p * 0.35;
    g.rotation.y += (targetY - g.rotation.y) * damp * 0.5;
    g.rotation.x += (targetX - g.rotation.x) * damp * 0.5;

    // Morph + scale on scroll.
    // Fit the sculpture to the canvas width so it never crowds the headline.
    const fit = Math.min(0.58, state.viewport.width / 6.4);
    const targetScale = fit * (1 - p * 0.35) * (hovered ? 1.06 : 1);
    // Time-based (~1s to settle) so the grow-in looks the same at 30fps or 120fps.
    const sc = THREE.MathUtils.lerp(g.scale.x, targetScale, 1 - Math.pow(0.02, Math.min(delta, 0.1)));
    g.scale.setScalar(sc);
    g.position.y = THREE.MathUtils.lerp(g.position.y, p * 1.1 + (reducedMotion ? 0 : Math.sin(t * 0.8) * 0.06), damp);

    if (distort.current) {
      const target = 0.32 + p * 0.35 + (hovered ? 0.15 : 0);
      distort.current.distort = THREE.MathUtils.lerp(distort.current.distort, target, damp * 0.3);
    }
    if (blob.current) blob.current.rotation.z = t * 0.08;

    // Lighting shift on hover: cyan key warms to gold, violet rim intensifies.
    if (keyLight.current && rimLight.current) {
      tmpColor.copy(hovered ? GOLD : CYAN);
      keyLight.current.color.lerp(tmpColor, damp * 0.25);
      keyLight.current.intensity = THREE.MathUtils.lerp(keyLight.current.intensity, hovered ? 60 : 35, damp * 0.3);
      rimLight.current.intensity = THREE.MathUtils.lerp(rimLight.current.intensity, hovered ? 70 : 40, damp * 0.3);
      keyLight.current.position.set(pointer.current.x * 4, pointer.current.y * 3 + 1, 4);
    }
  });

  return (
    <>
      <pointLight ref={keyLight} color={CYAN} intensity={35} distance={20} position={[3, 2, 4]} />
      <pointLight ref={rimLight} color={VIOLET} intensity={40} distance={20} position={[-4, -2, -2]} />
      {/* Starts at 0 and eases up to its fitted size: a grow-in intro. */}
      <group ref={group} scale={0}>
        <mesh
          geometry={vGeo}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhysicalMaterial
            color="#d8dce6"
            metalness={1}
            roughness={0.07}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={1}
            iridescenceIOR={1.7}
            iridescenceThicknessMinimum={180}
            iridescenceThicknessMaximum={820}
            envMapIntensity={1.4}
          />
        </mesh>
        {/* Ferrofluid core sitting behind the V */}
        <mesh ref={blob} position={[0, 0.05, -0.9]} scale={1.25}>
          <sphereGeometry args={[1, mobile ? 64 : 128, mobile ? 64 : 128]} />
          <MeshDistortMaterial
            ref={distort}
            color="#0d0d14"
            metalness={1}
            roughness={0.12}
            distort={0.32}
            speed={reducedMotion ? 0 : 1.6}
            envMapIntensity={1.2}
          />
        </mesh>
      </group>
    </>
  );
}

export default function HeroScene({ mobile, reducedMotion }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering when the hero is off screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.2], fov: 38 }}
        aria-hidden="true"
      >
        <ambientLight intensity={0.15} />
        <Suspense fallback={null}>
          <Sculpture mobile={mobile} reducedMotion={reducedMotion} />
          {/* Procedural studio environment: no HDR download needed. */}
          <Environment resolution={mobile ? 128 : 256}>
            <Lightformer form="rect" intensity={4} color="#00F0FF" position={[-4, 2, 3]} scale={[4, 8, 1]} />
            <Lightformer form="rect" intensity={4} color="#7000FF" position={[4, -1, 2]} scale={[4, 8, 1]} />
            <Lightformer form="ring" intensity={3} color="#FFB800" position={[0, 4, -4]} scale={3} />
            <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0, 6]} scale={[10, 2, 1]} />
          </Environment>
          {!reducedMotion && (
            <Sparkles
              count={mobile ? 28 : 80}
              scale={[8, 6, 4]}
              size={mobile ? 2 : 2.6}
              speed={0.35}
              opacity={0.7}
              color="#00F0FF"
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
