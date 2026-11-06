import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const styles = {
    primary: "bg-amber text-ink hover:bg-white",
    secondary: "border border-[var(--line)] bg-[var(--surface)] text-[var(--copy)] hover:border-cobalt hover:text-cobalt",
    ghost: "text-[var(--muted-copy)] hover:bg-[var(--page-bg)] hover:text-[var(--copy)]",
  };
  return <button className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${styles[variant]} ${className}`} {...props} />;
}

export function Tag({ children, color = "cobalt" }: { children: React.ReactNode; color?: "cobalt" | "sky" | "mint" | "coral" | "violet" }) {
  const styles = { cobalt: "bg-blue-100 text-cobalt", sky: "bg-sky-soft text-ink", mint: "bg-mint-soft text-ink", coral: "bg-coral-soft text-ink", violet: "bg-violet-soft text-ink" };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[color]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`surface-card rounded-2xl p-5 shadow-[0_8px_24px_rgba(11,27,51,0.06)] ${className}`}>{children}</div>;
}

export function ProgressBar({ value, color = "cobalt" }: { value: number; color?: "cobalt" | "sky" | "mint" | "violet" }) {
  const colors = { cobalt: "bg-cobalt", sky: "bg-sky", mint: "bg-mint", violet: "bg-violet" };
  return <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]" aria-label={`${value}% complete`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div className={`h-full rounded-full ${colors[color]}`} style={{ width: `${value}%` }} /></div>;
}

export function Input({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-[var(--copy)]">{label}<input className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-base font-normal text-[var(--copy)] placeholder:text-[var(--muted-copy)]" {...props} /></label>;
}

export function Select({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return <label className="grid gap-2 text-sm font-semibold text-[var(--copy)]">{label}<select className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-base font-normal text-[var(--copy)]" {...props}>{children}</select></label>;
}
