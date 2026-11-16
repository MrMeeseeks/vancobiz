"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { PALETTES, type LogoKey, type PaletteKey } from "@/lib/design";
import { LOGO_PATHS, type LogoShape } from "@/lib/logoPaths";

type Props = {
  mobile: boolean;
  reducedMotion: boolean;
  palette: PaletteKey;
  logo: LogoKey;
};

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

/* ---------- geometry ---------- */

function abstractV() {
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
}

/** Extrudes one stroke of the traced VB mark. Logo coords are ~[-1,1]; `scale` sets world size. */
function logoStroke(shapes: LogoShape[], scale: number, depth: number) {
  const threeShapes = shapes.map(({ outer, holes }) => {
    const s = new THREE.Shape(outer.map(([x, y]) => new THREE.Vector2(x * scale, y * scale)));
    s.holes = holes.map((h) => new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x * scale, y * scale))));
    return s;
  });
  const g = new THREE.ExtrudeGeometry(threeShapes, {
    depth,
    bevelEnabled: true,
    // Script strokes are thin, so the bevel stays small to keep the letterforms crisp.
    bevelThickness: 0.035,
    bevelSize: 0.022,
    bevelSegments: 4,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/* ---------- materials ---------- */

function Chrome({ tint, amount = 0.3 }: { tint?: string; amount?: number }) {
  const color = useMemo(() => {
    const c = new THREE.Color("#d8dce6");
    if (tint) c.lerp(new THREE.Color(tint), amount);
    return c;
  }, [tint, amount]);
  return (
    <meshPhysicalMaterial
      color={color}
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
  );
}

function Gloss({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.25}
      roughness={0.22}
      clearcoat={1}
      clearcoatRoughness={0.08}
      envMapIntensity={1.1}
    />
  );
}

/* ---------- logo variants ---------- */

function LogoModel({ logo, palette }: { logo: LogoKey; palette: PaletteKey }) {
  const c = PALETTES[palette];
  const geo = useMemo(() => {
    if (logo === "chrome-v") return { v: abstractV(), b: null };
    if (logo === "medallion")
      return { v: logoStroke(LOGO_PATHS.v, 1.0, 0.12), b: logoStroke(LOGO_PATHS.b, 1.0, 0.12) };
    return { v: logoStroke(LOGO_PATHS.v, 1.55, 0.34), b: logoStroke(LOGO_PATHS.b, 1.55, 0.34) };
  }, [logo]);

  useEffect(
    () => () => {
      geo.v.dispose();
      geo.b?.dispose();
    },
    [geo],
  );

  if (logo === "chrome-v") {
    return (
      <mesh geometry={geo.v}>
        <Chrome />
      </mesh>
    );
  }

  if (logo === "medallion") {
    return (
      <group>
        {/* Coin body, facing the camera */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.22, 96]} />
          <meshPhysicalMaterial color="#141018" metalness={0.9} roughness={0.3} clearcoat={1} envMapIntensity={1.1} />
        </mesh>
        {/* Rim */}
        <mesh>
          <torusGeometry args={[1.3, 0.07, 24, 120]} />
          <Chrome tint={c.a3} amount={0.55} />
        </mesh>
        <group position={[0, 0, 0.17]}>
          <mesh geometry={geo.v}>
            <Chrome tint={c.logoV} amount={0.55} />
          </mesh>
          {geo.b && (
            <mesh geometry={geo.b}>
              <Chrome tint={c.logoB} amount={0.55} />
            </mesh>
          )}
        </group>
      </group>
    );
  }

  const brand = logo === "brand-vb";
  return (
    <group>
      <mesh geometry={geo.v}>{brand ? <Gloss color={c.logoV} /> : <Chrome tint={c.logoV} amount={0.5} />}</mesh>
      {geo.b && (
        <mesh geometry={geo.b}>{brand ? <Gloss color={c.logoB} /> : <Chrome tint={c.logoB} amount={0.5} />}</mesh>
      )}
    </group>
  );
}

function Sculpture({ mobile, reducedMotion, palette, logo }: Props) {
  const group = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Mesh>(null);
  const distort = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer, scroll } = useInputRefs();
  const colors = useMemo(() => {
    const p = PALETTES[palette];
    return { key: new THREE.Color(p.a1), rim: new THREE.Color(p.a2), hover: new THREE.Color(p.a3) };
  }, [palette]);

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

    // Fit to the canvas width so it never crowds the headline; shrink + morph on scroll.
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

    // Lighting shift on hover: key light warms to the highlight colour, rim intensifies.
    if (keyLight.current && rimLight.current) {
      keyLight.current.color.lerp(hovered ? colors.hover : colors.key, damp * 0.25);
      rimLight.current.color.lerp(colors.rim, damp * 0.25);
      keyLight.current.intensity = THREE.MathUtils.lerp(keyLight.current.intensity, hovered ? 60 : 35, damp * 0.3);
      rimLight.current.intensity = THREE.MathUtils.lerp(rimLight.current.intensity, hovered ? 70 : 40, damp * 0.3);
      keyLight.current.position.set(pointer.current.x * 4, pointer.current.y * 3 + 1, 4);
    }
  });

  return (
    <>
      <pointLight ref={keyLight} color={colors.key} intensity={35} distance={20} position={[3, 2, 4]} />
      <pointLight ref={rimLight} color={colors.rim} intensity={40} distance={20} position={[-4, -2, -2]} />
      {/* Starts at 0 and eases up to its fitted size: a grow-in intro. */}
      <group
        ref={group}
        scale={0}
        position-x={logo === "chrome-v" ? 0 : 0.25}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <LogoModel logo={logo} palette={palette} />
        {logo !== "medallion" && (
          /* Ferrofluid core sitting behind the mark */
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
        )}
      </group>
    </>
  );
}

export default function HeroScene(props: Props) {
  const { mobile, reducedMotion, palette } = props;
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const c = PALETTES[palette];

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
          <Sculpture {...props} />
          {/* Procedural studio environment (no HDR download). Keyed so it re-bakes on palette change. */}
          <Environment key={`env-${palette}`} resolution={mobile ? 128 : 256}>
            <Lightformer form="rect" intensity={4} color={c.a1} position={[-4, 2, 3]} scale={[4, 8, 1]} />
            <Lightformer form="rect" intensity={4} color={c.a2} position={[4, -1, 2]} scale={[4, 8, 1]} />
            <Lightformer form="ring" intensity={3} color={c.a3} position={[0, 4, -4]} scale={3} />
            <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[0, 0, 6]} scale={[10, 2, 1]} />
          </Environment>
          {!reducedMotion && (
            <Sparkles
              key={`sparks-${palette}`}
              count={mobile ? 28 : 80}
              scale={[8, 6, 4]}
              size={mobile ? 2 : 2.6}
              speed={0.35}
              opacity={0.7}
              color={c.a1}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
