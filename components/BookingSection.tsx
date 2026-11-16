"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, REVENUE_OPTIONS, SERVICES } from "@/lib/content";

type Fields = { name: string; email: string; business: string; revenue: string };
type Errors = Partial<Record<keyof Fields | "services", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(f: Fields, services: string[]): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Enter a valid email so we can reply.";
  if (f.business.trim().length < 2) e.business = "Add your business name or website.";
  if (!f.revenue) e.revenue = "Pick the closest range.";
  if (services.length === 0) e.services = "Choose at least one.";
  return e;
}

const inputBase =
  "w-full rounded-2xl border bg-white/[0.03] px-4 py-3.5 text-white placeholder:text-zinc-500 outline-none transition focus:bg-white/[0.06]";

export default function BookingSection() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", business: "", revenue: "" });
  const [services, setServices] = useState<string[]>([]);
  const [touched, setTouched] = useState<Partial<Record<keyof Errors, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const errors = validate(fields, services);
  const show = (k: keyof Errors) => (touched[k] ? errors[k] : undefined);

  const set = (k: keyof Fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }));
  const toggle = (s: string) => {
    setTouched((t) => ({ ...t, services: true }));
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, business: true, revenue: true, services: true });
    if (Object.keys(errors).length) return;
    setStatus("sending");

    const payload = { ...fields, services: services.join(", ") };
    try {
      if (CONTACT.formEndpoint) {
        const res = await fetch(CONTACT.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        // No backend configured: hand off to the visitor's email app with everything pre-filled.
        const body = [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Business / website: ${payload.business}`,
          `Monthly revenue / goal: ${payload.revenue}`,
          `Interested in: ${payload.services}`,
        ].join("\n");
        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
          "Strategy meeting request",
        )}&body=${encodeURIComponent(body)}`;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const fieldClass = (k: keyof Errors) =>
    `${inputBase} ${show(k) ? "border-red-400/70" : "border-white/10 focus:border-accent/60"}`;

  return (
    <section id="book" aria-labelledby="book-title" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <p className="eyebrow">Strategy meeting</p>
          <h2 id="book-title" className="display mt-3 text-[2rem] leading-[1.05] sm:text-6xl">
            Let&apos;s make something <span className="text-gradient">unrepeatable.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-zinc-400">
            Book a free discovery call. Tell us where you are and where you want to be, and we&apos;ll
            show you how to turn your vision into a high-performing digital presence.
          </p>
          <ul className="mt-10 space-y-4 text-zinc-300">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" aria-hidden="true" /> {CONTACT.address}
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-accent" aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-accent" aria-hidden="true" />
              <a href={CONTACT.phoneHref} className="hover:text-white">
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="glass relative min-h-[540px] overflow-hidden rounded-[28px] p-6 sm:p-9">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[480px] flex-col items-center justify-center text-center"
                role="status"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                  className="grid size-20 place-items-center rounded-full bg-accent text-obsidian shadow-[0_0_60px_color-mix(in_srgb,var(--a1)_60%,transparent)]"
                >
                  <Check size={38} strokeWidth={3} />
                </motion.span>
                <h3 className="display mt-7 text-3xl">You&apos;re on our radar, {fields.name.split(" ")[0]}.</h3>
                <p className="mt-3 max-w-sm text-zinc-400">
                  {CONTACT.formEndpoint
                    ? "We'll reply within one business day with times for your strategy meeting."
                    : "Your email app should have opened with everything filled in. Hit send and we'll reply within one business day."}
                </p>
                <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-8">
                  Back to form
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" error={show("name")} id="f-name">
                    <input
                      id="f-name"
                      autoComplete="name"
                      value={fields.name}
                      onChange={(e) => set("name")(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                      aria-invalid={!!show("name")}
                      aria-describedby={show("name") ? "f-name-err" : undefined}
                      className={fieldClass("name")}
                      placeholder="Alex Chen"
                    />
                  </Field>
                  <Field label="Email" error={show("email")} id="f-email">
                    <input
                      id="f-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={fields.email}
                      onChange={(e) => set("email")(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      aria-invalid={!!show("email")}
                      aria-describedby={show("email") ? "f-email-err" : undefined}
                      className={fieldClass("email")}
                      placeholder="you@business.com"
                    />
                  </Field>
                </div>

                <Field label="Business or website" error={show("business")} id="f-business">
                  <input
                    id="f-business"
                    autoComplete="organization"
                    value={fields.business}
                    onChange={(e) => set("business")(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, business: true }))}
                    aria-invalid={!!show("business")}
                    aria-describedby={show("business") ? "f-business-err" : undefined}
                    className={fieldClass("business")}
                    placeholder="yourbrand.com"
                  />
                </Field>

                <Field label="Monthly revenue or goal" error={show("revenue")} id="f-revenue">
                  <select
                    id="f-revenue"
                    value={fields.revenue}
                    onChange={(e) => {
                      set("revenue")(e.target.value);
                      setTouched((t) => ({ ...t, revenue: true }));
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, revenue: true }))}
                    aria-invalid={!!show("revenue")}
                    aria-describedby={show("revenue") ? "f-revenue-err" : undefined}
                    className={`${fieldClass("revenue")} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23a1a1aa%22 stroke-width=%222%22%3E%3Cpath d=%22M2 4l4 4 4-4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat ${fields.revenue ? "" : "text-zinc-500"}`}
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {REVENUE_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-obsidian text-white">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                <fieldset aria-describedby={show("services") ? "f-services-err" : undefined}>
                  <legend className="mb-2.5 text-sm font-medium text-zinc-300">What are you interested in?</legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const on = services.includes(s.title);
                      return (
                        <motion.button
                          key={s.key}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          aria-pressed={on}
                          onClick={() => toggle(s.title)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            on
                              ? "border-accent bg-accent/15 text-white shadow-[0_0_20px_color-mix(in_srgb,var(--a1)_25%,transparent)]"
                              : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {on && <Check size={14} className="mr-1.5 -mt-0.5 inline text-accent" aria-hidden="true" />}
                          {s.title}
                        </motion.button>
                      );
                    })}
                  </div>
                  {show("services") && (
                    <p id="f-services-err" className="mt-2 text-sm text-red-300">
                      {show("services")}
                    </p>
                  )}
                </fieldset>

                <button type="submit" disabled={status === "sending"} className="btn-glow w-full !py-4 text-base disabled:opacity-70">
                  {status === "sending" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Book a Strategy Meeting <ArrowRight size={18} />
                    </>
                  )}
                </button>
                {status === "error" && (
                  <p className="text-center text-sm text-red-300" role="alert">
                    Something went wrong. Email us directly at{" "}
                    <a className="underline" href={`mailto:${CONTACT.email}`}>
                      {CONTACT.email}
                    </a>
                    .
                  </p>
                )}
                <p className="text-center text-xs text-zinc-500">No spam. We reply within one business day.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-sm text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
