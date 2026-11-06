"use client";

import { useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";

type Area = "marketing" | "jobs";

export default function ComingSoon({ area, lang, copy }: { area: Area; lang: Locale; copy: Dictionary }) {
  const content = copy.comingSoon[area];
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "joining" | "success" | "error">("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !contact.trim()) {
      setStatus("error");
      return;
    }
    setStatus("joining");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, role: area, lang }),
      });
      if (!response.ok) throw new Error("waitlist request failed");
      setStatus("success");
      setName("");
      setContact("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="relative isolate overflow-hidden px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24">
      <div className={`pointer-events-none absolute -top-32 ${area === "jobs" ? "right-[-8rem] bg-mint/20" : "left-[-8rem] bg-coral/20"} h-96 w-96 rounded-full blur-3xl`} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <section className="max-w-3xl">
          <div className={`mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${area === "jobs" ? "bg-mint-soft text-ink" : "bg-coral-soft text-ink"}`}>
            <span className={`h-2 w-2 rounded-full ${area === "jobs" ? "bg-mint" : "bg-coral"}`} aria-hidden="true" />
            {content.eyebrow}
          </div>
          <h1 className="font-display text-5xl font-extrabold leading-[0.98] tracking-tight md:text-7xl">{content.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{content.description}</p>
          <ul className="mt-9 grid gap-3 text-sm font-semibold sm:grid-cols-3">
            {[content.featureOne, content.featureTwo, content.featureThree].map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs text-white ${area === "jobs" ? "bg-mint" : "bg-coral"}`} aria-hidden="true">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card relative rounded-3xl p-6 shadow-[0_20px_60px_rgba(11,27,51,0.12)] sm:p-8">
          <div className={`mb-8 grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black text-white ${area === "jobs" ? "bg-mint" : "bg-coral"}`} aria-hidden="true">
            {area === "jobs" ? "↗" : "✦"}
          </div>
          <h2 className="font-display text-2xl font-extrabold">{copy.comingSoon.join}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{copy.comingSoon.promise}</p>
          <form onSubmit={submit} className="mt-7 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              {copy.comingSoon.name}
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="min-h-12 rounded-xl border border-[var(--line)] bg-[var(--page-bg)] px-4 font-normal outline-none transition focus:border-cobalt" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              {copy.comingSoon.contact}
              <input value={contact} onChange={(event) => setContact(event.target.value)} type="text" autoComplete="email" placeholder="you@example.com" className="min-h-12 rounded-xl border border-[var(--line)] bg-[var(--page-bg)] px-4 font-normal outline-none transition focus:border-cobalt" />
              <span className="font-normal text-muted">{copy.comingSoon.contactHint}</span>
            </label>
            <button type="submit" disabled={status === "joining"} className="min-h-12 rounded-full bg-amber px-5 font-bold text-ink transition hover:bg-cobalt hover:text-white disabled:cursor-wait disabled:opacity-70">
              {status === "joining" ? copy.comingSoon.joining : copy.comingSoon.join}
            </button>
            <p aria-live="polite" className={`text-sm leading-relaxed ${status === "success" ? "text-mint" : "text-coral"}`}>
              {status === "success" ? copy.comingSoon.success : status === "error" ? copy.comingSoon.error : ""}
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
