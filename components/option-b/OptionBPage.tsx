"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Crosshair, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { TileLockup, TileMark } from "./TileMark";
import type { CubeApi, CubeStatus } from "./TileCube";
import { useReducedMotion } from "@/lib/useDevice";
import { asset } from "@/lib/content";
import LogoOptionSwitch from "../LogoOptionSwitch";

const TileCube = dynamic(() => import("./TileCube"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center" aria-hidden="true">
      <TileMark className="size-28 animate-pulse opacity-70" />
    </div>
  ),
});

export default function OptionBPage() {
  const api = useRef<CubeApi | null>(null);
  const [status, setStatus] = useState<CubeStatus>({ moves: 0, solved: false, busy: true });
  const reduced = useReducedMotion();
  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Scrolling down solves the cube back into the logo.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY + 2;
      lastY = y;
      const s = statusRef.current;
      if (down && !s.solved && !s.busy) {
        statusRef.current = { ...s, busy: true }; // avoid queuing twice before the next status update
        api.current?.solve();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <TileLockup tone="dark" className="text-lg" />
          <a href={asset("/")} className="btn-ghost !px-4 !py-2 whitespace-nowrap">
            <ArrowLeft size={16} aria-hidden="true" /> Option A<span className="hidden sm:inline"> (current site)</span>
          </a>
        </div>
      </header>

      <LogoOptionSwitch current="b" />
      <main className="mx-auto max-w-6xl px-5 py-12 pb-28 sm:py-16 sm:pb-28">
        <p className="eyebrow">Logo option B · Tile Grid</p>
        <h1 className="display mt-3 max-w-3xl text-[2rem] leading-[1.05] sm:text-6xl">
          Four tiles. <span className="text-gradient">One puzzle.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-zinc-400">
          The Tile Grid logo as a 2×2 puzzle cube in orange and purple. It starts scrambled. Scroll down and
          it solves itself into the logo. Then it&apos;s your turn.
        </p>

        <section aria-label="Interactive tile cube" className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="glass relative h-[420px] overflow-hidden rounded-[28px] sm:h-[560px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,color-mix(in_srgb,var(--a2)_22%,transparent),transparent_70%)]"
            />
            <TileCube apiRef={api} onStatus={setStatus} reducedMotion={reduced} />
            <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 text-xs">
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-zinc-300 backdrop-blur">
                Moves: <span className="font-semibold text-white tabular-nums">{status.moves}</span>
              </span>
              {status.solved && !status.busy && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 font-semibold text-obsidian">
                  <Sparkles size={12} aria-hidden="true" /> Solved
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass rounded-[28px] p-6">
              <h2 className="display text-xl">Play with it</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>
                  <span className="text-white">Drag a tile</span> to twist that layer.
                </li>
                <li>
                  <span className="text-white">Drag the background</span> to turn the whole cube.
                </li>
                <li>Scroll down the page and it solves itself.</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="btn-glow" onClick={() => api.current?.scramble()}>
                  <Shuffle size={16} aria-hidden="true" /> Scramble
                </button>
                <button type="button" className="btn-ghost" onClick={() => api.current?.solve()} disabled={status.moves === 0}>
                  <RotateCcw size={16} aria-hidden="true" /> Solve
                </button>
                <button type="button" className="btn-ghost" onClick={() => api.current?.frontView()}>
                  <Crosshair size={16} aria-hidden="true" /> Front view
                </button>
              </div>
              <p className="sr-only" aria-live="polite">
                {status.solved && !status.busy ? "Solved. The front face shows the logo." : `${status.moves} moves`}
              </p>
            </div>

            <div className="glass rounded-[28px] p-6">
              <h2 className="display text-xl">The faces</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-zinc-300">
                <li>Front: the logo</li>
                <li>Back: the logo</li>
                <li>Right: orange</li>
                <li>Left: purple</li>
                <li>Top: orange</li>
                <li>Bottom: purple</li>
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="lockups-title" className="mt-16">
          <h2 id="lockups-title" className="display text-2xl sm:text-3xl">
            Flat lockups
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="glass grid min-h-48 place-items-center rounded-[28px] p-8 md:col-span-2">
              <TileLockup tone="dark" className="text-3xl sm:text-5xl" />
            </div>
            <div className="glass grid min-h-40 place-items-center rounded-[28px] p-8">
              <TileLockup tone="mono" className="text-2xl sm:text-3xl" />
            </div>
            <div className="glass flex min-h-40 items-end justify-center gap-6 rounded-[28px] p-8">
              {[48, 32, 16].map((s) => (
                <figure key={s} className="flex flex-col items-center gap-2">
                  <span className="block shrink-0" style={{ width: s, height: s }}>
                    <TileMark className="size-full" />
                  </span>
                  <figcaption className="text-xs text-zinc-500">{s}px</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
