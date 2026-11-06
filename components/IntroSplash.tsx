"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "2bg-intro-seen";
let seen = false;
const listeners = new Set<() => void>();

function readIntroState() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.sessionStorage.getItem(STORAGE_KEY) !== "true" && !seen;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function skipIntro() {
  seen = true;
  window.sessionStorage.setItem(STORAGE_KEY, "true");
  listeners.forEach((listener) => listener());
}

export default function IntroSplash({ tagline, skipLabel }: { tagline: string; skipLabel: string }) {
  const visible = useSyncExternalStore(subscribe, readIntroState, () => false);

  useEffect(() => {
    if (!visible) return;
    const timeout = window.setTimeout(skipIntro, 1800);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cobalt px-6 text-center text-white">
      <div className="settle max-w-xl">
        <p className="font-display text-3xl font-bold leading-tight sm:text-5xl">{tagline}</p>
        <button
          type="button"
          onClick={skipIntro}
          className="mt-8 rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-cobalt"
        >
          {skipLabel}
        </button>
      </div>
    </div>
  );
}
