"use client";

/* eslint-disable @next/next/no-img-element -- static export: plain <img> with a basePath-aware src */
import { useState } from "react";
import { motion } from "framer-motion";
import { TEAM, asset } from "@/lib/content";
import { useCanHover, useReducedMotion } from "@/lib/useDevice";

function Marquee() {
  const reduced = useReducedMotion();
  const names = [...TEAM, ...TEAM].map((m) => m.name);
  return (
    <div aria-hidden="true" className="relative overflow-hidden py-2 select-none">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {names.map((n, i) => (
          <span
            key={i}
            className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-none font-extrabold text-transparent"
            style={{ WebkitTextStroke: "1px rgb(255 255 255 / 0.14)" }}
          >
            {n}
            <span className="ml-10 align-middle text-[0.35em] text-accent/70" style={{ WebkitTextStroke: 0 }}>
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function TeamSection() {
  const [active, setActive] = useState(0);
  const canHover = useCanHover();

  return (
    <section id="team" aria-labelledby="team-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">The team</p>
        <h2 id="team-title" className="display mt-3 max-w-3xl text-[2rem] leading-[1.05] sm:text-6xl">
          Meet the team behind <span className="text-gradient">VancoBiz.</span>
        </h2>
        <p className="mt-5 max-w-xl text-zinc-400">
          Web developers, content creators, digital marketers and event planners, united by one mission: helping
          local businesses thrive.
        </p>
      </div>

      <div className="mt-10">
        <Marquee />
      </div>

      {/* Desktop: expanding portrait strip. Mobile: swipeable cards. */}
      <ul
        className="mx-auto mt-8 flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 md:h-[520px] md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
        aria-label="Team members"
      >
        {TEAM.map((m, i) => {
          const isActive = i === active;
          return (
            <motion.li
              key={m.name}
              layout
              onPointerEnter={() => canHover && setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              tabIndex={0}
              transition={{ type: "spring", stiffness: 170, damping: 24 }}
              className={`group relative h-[420px] w-[78vw] shrink-0 cursor-pointer snap-center overflow-hidden rounded-[28px] border border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-accent sm:w-[300px] md:h-full md:w-auto md:shrink ${
                isActive ? "md:flex-[3.2]" : "md:flex-1"
              }`}
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 100%, color-mix(in srgb, var(--a2) 45%, transparent), transparent 65%), linear-gradient(180deg, #141019, #0b0a0f)",
              }}
            >
              {/* Index */}
              <span className="absolute top-5 left-5 z-10 font-display text-sm text-white/40">0{i + 1}</span>

              {/* Big outlined initial behind the portrait */}
              <span
                aria-hidden="true"
                className="absolute -top-6 right-2 font-display text-[12rem] leading-none font-extrabold text-transparent transition-opacity duration-500"
                style={{ WebkitTextStroke: "1.5px color-mix(in srgb, var(--a1) 45%, transparent)", opacity: isActive ? 1 : 0.35 }}
              >
                {m.name[0]}
              </span>

              <img
                src={asset(m.photo)}
                alt={`${m.name}, ${m.role}`}
                loading="lazy"
                width={500}
                height={500}
                className={`absolute bottom-0 left-1/2 h-[88%] w-auto max-w-none -translate-x-1/2 object-contain transition duration-700 ease-out ${
                  isActive ? "scale-105 grayscale-0" : "grayscale md:scale-100 md:opacity-70"
                }`}
              />

              {/* Name plate */}
              <div
                className={`absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 transition-opacity duration-300 ${
                  isActive ? "" : "md:opacity-0"
                }`}
              >
                <p className="display text-2xl leading-none text-white md:text-3xl">{m.name}</p>
                <motion.p
                  initial={false}
                  animate={{ opacity: isActive || !canHover ? 1 : 0, y: isActive || !canHover ? 0 : 6 }}
                  className="mt-1.5 text-sm text-accent"
                >
                  {m.role}
                </motion.p>
              </div>

              {/* Vertical name on collapsed desktop panels */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-5 left-1/2 z-10 hidden origin-bottom-left translate-x-2 -rotate-90 font-display text-lg font-bold tracking-[0.2em] whitespace-nowrap text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-opacity md:block ${
                  isActive ? "opacity-0" : "opacity-100"
                }`}
              >
                {m.name}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
