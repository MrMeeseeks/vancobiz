"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
type OrbitControlsImpl = { enabled: boolean; target: THREE.Vector3; update: () => void };
import * as THREE from "three";
import { TILE } from "./tileColors";

/* A 2x2x2 puzzle cube whose solved front face is the Tile Grid logo.
   Moves: twist one of the two layers on an axis by a quarter turn. */

type Axis = 0 | 1 | 2;
type Move = { axis: Axis; layer: 1 | -1; dir: 1 | -1; record: boolean };
export type CubeApi = { scramble: () => void; solve: () => void; frontView: () => void };
export type CubeStatus = { moves: number; solved: boolean; busy: boolean };

const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
const HOMES: [number, number, number][] = [];
for (const x of [-0.5, 0.5]) for (const y of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) HOMES.push([x, y, z]);

type StickerSpec = { axis: Axis; sign: 1 | -1; key: string };

/** Which sticker sits on each outward face of a cubie in the solved cube. */
function stickersFor([x, y, z]: [number, number, number]): StickerSpec[] {
  const out: StickerSpec[] = [];
  // Front (+z): the logo. V top-left, B bottom-right, orange on the other diagonal.
  if (z > 0) out.push({ axis: 2, sign: 1, key: x < 0 && y > 0 ? "V" : x > 0 && y < 0 ? "B" : "orange" });
  // Back (-z): one-colour variant, read from behind (viewer's left is +x).
  if (z < 0) out.push({ axis: 2, sign: -1, key: x > 0 && y > 0 ? "V-light" : x < 0 && y < 0 ? "B-light" : "light" });
  if (x > 0) out.push({ axis: 0, sign: 1, key: "orange" });
  if (x < 0) out.push({ axis: 0, sign: -1, key: "purple" });
  if (y > 0) out.push({ axis: 1, sign: 1, key: "amber" });
  if (y < 0) out.push({ axis: 1, sign: -1, key: "slate" });
  return out;
}

function makeTexture(bg: string, letter: string | null, ink: string, family: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 256, 256);
  g.fillStyle = bg;
  g.beginPath();
  g.roundRect(6, 6, 244, 244, 30);
  g.fill();
  // Subtle top sheen so stickers read as glossy plastic.
  const sheen = g.createLinearGradient(0, 0, 0, 256);
  sheen.addColorStop(0, "rgba(255,255,255,0.16)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  g.fillStyle = sheen;
  g.beginPath();
  g.roundRect(6, 6, 244, 244, 30);
  g.fill();
  if (letter) {
    g.fillStyle = ink;
    g.font = `800 170px ${family}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(letter, 128, 140);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function useStickerTextures(ready: boolean, family: string) {
  return useMemo(() => {
    if (!ready) return null;
    return {
      V: makeTexture(TILE.purple, "V", "#FFFFFF", family),
      B: makeTexture(TILE.purple, "B", "#FFFFFF", family),
      orange: makeTexture(TILE.orange, null, "", family),
      purple: makeTexture(TILE.purple, null, "", family),
      amber: makeTexture(TILE.amber, null, "", family),
      slate: makeTexture(TILE.slate, null, "", family),
      light: makeTexture(TILE.light, null, "", family),
      "V-light": makeTexture(TILE.light, "V", TILE.ink, family),
      "B-light": makeTexture(TILE.light, "B", TILE.ink, family),
    } as Record<string, THREE.CanvasTexture>;
  }, [ready, family]);
}

const STICKER_ROT: Record<string, [number, number, number]> = {
  "2:1": [0, 0, 0],
  "2:-1": [0, Math.PI, 0],
  "0:1": [0, Math.PI / 2, 0],
  "0:-1": [0, -Math.PI / 2, 0],
  "1:1": [-Math.PI / 2, 0, 0],
  "1:-1": [Math.PI / 2, 0, 0],
};

function Cubie({
  home,
  index,
  textures,
  groupRef,
  onDown,
}: {
  home: [number, number, number];
  index: number;
  textures: Record<string, THREE.CanvasTexture>;
  groupRef: (g: THREE.Group | null) => void;
  onDown: (index: number, e: ThreeEvent<PointerEvent>) => void;
}) {
  const stickers = useMemo(() => stickersFor(home), [home]);
  return (
    <group ref={groupRef} position={home} onPointerDown={(e) => onDown(index, e)}>
      <RoundedBox args={[0.98, 0.98, 0.98]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={TILE.body} roughness={0.45} metalness={0.2} />
      </RoundedBox>
      {stickers.map((s) => {
        const pos: [number, number, number] = [0, 0, 0];
        pos[s.axis] = s.sign * 0.493;
        return (
          <mesh key={`${s.axis}${s.sign}`} position={pos} rotation={STICKER_ROT[`${s.axis}:${s.sign}`]}>
            <planeGeometry args={[0.9, 0.9]} />
            <meshPhysicalMaterial
              map={textures[s.key]}
              transparent
              alphaTest={0.4}
              roughness={0.28}
              clearcoat={0.6}
              clearcoatRoughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function snapAxis(v: THREE.Vector3): { axis: Axis; sign: 1 | -1 } {
  const a = [Math.abs(v.x), Math.abs(v.y), Math.abs(v.z)];
  const axis = (a[0] >= a[1] && a[0] >= a[2] ? 0 : a[1] >= a[2] ? 1 : 2) as Axis;
  return { axis, sign: v.getComponent(axis) >= 0 ? 1 : -1 };
}

function Rig({
  textures,
  apiRef,
  onStatus,
  reducedMotion,
}: {
  textures: Record<string, THREE.CanvasTexture>;
  apiRef: RefObject<CubeApi | null>;
  onStatus: (s: CubeStatus) => void;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const get = useThree((s) => s.get);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const setOrbit = (on: boolean) => {
    const c = get().controls as OrbitControlsImpl | null;
    if (c) c.enabled = on;
  };
  const groups = useRef<(THREE.Group | null)[]>([]);
  const cubies = useRef(HOMES.map((h) => ({ home: new THREE.Vector3(...h), pos: new THREE.Vector3(...h), quat: new THREE.Quaternion() })));
  const queue = useRef<Move[]>([]);
  const history = useRef<Move[]>([]);
  const anim = useRef<null | { move: Move; t: number; ids: number[]; p0: THREE.Vector3[]; q0: THREE.Quaternion[]; dur: number }>(null);
  const drag = useRef<null | { index: number; n: THREE.Vector3; p0: THREE.Vector3; plane: THREE.Plane }>(null);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);

  const isSolved = () => {
    const q0 = cubies.current[0].quat;
    return cubies.current.every((c) => {
      if (c.quat.angleTo(q0) > 0.01) return false;
      const expected = c.home.clone().applyQuaternion(q0);
      return expected.distanceTo(c.pos) < 0.01;
    });
  };

  const report = () =>
    onStatus({ moves: history.current.length, solved: isSolved(), busy: !!anim.current || queue.current.length > 0 });

  const sync = (i: number) => {
    const g = groups.current[i];
    const c = cubies.current[i];
    if (!g) return;
    g.position.copy(c.pos);
    g.quaternion.copy(c.quat);
  };

  const commit = (m: Move, ids: number[], p0: THREE.Vector3[], q0: THREE.Quaternion[]) => {
    const q = new THREE.Quaternion().setFromAxisAngle(AXES[m.axis], (m.dir * Math.PI) / 2);
    ids.forEach((i, k) => {
      const c = cubies.current[i];
      c.pos.copy(p0[k]).applyQuaternion(q);
      c.pos.set(Math.sign(c.pos.x) * 0.5, Math.sign(c.pos.y) * 0.5, Math.sign(c.pos.z) * 0.5);
      c.quat.copy(q).multiply(q0[k]).normalize();
      sync(i);
    });
    if (m.record) history.current.push(m);
  };

  const layerIds = (m: Move) =>
    cubies.current.map((c, i) => (c.pos.getComponent(m.axis) * m.layer > 0 ? i : -1)).filter((i) => i >= 0);

  const randomMoves = (n: number) => {
    const out: Move[] = [];
    let last: Move | null = null;
    while (out.length < n) {
      const m: Move = {
        axis: Math.floor(Math.random() * 3) as Axis,
        layer: Math.random() < 0.5 ? 1 : -1,
        dir: Math.random() < 0.5 ? 1 : -1,
        record: true,
      };
      if (last && last.axis === m.axis && last.layer === m.layer && last.dir === -m.dir) continue;
      out.push(m);
      last = m;
    }
    return out;
  };

  const solveMoves = () =>
    history.current
      .slice()
      .reverse()
      .map((m) => ({ ...m, dir: (-m.dir) as 1 | -1, record: false }));

  // Public controls for the page's buttons.
  useEffect(() => {
    apiRef.current = {
      scramble: () => {
        queue.current.push(...randomMoves(14));
        report();
      },
      solve: () => {
        queue.current.push(...solveMoves());
        history.current = [];
        report();
      },
      frontView: () => {
        camera.position.set(1.6, 1.4, 6.1);
        const c = get().controls as OrbitControlsImpl | null;
        c?.target.set(0, 0, 0);
        c?.update();
      },
    };
  });

  // Intro: start scrambled, then assemble into the logo.
  useEffect(() => {
    randomMoves(10).forEach((m) => {
      const ids = layerIds(m);
      commit(m, ids, ids.map((i) => cubies.current[i].pos.clone()), ids.map((i) => cubies.current[i].quat.clone()));
    });
    report();
    const t = window.setTimeout(() => {
      queue.current.push(...solveMoves());
      history.current = [];
      report();
    }, 900);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useFrame((_, delta) => {
    if (!anim.current && queue.current.length) {
      const m = queue.current.shift()!;
      const ids = layerIds(m);
      anim.current = {
        move: m,
        t: 0,
        ids,
        p0: ids.map((i) => cubies.current[i].pos.clone()),
        q0: ids.map((i) => cubies.current[i].quat.clone()),
        dur: reducedMotion ? 0.001 : m.record ? 0.2 : 0.24,
      };
    }
    const a = anim.current;
    if (!a) return;
    a.t = Math.min(1, a.t + delta / a.dur);
    const e = a.t < 0.5 ? 2 * a.t * a.t : 1 - Math.pow(-2 * a.t + 2, 2) / 2;
    tmpQ.setFromAxisAngle(AXES[a.move.axis], ((a.move.dir * Math.PI) / 2) * e);
    a.ids.forEach((i, k) => {
      const g = groups.current[i];
      if (!g) return;
      g.position.copy(a.p0[k]).applyQuaternion(tmpQ);
      g.quaternion.copy(tmpQ).multiply(a.q0[k]);
    });
    if (a.t >= 1) {
      commit(a.move, a.ids, a.p0, a.q0);
      anim.current = null;
      report();
    }
  });

  // Drag a tile to twist its layer.
  const onDown = (index: number, e: ThreeEvent<PointerEvent>) => {
    if (!e.face) return;
    e.stopPropagation();
    const n = e.face.normal.clone().transformDirection(e.object.matrixWorld);
    const { axis, sign } = snapAxis(n);
    const nAxis = AXES[axis].clone().multiplyScalar(sign);
    drag.current = { index, n: nAxis, p0: e.point.clone(), plane: new THREE.Plane().setFromNormalAndCoplanarPoint(nAxis, e.point) };
    setOrbit(false);
  };

  useEffect(() => {
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const r = gl.domElement.getBoundingClientRect();
      ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (!ray.ray.intersectPlane(d.plane, hit)) return;
      const delta = hit.clone().sub(d.p0);
      delta.addScaledVector(d.n, -delta.dot(d.n));
      if (delta.length() < 0.22) return;
      const { axis: dAxis, sign: dSign } = snapAxis(delta);
      const D = AXES[dAxis].clone().multiplyScalar(dSign);
      const A = d.n.clone().cross(D); // rotating about A moves this face toward D
      const { axis, sign } = snapAxis(A);
      const c = cubies.current[d.index];
      const layer = (c.pos.getComponent(axis) > 0 ? 1 : -1) as 1 | -1;
      queue.current.push({ axis, layer, dir: sign, record: true });
      drag.current = null;
      setOrbit(true);
      report();
    };
    const up = () => {
      drag.current = null;
      setOrbit(true);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handlers read refs
  }, [camera, gl, controls]);

  return (
    <group>
      {HOMES.map((h, i) => (
        <Cubie
          key={i}
          home={h}
          index={i}
          textures={textures}
          groupRef={(g) => {
            groups.current[i] = g;
          }}
          onDown={onDown}
        />
      ))}
    </group>
  );
}

export default function TileCube({
  apiRef,
  onStatus,
  reducedMotion,
}: {
  apiRef: RefObject<CubeApi | null>;
  onStatus: (s: CubeStatus) => void;
  reducedMotion: boolean;
}) {
  const [family, setFamily] = useState("");

  // Letters are drawn with the site's Syne font, so wait for it before painting textures.
  useEffect(() => {
    const fam = getComputedStyle(document.documentElement).getPropertyValue("--font-syne").trim() || "sans-serif";
    document.fonts
      .load(`800 100px ${fam}`)
      .catch(() => undefined)
      .then(() => setFamily(fam));
  }, []);
  const textures = useStickerTextures(family !== "", family);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [3.6, 2.8, 5.2], fov: 32 }}
      style={{ touchAction: "none" }}
      aria-label="Interactive VancoBiz tile cube. Drag a tile to twist a layer, drag the background to turn the cube."
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color={TILE.purple} />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color={TILE.orange} position={[-5, 0, 2]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color={TILE.purple} position={[5, 0, -2]} scale={[3, 6, 1]} />
      </Environment>
      {textures && <Rig textures={textures} apiRef={apiRef} onStatus={onStatus} reducedMotion={reducedMotion} />}
      <OrbitControls makeDefault enablePan={false} enableZoom={false} rotateSpeed={0.8} />
    </Canvas>
  );
}
