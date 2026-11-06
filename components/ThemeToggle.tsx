"use client";

import { useEffect, useSyncExternalStore } from "react";
import Icon from "@/components/ui/Icon";

export default function ThemeToggle() {
  const getTheme = () => typeof window !== "undefined" && (window.localStorage.getItem("2bg-theme") === "dark" || (!window.localStorage.getItem("2bg-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches));
  const dark = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener("2bg-theme-change", onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("2bg-theme-change", onChange);
      };
    },
    getTheme,
    () => false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggle() {
    const nextDark = !dark;
    window.localStorage.setItem("2bg-theme", nextDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", nextDark);
    window.dispatchEvent(new Event("2bg-theme-change"));
  }

  return <button type="button" onClick={toggle} className="grid min-h-11 min-w-11 place-items-center rounded-full border border-[var(--line)] text-[var(--copy)] hover:border-cobalt" aria-label={dark ? "Use light theme" : "Use dark theme"} title={dark ? "Use light theme" : "Use dark theme"}><Icon name={dark ? "sun" : "moon"} className="h-5 w-5" /></button>;
}
