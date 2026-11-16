import { LOGO_PATHS, toSvgPath } from "@/lib/logoPaths";

const V_PATH = toSvgPath(LOGO_PATHS.v);
const B_PATH = toSvgPath(LOGO_PATHS.b);

/** The VancoBiz "VB" script mark as inline SVG. Colours follow the active palette. */
export function VBMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-1.02 -0.66 2.04 1.32" className={className} aria-hidden="true">
      <path d={V_PATH} fill="var(--logo-v)" />
      <path d={B_PATH} fill="var(--logo-b)" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <VBMark className="h-7 w-auto" />
      <span className="font-display text-lg font-extrabold tracking-tight text-white">
        Vanco<span className="text-accent">Biz</span>
      </span>
    </span>
  );
}
