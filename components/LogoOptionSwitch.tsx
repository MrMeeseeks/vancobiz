import { asset } from "@/lib/content";
import { VBMark } from "./Logo";
import { TileMark } from "./option-b/TileMark";

/** Floating switch between logo Option A (current site) and Option B (Tile Grid cube). */
export default function LogoOptionSwitch({ current }: { current: "a" | "b" }) {
  const options = [
    { key: "a", label: "A", title: "Option A: script VB (current site)", href: asset("/"), icon: <VBMark className="h-4 w-auto" /> },
    { key: "b", label: "B", title: "Option B: Tile Grid cube", href: asset("/option-b/"), icon: <TileMark className="size-4" /> },
  ] as const;

  return (
    <nav
      aria-label="Logo options"
      className="glass fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 p-1 text-sm shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <span className="hidden pr-1 pl-3 text-xs text-zinc-400 sm:inline">Logo</span>
      {options.map((o) => {
        const active = o.key === current;
        return (
          <a
            key={o.key}
            href={o.href}
            title={o.title}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold whitespace-nowrap transition sm:px-4 ${
              active ? "bg-accent text-obsidian" : "text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {o.icon}
            <span className="hidden sm:inline">Option </span>
            {o.label}
          </a>
        );
      })}
    </nav>
  );
}
