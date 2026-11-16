export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="vb-logo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00F0FF" />
            <stop offset=".55" stopColor="#7000FF" />
            <stop offset="1" stopColor="#FFB800" />
          </linearGradient>
        </defs>
        <path d="M3 5h7l6 14 6-14h7L19 27h-6z" fill="url(#vb-logo)" />
      </svg>
      <span className="font-display text-lg font-extrabold tracking-tight text-white">
        Vanco<span className="text-cyan">Biz</span>
      </span>
    </span>
  );
}
