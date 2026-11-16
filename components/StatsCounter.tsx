"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { STATS } from "@/lib/content";
import { useReducedMotion } from "@/lib/useDevice";

function Counter({
  value,
  decimals,
  suffix,
  delay,
}: {
  value: number;
  decimals: number;
  suffix: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // `amount: "some"` + a positive margin means it fires as soon as any pixel is near the viewport,
  // so short screens and fast scrolls never leave it stuck at 0.
  const inView = useInView(ref, { once: true, amount: "some", margin: "0px 0px 10% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const format = (n: number) => `${n.toFixed(decimals)}${suffix}`;
    if (reduced) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = format(n);
      },
      onComplete: () => {
        el.textContent = format(value);
      },
    });
    return () => {
      controls.stop();
      // Never leave a half-finished number behind if the component unmounts mid-animation.
      el.textContent = format(value);
    };
  }, [inView, reduced, value, decimals, suffix, delay]);

  return (
    <span ref={ref} aria-hidden="true" className="tabular-nums">
      {`${(0).toFixed(decimals)}${suffix}`}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section id="results" aria-labelledby="results-title" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Results</p>
            <h2 id="results-title" className="display mt-3 text-[2rem] leading-[1.05] sm:text-5xl">
              Numbers that move.
            </h2>
          </div>
          <p className="max-w-sm text-zinc-400">
            Creative only matters if it pays. Here&apos;s what our work adds up to.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="glass group relative flex flex-col-reverse overflow-hidden rounded-3xl p-5 sm:p-7"
            >
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 size-40 rounded-full bg-cyan/10 blur-3xl transition-colors duration-500 group-hover:bg-violet/30"
              />
              <dt className="relative mt-3 text-sm text-zinc-400 sm:text-base">{s.label}</dt>
              <dd className="display text-gradient relative text-4xl whitespace-nowrap sm:text-5xl xl:text-6xl">
                <span className="sr-only">{`${s.value}${s.suffix}`}</span>
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} delay={i * 0.12} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
