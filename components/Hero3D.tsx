"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIsMobile, useReducedMotion } from "@/lib/useDevice";

function SceneFallback() {
  return (
    <div className="grid h-full w-full place-items-center" aria-hidden="true">
      <div className="size-64 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.35),rgba(112,0,255,0.2)_45%,transparent_70%)] blur-2xl" />
    </div>
  );
}

const HeroScene = dynamic(() => import("./three/HeroScene"), {
  ssr: false,
  loading: SceneFallback,
});

const HEADLINE = ["Vancouver's", "Boldest", "Creative", "Marketing", "Agency"];

export default function Hero3D() {
  const mobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  return (
    <section id="top" className="relative isolate overflow-hidden pt-16 lg:min-h-[100svh] lg:pt-24">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-violet/25 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] size-[36rem] rounded-full bg-cyan/15 blur-[140px]" />
      </div>

      {/* 3D canvas: its own band above the copy on small screens, right half on desktop */}
      <div className="relative h-[36svh] min-h-[240px] lg:absolute lg:inset-0 lg:left-[45%] lg:-z-10 lg:h-auto">
        <HeroScene mobile={mobile} reducedMotion={reducedMotion} />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col justify-center px-5 pb-16 lg:min-h-[calc(100svh-6rem)]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-6 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs text-zinc-300"
        >
          <Sparkles size={14} className="text-gold" />
          Strategy · Video · Ads · Community
        </motion.p>

        <h1 className="display max-w-3xl text-[clamp(2.1rem,9.5vw,5.4rem)] lg:text-[clamp(2.5rem,6vw,5.4rem)] leading-[0.95]">
          {HEADLINE.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pr-[0.22em] align-bottom">
              <motion.span
                className={`inline-block ${word === "Boldest" ? "text-gradient" : ""}`}
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg text-zinc-300 sm:text-xl"
        >
          <strong className="font-display font-bold text-white">Be Creative, Not Repetitive.</strong>{" "}
          We blend high-ROI digital strategy, viral video production, and real-world community
          activations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <a href="#book" className="btn-glow">
            Book a Strategy Meeting <ArrowRight size={16} />
          </a>
          <a href="#club" className="btn-ghost">
            Explore VancoBiz Club
          </a>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-zinc-500 uppercase md:flex"
      >
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}
