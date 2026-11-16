"use client";

import { useRef, useState, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Clapperboard, Megaphone, Palette, PartyPopper, Plus, type LucideIcon } from "lucide-react";
import { SERVICES, type ServiceKey } from "@/lib/content";
import { useCanHover, useIsMobile } from "@/lib/useDevice";

const ServiceBadge = dynamic(() => import("./three/ServiceBadge"), { ssr: false });

const ICONS: Record<ServiceKey, LucideIcon> = {
  video: Clapperboard,
  ads: Megaphone,
  brand: Palette,
  events: PartyPopper,
};

function TiltCard({
  service,
  index,
  render3D,
  canHover,
}: {
  service: (typeof SERVICES)[number];
  index: number;
  render3D: boolean;
  canHover: boolean;
}) {
  const [active, setActive] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 180, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 180, damping: 18 });
  const glow = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, ${service.accent}22, transparent 60%)`,
  );
  const Icon = ICONS[service.key];
  const panelId = `svc-${service.key}`;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!canHover) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function reset() {
    mx.set(0.5);
    my.set(0.5);
    setActive(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerEnter={() => canHover && setActive(true)}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass group relative h-full overflow-hidden rounded-3xl p-6 sm:p-7"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />

        <div className="relative flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
          <div className="relative size-24 sm:size-28">
            {render3D ? (
              <ServiceBadge kind={service.key} color={service.accent} active={active} />
            ) : (
              <div
                className="grid size-full place-items-center rounded-2xl border border-white/10"
                style={{ background: `radial-gradient(circle, ${service.accent}33, transparent 70%)` }}
              >
                <Icon size={36} style={{ color: service.accent }} aria-hidden="true" />
              </div>
            )}
          </div>
          <span className="font-display text-sm text-zinc-500">0{index + 1}</span>
        </div>

        <h3
          className="display relative mt-6 text-2xl leading-tight sm:text-[1.7rem]"
          style={{ transform: "translateZ(30px)" }}
        >
          {service.title}
        </h3>
        <p className="relative mt-2 text-zinc-400" style={{ transform: "translateZ(20px)" }}>
          {service.blurb}
        </p>

        {!canHover && (
          <button
            type="button"
            onClick={() => setActive((a) => !a)}
            aria-expanded={active}
            aria-controls={panelId}
            className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan"
          >
            <Plus size={16} className={`transition-transform ${active ? "rotate-45" : ""}`} />
            {active ? "Hide deliverables" : "See deliverables"}
          </button>
        )}

        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              id={panelId}
              key="list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden"
            >
              <ul className="mt-5 grid gap-2 border-t border-white/10 pt-5">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2.5 text-sm text-zinc-200">
                    <span className="size-1.5 rounded-full" style={{ background: service.accent }} />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Deliverables stay available to screen readers and no-hover users */}
        {canHover && !active && (
          <ul className="sr-only">
            {service.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SpatialServices() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const mobile = useIsMobile();
  const canHover = useCanHover();

  return (
    <section id="services" ref={ref} aria-labelledby="services-title" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow">Services</p>
        <h2 id="services-title" className="display mt-3 max-w-3xl text-[2rem] leading-[1.05] sm:text-6xl">
          Four pillars. <span className="text-gradient">Zero</span> templates.
        </h2>
        <p className="mt-5 max-w-xl text-zinc-400">
          Every engagement is built from these four. Hover a pillar to see what ships.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <TiltCard
              key={s.key}
              service={s}
              index={i}
              render3D={inView && !mobile}
              canHover={canHover}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
