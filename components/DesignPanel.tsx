"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Palette, X } from "lucide-react";
import {
  DEFAULT_LOGO,
  DEFAULT_PALETTE,
  LOGOS,
  PALETTES,
  useDesign,
  type LogoKey,
  type PaletteKey,
} from "@/lib/design";

/** Review-only switcher. Shown when the URL contains ?review. */
export default function DesignPanel() {
  const { review, palette, logo, setPalette, setLogo } = useDesign();
  const [open, setOpen] = useState(true);
  if (!review) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[70] w-[min(92vw,320px)]">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass rounded-3xl bg-black/60 p-4 text-sm shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="font-display font-bold">Design options</p>
              <button type="button" aria-label="Hide design options" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <fieldset className="mt-3">
              <legend className="mb-1.5 text-xs text-zinc-400">3D logo</legend>
              {(Object.keys(LOGOS) as LogoKey[]).map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5">
                  <input type="radio" name="logo" checked={logo === k} onChange={() => setLogo(k)} className="accent-[var(--a1)]" />
                  <span>
                    {LOGOS[k]}
                    {k === DEFAULT_LOGO && <span className="ml-1 text-xs text-accent">recommended</span>}
                  </span>
                </label>
              ))}
            </fieldset>

            <fieldset className="mt-3">
              <legend className="mb-1.5 text-xs text-zinc-400">Palette</legend>
              {(Object.keys(PALETTES) as PaletteKey[]).map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5">
                  <input type="radio" name="palette" checked={palette === k} onChange={() => setPalette(k)} className="accent-[var(--a1)]" />
                  <span className="flex gap-1">
                    {[PALETTES[k].a1, PALETTES[k].a2, PALETTES[k].a3].map((c) => (
                      <span key={c} className="size-3 rounded-full" style={{ background: c }} />
                    ))}
                  </span>
                  <span>
                    {PALETTES[k].label}
                    {k === DEFAULT_PALETTE && <span className="ml-1 text-xs text-accent">recommended</span>}
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="mt-3 text-xs text-zinc-500">Choices are saved in the page link, so you can share it.</p>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="btn-glow ml-auto flex !px-4"
          >
            <Palette size={16} /> Design options
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
