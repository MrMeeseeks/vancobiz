"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Design options the team is choosing between. The defaults are the recommendation;
 * add ?review to the URL to show a switcher panel (see components/DesignPanel.tsx).
 */

export const PALETTES = {
  brand: {
    label: "Brand: purple + orange",
    // a1 = action colour (CTAs, eyebrows), a2 = dominant glow, a3 = highlight
    a1: "#FF8A1F",
    a2: "#7B2FF7",
    a3: "#FFC66B",
    logoV: "#FF8A1F",
    logoB: "#9B5CFF",
  },
  electric: {
    label: "Electric: cyan + violet + gold",
    a1: "#00F0FF",
    a2: "#7000FF",
    a3: "#FFB800",
    logoV: "#00F0FF",
    logoB: "#9B5CFF",
  },
} as const;

export const LOGOS = {
  "chrome-vb": "Chrome VB (their mark, liquid chrome)",
  "brand-vb": "Brand VB (their mark, glossy orange + purple)",
  medallion: "VB Medallion (coin with their mark)",
  "chrome-v": "Chrome V (current abstract V)",
} as const;

export type PaletteKey = keyof typeof PALETTES;
export type LogoKey = keyof typeof LOGOS;

export const DEFAULT_PALETTE: PaletteKey = "brand";
export const DEFAULT_LOGO: LogoKey = "chrome-vb";

type Design = {
  palette: PaletteKey;
  logo: LogoKey;
  review: boolean;
  setPalette: (p: PaletteKey) => void;
  setLogo: (l: LogoKey) => void;
};

const Ctx = createContext<Design>({
  palette: DEFAULT_PALETTE,
  logo: DEFAULT_LOGO,
  review: false,
  setPalette: () => {},
  setLogo: () => {},
});

function writeUrl(key: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState(null, "", url);
}

export function DesignProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteKey>(DEFAULT_PALETTE);
  const [logo, setLogoState] = useState<LogoKey>(DEFAULT_LOGO);
  const [review, setReview] = useState(false);

  // Read options from the URL after hydration (static export: no server-side params).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = q.get("palette");
    const l = q.get("logo");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL */
    if (p && p in PALETTES) setPaletteState(p as PaletteKey);
    if (l && l in LOGOS) setLogoState(l as LogoKey);
    setReview(q.has("review"));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.dataset.palette = palette;
  }, [palette]);

  const setPalette = useCallback((p: PaletteKey) => {
    setPaletteState(p);
    writeUrl("palette", p);
  }, []);
  const setLogo = useCallback((l: LogoKey) => {
    setLogoState(l);
    writeUrl("logo", l);
  }, []);

  return (
    <Ctx.Provider value={{ palette, logo, review, setPalette, setLogo }}>{children}</Ctx.Provider>
  );
}

export function useDesign() {
  return useContext(Ctx);
}

export function usePaletteColors() {
  return PALETTES[useDesign().palette];
}
