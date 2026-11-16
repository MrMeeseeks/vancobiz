"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { motion, useMotionValue, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { Handshake, RotateCcw, Sprout, Users } from "lucide-react";
import { CLUB } from "@/lib/content";
import { useCanHover, useReducedMotion } from "@/lib/useDevice";
import { VBMark } from "./Logo";

/* Engraved gold VancoBiz Club pass, matching the Club members cards (club site).
   viewBox 400 x 560; the crown is engraved at the centre of the rays (200, 235). */

const W = 400;
const H = 560;
const CX = 200;
const CY = 235;
const PERK_ICONS = [Users, Handshake, Sprout];
const RINGS = Array.from({ length: 70 }, (_, i) => 92 + i * 4.6);

/** Original crown silhouette: five points (outer ones ending in orbs), a jewelled band. */
function CrownShapes() {
  return (
    <>
      <path d="M128 268 L112 182 L156 222 L178 160 L200 206 L222 160 L244 222 L288 182 L272 268 Z" />
      <circle cx="112" cy="176" r="9" />
      <circle cx="178" cy="153" r="9" />
      <circle cx="222" cy="153" r="9" />
      <circle cx="288" cy="176" r="9" />
      <path d="M200 192 L208 202 L200 212 L192 202 Z" />
      <rect x="120" y="272" width="160" height="26" rx="6" />
    </>
  );
}

function CrownJewels() {
  return (
    <>
      <path d="M200 276 L209 285 L200 294 L191 285 Z" />
      <circle cx="160" cy="285" r="4.5" />
      <circle cx="240" cy="285" r="4.5" />
      <circle cx="140" cy="285" r="2.5" />
      <circle cx="260" cy="285" r="2.5" />
    </>
  );
}

function PlateArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vp-foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A6A1F" />
          <stop offset="0.24" stopColor="#C9A24B" />
          <stop offset="0.46" stopColor="#F3D98B" />
          <stop offset="0.54" stopColor="#FFC66B" />
          <stop offset="0.76" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#7A5C19" />
        </linearGradient>
        <linearGradient id="vp-crown-foil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE7A6" />
          <stop offset="0.4" stopColor="#D2A84E" />
          <stop offset="1" stopColor="#6F5418" />
        </linearGradient>
        <radialGradient id="vp-vignette" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0.5" stopColor="#3D2E0B" stopOpacity="0" />
          <stop offset="1" stopColor="#3D2E0B" stopOpacity="0.55" />
        </radialGradient>
        {/* Moving lights (attributes updated every frame from the tilt) */}
        <radialGradient id="vp-glare" cx="0.5" cy="0.4" r="0.45">
          <stop offset="0" stopColor="#FFFCEE" stopOpacity="0.7" />
          <stop offset="0.3" stopColor="#FFECB4" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFECB4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vp-band" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={W} y2={H}>
          <stop offset="0.3" stopColor="#FFD678" stopOpacity="0" />
          <stop offset="0.45" stopColor="#FFFAE6" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#D6A03C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vp-spec" gradientUnits="userSpaceOnUse" x1="80" y1="140" x2="320" y2="320">
          {/* soft halo, hot core, then a thinner secondary glint */}
          <stop offset="0.36" stopColor="#FFF3CC" stopOpacity="0" />
          <stop offset="0.45" stopColor="#FFF3CC" stopOpacity="0.45" />
          <stop offset="0.49" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.515" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.56" stopColor="#FFF3CC" stopOpacity="0.3" />
          <stop offset="0.6" stopColor="#FFF3CC" stopOpacity="0" />
          <stop offset="0.63" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="0.645" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <pattern id="vp-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#6F5418" strokeWidth="0.9" />
        </pattern>
        <pattern id="vp-border" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#7A5C19" />
          <path d="M6 1.6 L10.4 6 L6 10.4 L1.6 6 Z" fill="none" stroke="#F3D98B" strokeWidth="0.8" />
          <path d="M6 4 L8 6 L6 8 L4 6 Z" fill="#C9A24B" />
          <circle cx="0" cy="6" r="1" fill="#FFF4D2" />
          <circle cx="12" cy="6" r="1" fill="#FFF4D2" />
        </pattern>
        <mask id="vp-crown-mask">
          <g fill="white">
            <CrownShapes />
          </g>
        </mask>
      </defs>

      {/* Foil ground */}
      <rect width={W} height={H} fill="url(#vp-foil)" />

      {/* Rays + guilloche centred on the crown */}
      <g transform={`translate(${CX} ${CY})`}>
        {Array.from({ length: 144 }, (_, i) => {
          const a = (i / 144) * Math.PI * 2;
          const r1 = i % 2 ? 360 : 420;
          return (
            <line
              key={i}
              x1={(Math.cos(a) * 120).toFixed(1)}
              y1={(Math.sin(a) * 120).toFixed(1)}
              x2={(Math.cos(a) * r1).toFixed(1)}
              y2={(Math.sin(a) * r1).toFixed(1)}
              stroke={i % 2 ? "#FFF4D2" : "#6F5418"}
              strokeOpacity={i % 2 ? 0.3 : 0.36}
              strokeWidth="0.6"
            />
          );
        })}
        <g fill="none">
          {RINGS.map((r) => (
            <circle key={r} r={r} stroke="#6F5418" strokeOpacity="0.26" strokeWidth="0.45" />
          ))}
          {Array.from({ length: 32 }, (_, i) => (
            <ellipse key={i} rx="150" ry="58" transform={`rotate(${(i * 180) / 32})`} stroke="#FFF4D2" strokeOpacity="0.34" strokeWidth="0.45" />
          ))}
          {/* Engraved bead bezel around the crown */}
          <circle r="112" stroke="#5E4714" strokeOpacity="0.6" strokeWidth="0.9" />
          <circle r="106" stroke="#FFF4D2" strokeWidth="2.6" strokeDasharray="0 6" strokeLinecap="round" strokeOpacity="0.85" />
          <circle r="100" stroke="#5E4714" strokeOpacity="0.6" strokeWidth="0.9" />
        </g>
      </g>

      <rect width={W} height={H} fill="url(#vp-vignette)" />

      {/* Engraved crown: drop shadow, lit bevel (moves opposite the light), foil body, hatching */}
      <g fill="#2E220A" fillOpacity="0.55" transform="translate(2.5 3.5)">
        <CrownShapes />
      </g>
      <g data-vp="bevel" fill="#FFF6D8" fillOpacity="0.85" transform="translate(-1.5 -1.5)">
        <CrownShapes />
      </g>
      <g fill="url(#vp-crown-foil)">
        <CrownShapes />
      </g>
      <g fill="url(#vp-hatch)" fillOpacity="0.45">
        <CrownShapes />
      </g>
      {/* Engraved cut line around the crown */}
      <g fill="none" stroke="#3A2B0A" strokeOpacity="0.75" strokeWidth="1.3" strokeLinejoin="round">
        <CrownShapes />
      </g>
      <g fill="#5E4714" fillOpacity="0.85">
        <CrownJewels />
      </g>
      {/* High-specular streak that only lands on the crown */}
      <rect data-vp="specRect" width={W} height={H} fill="url(#vp-spec)" mask="url(#vp-crown-mask)" opacity="0" style={{ mixBlendMode: "screen" }} />

      {/* Plate-wide moving light */}
      <rect data-vp="bandRect" width={W} height={H} fill="url(#vp-band)" opacity="0" style={{ mixBlendMode: "color-dodge" }} />
      <rect data-vp="glareRect" width={W} height={H} fill="url(#vp-glare)" opacity="0" style={{ mixBlendMode: "overlay" }} />

      {/* Ornamental frame */}
      <path d={`M0 0H${W}V${H}H0Z M14 14V${H - 14}H${W - 14}V14Z`} fillRule="evenodd" fill="url(#vp-border)" />
      <rect x="0.75" y="0.75" width={W - 1.5} height={H - 1.5} fill="none" stroke="#FFF4D2" strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="14" y="14" width={W - 28} height={H - 28} fill="none" stroke="#5E4714" strokeWidth="1.2" />
      <rect x="17.5" y="17.5" width={W - 35} height={H - 35} fill="none" stroke="#FFF4D2" strokeOpacity="0.45" strokeWidth="0.6" />
    </svg>
  );
}

export default function GoldPass() {
  const [flipped, setFlipped] = useState(false);
  const canHover = useCanHover();
  const reduced = useReducedMotion();
  const tiltOn = canHover && !reduced;

  const rootRef = useRef<HTMLDivElement>(null);

  // Pointer position on the card (0..1) and how "on" the light is.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const on = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const son = useSpring(on, { stiffness: 120, damping: 20 });
  const rotateY = useTransform([sx, son], ([x, o]: number[]) => (x - 0.5) * 22 * o);
  const rotateX = useTransform([sy, son], ([y, o]: number[]) => -(y - 0.5) * 22 * o);

  const paint = () => {
    const root = rootRef.current;
    if (!root) return;
    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const refs = {
      glare: { current: q("#vp-glare") },
      band: { current: q("#vp-band") },
      spec: { current: q("#vp-spec") },
      bevel: { current: q("[data-vp=bevel]") },
      specRect: { current: q("[data-vp=specRect]") },
      bandRect: { current: q("[data-vp=bandRect]") },
      glareRect: { current: q("[data-vp=glareRect]") },
    };
    const rim = q<HTMLSpanElement>("[data-vp=rim]");
    const x = sx.get();
    const y = sy.get();
    const o = son.get();
    const dx = x - 0.5;
    const dy = y - 0.5;
    refs.glare.current?.setAttribute("cx", x.toFixed(3));
    refs.glare.current?.setAttribute("cy", y.toFixed(3));
    // Wide warm band sweeps across the plate.
    const bx = x * W;
    const by = y * H;
    refs.band.current?.setAttribute("x1", (bx - 260).toFixed(1));
    refs.band.current?.setAttribute("y1", (by - 200).toFixed(1));
    refs.band.current?.setAttribute("x2", (bx + 260).toFixed(1));
    refs.band.current?.setAttribute("y2", (by + 200).toFixed(1));
    // Narrow, hot streak across the crown, travelling faster than the pointer.
    const cx = CX + dx * 420;
    const cy = CY + dy * 300;
    refs.spec.current?.setAttribute("x1", (cx - 130).toFixed(1));
    refs.spec.current?.setAttribute("y1", (cy - 110).toFixed(1));
    refs.spec.current?.setAttribute("x2", (cx + 130).toFixed(1));
    refs.spec.current?.setAttribute("y2", (cy + 110).toFixed(1));
    // Lit bevel sits on the side facing the light.
    refs.bevel.current?.setAttribute("transform", `translate(${(dx * 4 - 1.5).toFixed(2)} ${(dy * 4 - 1.5).toFixed(2)})`);
    refs.specRect.current?.setAttribute("opacity", (0.35 + o * 0.65).toFixed(3));
    refs.bandRect.current?.setAttribute("opacity", (o * 0.6).toFixed(3));
    refs.glareRect.current?.setAttribute("opacity", o.toFixed(3));
    if (rim) {
      rim.style.setProperty("--rim-angle", `${((Math.atan2(dy, dx) * 180) / Math.PI + 90).toFixed(1)}deg`);
      rim.style.opacity = (o * 0.8).toFixed(3);
    }
  };
  useMotionValueEvent(sx, "change", paint);
  useMotionValueEvent(sy, "change", paint);
  useMotionValueEvent(son, "change", paint);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!tiltOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    on.set(1);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    on.set(0);
  }

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-[400px]" style={{ perspective: 1200 }}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.button
          type="button"
          aria-pressed={flipped}
          aria-label={flipped ? "VancoBiz Club pass, showing perks. Click to flip back." : "VancoBiz Club member pass. Click to reveal perks."}
          onClick={() => setFlipped((f) => !f)}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative block aspect-[5/7] w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight"
        >
          {/* Front: engraved gold plate */}
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.55),0_0_60px_rgba(255,198,107,0.15)]">
            <PlateArt />
            {/* Glint running round the frame on the side facing the light */}
            <span
              data-vp="rim"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[28px] p-[3.5%] opacity-0 mix-blend-screen"
              style={
                {
                  background:
                    "conic-gradient(from var(--rim-angle, 0deg), rgb(255 250 225 / 0.95), rgb(255 250 225 / 0) 55deg, rgb(255 250 225 / 0) 305deg, rgb(255 250 225 / 0.95))",
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                } as CSSProperties
              }
            />
            {/* Engraved lettering: dark brown on gold (high contrast) with a light lower edge */}
            <div className="absolute inset-0 flex flex-col p-[9%]">
              <div className="flex items-center gap-2 [text-shadow:0_1px_0_rgba(255,244,210,0.6)]">
                <span style={{ ["--logo-v" as string]: "#3A2B0A", ["--logo-b" as string]: "#3A2B0A" } as CSSProperties}>
                  <VBMark className="h-6 w-auto drop-shadow-[0_1px_0_rgba(255,244,210,0.6)]" />
                </span>
                <span className="font-display text-sm font-extrabold tracking-[0.18em] text-[#3A2B0A] uppercase">VancoBiz</span>
              </div>
              <div className="mt-auto text-[#2E220A] [text-shadow:0_1px_0_rgba(255,244,210,0.55)]">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase">Member pass</p>
                <p className="display mt-1 text-4xl leading-none">VancoBiz Club</p>
                <p className="mt-3 text-sm font-medium">{canHover ? "Click" : "Tap"} to reveal perks</p>
              </div>
            </div>
          </div>

          {/* Back: perks */}
          <div
            className="backface-hidden absolute inset-0 overflow-hidden rounded-[28px] border border-[#F3D98B]/35 bg-[linear-gradient(160deg,#1a160d,#0a0a0c_60%)] p-7"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-[#F3D98B] uppercase">Inside the club</p>
            <ul className="mt-5 space-y-5">
              {CLUB.perks.map((p, i) => {
                const Icon = PERK_ICONS[i % PERK_ICONS.length];
                return (
                  <li key={p.title} className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-[#F3D98B]">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold text-white">{p.title}</span>
                      <span className="block text-sm text-zinc-400">{p.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <span className="absolute right-7 bottom-7 left-7 flex items-center gap-2 text-xs text-zinc-500">
              <RotateCcw size={12} aria-hidden="true" /> Flip back
            </span>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
