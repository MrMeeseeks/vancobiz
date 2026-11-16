"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Crown } from "lucide-react";
import { CONTRACT_DISCOUNTS, PACKAGES } from "@/lib/content";

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Social media packages</p>
            <h2 id="pricing-title" className="display mt-3 text-[2rem] leading-[1.05] sm:text-6xl">
              Pick your <span className="text-gradient">rank.</span>
            </h2>
          </div>
          <p className="max-w-sm text-zinc-400">
            Content creation to strategic planning, packaged so you can choose the one that fits your ambition.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className={`relative flex flex-col rounded-[28px] p-7 ${
                p.featured
                  ? "border border-accent/60 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--a2)_28%,transparent),rgb(255_255_255/0.04))] shadow-[0_20px_80px_color-mix(in_srgb,var(--a2)_30%,transparent)] md:-translate-y-3"
                  : "glass"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="display text-2xl">{p.name}</h3>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-obsidian">
                    <Crown size={12} aria-hidden="true" /> Recommended
                  </span>
                )}
              </div>
              <p className="display mt-5 text-5xl">{p.price}</p>
              <ul className="mt-6 mb-8 space-y-3 text-sm text-zinc-300">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#book" className={`${p.featured ? "btn-glow" : "btn-ghost"} mt-auto w-full`}>
                Apply for {p.name} <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        <div className="glass mt-6 flex flex-col items-start gap-3 rounded-3xl px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-300">Commit longer, save more on any package:</p>
          <ul className="flex flex-wrap gap-2">
            {CONTRACT_DISCOUNTS.map((d) => (
              <li key={d.term} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
                {d.term} <span className="font-semibold text-accent">−{d.off}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
