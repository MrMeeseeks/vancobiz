"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Crown, Handshake, RotateCcw, Sprout, Users } from "lucide-react";
import { WORK, CLUB, CONTACT } from "@/lib/content";
import { useCanHover, useIsMobile } from "@/lib/useDevice";
import Logo from "./Logo";

function CaseCoverflow() {
  const [active, setActive] = useState(0);
  const dragged = useRef(false);
  const mobile = useIsMobile();
  const n = WORK.length;
  const go = (i: number) => setActive(((i % n) + n) % n);

  function onDragEnd(_: unknown, info: PanInfo) {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) go(active + 1);
    else if (swipe > 60) go(active - 1);
    // Let the click that ends a drag be ignored.
    setTimeout(() => (dragged.current = false), 0);
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") go(active + 1);
    if (e.key === "ArrowLeft") go(active - 1);
  }

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Our work"
        tabIndex={0}
        onKeyDown={onKey}
        className="relative h-[460px] select-none outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:h-[480px]"
        style={{ perspective: 1400 }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={onDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d" }}
        >
          {WORK.map((c, i) => {
            // Shortest signed distance around the loop so cards wrap both ways.
            let offset = i - active;
            if (offset > n / 2) offset -= n;
            if (offset < -n / 2) offset += n;
            const abs = Math.abs(offset);
            return (
              <motion.article
                key={c.id}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${c.title}`}
                aria-hidden={offset !== 0}
                onClick={() => !dragged.current && go(i)}
                animate={{
                  x: `${offset * (mobile ? 86 : 70)}%`,
                  rotateY: offset * -32,
                  z: -abs * 180,
                  scale: 1 - abs * 0.08,
                  opacity: abs > 1 ? 0 : 1 - abs * 0.45,
                }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
                className="glass absolute inset-y-0 left-1/2 -ml-[min(44vw,210px)] w-[min(88vw,420px)] overflow-hidden rounded-3xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} aria-hidden="true" />
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -bottom-10 font-display text-[11rem] leading-none font-extrabold text-white/[0.04]"
                >
                  0{i + 1}
                </div>
                <div className="relative flex h-full flex-col p-7">
                  <span className="eyebrow">{c.sector}</span>
                  <h3 className="display mt-4 text-3xl leading-tight">{c.title}</h3>
                  <p className="mt-3 text-zinc-300">{c.summary}</p>
                  <ul className="mt-auto flex flex-wrap gap-2" aria-label="Tags">
                    {c.tags.map((t) => (
                      <li key={t} className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-zinc-200">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous project"
          className="glass grid size-11 place-items-center rounded-full transition hover:border-accent/60"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex gap-2">
          {WORK.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${c.title}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-accent" : "w-3 bg-white/25"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next project"
          className="glass grid size-11 place-items-center rounded-full transition hover:border-accent/60"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

const PERK_ICONS = [Users, Handshake, Sprout];

function VipPass() {
  const [flipped, setFlipped] = useState(false);
  const canHover = useCanHover();

  return (
    <div className="mx-auto w-full max-w-[400px]" style={{ perspective: 1200 }}>
      <motion.button
        type="button"
        aria-pressed={flipped}
        aria-label={flipped ? "VancoBiz Club pass, showing perks. Click to flip back." : "VancoBiz Club pass. Click to reveal perks."}
        onClick={() => setFlipped((f) => !f)}
        onPointerEnter={() => canHover && setFlipped(true)}
        onPointerLeave={() => canHover && setFlipped(false)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        whileHover={canHover ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative block aspect-[5/7] w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(145deg,#141420,#0a0a10_55%,#1b1030)] p-7 shadow-[0_30px_80px_color-mix(in_srgb,var(--a2)_35%,transparent)]">
          <div aria-hidden="true" className="absolute inset-0 bg-[conic-gradient(from_200deg_at_70%_20%,color-mix(in_srgb,var(--a1)_25%,transparent),color-mix(in_srgb,var(--a2)_25%,transparent),color-mix(in_srgb,var(--a3)_20%,transparent),color-mix(in_srgb,var(--a1)_25%,transparent))] opacity-60 mix-blend-screen blur-2xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <Logo />
              <Crown className="text-highlight" size={22} aria-hidden="true" />
            </div>
            <div className="mt-auto">
              <div aria-hidden="true" className="mb-6 h-9 w-12 rounded-md bg-gradient-to-br from-highlight to-[#a8770a] opacity-90" />
              <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">Member pass</p>
              <p className="display mt-1 text-4xl leading-none">
                VancoBiz <span className="text-gradient">Club</span>
              </p>
              <p className="mt-4 text-sm text-zinc-400">
                {canHover ? "Hover" : "Tap"} to reveal perks
              </p>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-[28px] border border-accent/30 bg-[linear-gradient(160deg,#0d1a22,#0a0a10_60%)] p-7"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="eyebrow">Inside the club</p>
          <ul className="mt-5 space-y-5">
            {CLUB.perks.map((p, i) => {
              const Icon = PERK_ICONS[i % PERK_ICONS.length];
              return (
                <li key={p.title} className="flex gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-accent">
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
    </div>
  );
}

export default function ShowcaseCarousel() {
  return (
    <>
      <section id="work" aria-labelledby="cases-title" className="relative overflow-hidden px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Work</p>
              <h2 id="cases-title" className="display mt-3 text-[2rem] leading-[1.05] sm:text-6xl">
                Made in Vancouver.
              </h2>
            </div>
            <p className="max-w-sm text-zinc-400">Drag, swipe or use the arrows to move through the work.</p>
          </div>
          <CaseCoverflow />
        </div>
      </section>

      <section id="club" aria-labelledby="club-title" className="relative overflow-hidden px-5 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[40rem] -translate-1/2 rounded-full bg-glow/20 blur-[150px]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <p className="eyebrow">VancoBiz Club</p>
            <h2 id="club-title" className="display mt-3 text-[2rem] leading-[1.05] sm:text-6xl">
              The room where <span className="text-gradient">Vancouver</span> builds.
            </h2>
            <p className="mt-5 max-w-md text-lg text-zinc-400">{CLUB.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={CONTACT.clubUrl} className="btn-glow" target="_blank" rel="noopener">
                Check the Club <ArrowRight size={16} />
              </a>
              <a href="#book" className="btn-ghost">
                Ask about Taster Party
              </a>
            </div>
          </div>
          <VipPass />
        </div>
      </section>
    </>
  );
}
