import { TILE } from "./tileColors";

type Variant = "brand" | "mono";

/** The Tile Grid symbol: V and B on the violet diagonal, orange on the other. */
export function TileMark({ variant = "brand", className = "" }: { variant?: Variant; className?: string }) {
  // One-colour version is all purple.
  const purple = TILE.purple;
  const orange = variant === "mono" ? TILE.purple : TILE.orange;
  const letter = { fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: 30, fill: "#FFFFFF", textAnchor: "middle" as const };
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="VancoBiz tile mark">
      <rect x="0" y="0" width="47" height="47" rx="3" fill={purple} />
      <rect x="53" y="0" width="47" height="47" rx="3" fill={orange} />
      <rect x="0" y="53" width="47" height="47" rx="3" fill={orange} />
      <rect x="53" y="53" width="47" height="47" rx="3" fill={purple} />
      <text x="23.5" y="34" {...letter}>
        V
      </text>
      <text x="76.5" y="87" {...letter}>
        B
      </text>
    </svg>
  );
}

/** Symbol + wordmark lockup. */
export function TileLockup({
  tone,
  className = "",
}: {
  tone: "dark" | "mono";
  className?: string;
}) {
  // Orange and purple only: wordmark in purple, "Biz" in orange (or all purple for one colour).
  const vanco = TILE.purple;
  const biz = tone === "dark" ? TILE.orange : TILE.purple;
  return (
    <span className={`inline-flex items-center gap-[0.35em] ${className}`}>
      <TileMark variant={tone === "mono" ? "mono" : "brand"} className="h-[1.6em] w-[1.6em]" />
      <span className="font-display font-extrabold tracking-tight" style={{ color: vanco }}>
        Vanco<span style={{ color: biz }}>Biz</span>
      </span>
    </span>
  );
}
