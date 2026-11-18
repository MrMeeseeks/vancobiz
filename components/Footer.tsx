import { CONTACT, NAV_LINKS } from "@/lib/content";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 pt-12 pb-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-zinc-500">Be Creative, Not Repetitive.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </a>
          ))}
          <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
            Contact
          </a>
        </nav>
        <div className="text-sm text-zinc-500">
          <p>
            <a href={CONTACT.phoneHref} className="hover:text-white">
              {CONTACT.phone}
            </a>{" "}
            · {CONTACT.address}
          </p>
          <p className="mt-1">© 2026 VancoBiz</p>
        </div>
      </div>
    </footer>
  );
}
