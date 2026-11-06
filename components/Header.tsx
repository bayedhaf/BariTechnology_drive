import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import Icon from "./ui/Icon";
import type { Dictionary, Locale } from "@/lib/i18n";
import { areaLinks } from "@/lib/platform";

const icons = { services: "grid", learn: "book", marketing: "megaphone", jobs: "briefcase", play: "game" } as const;

export default function Header({ lang, copy }: { lang: Locale; copy: Dictionary }) {
  const link = (href: string) => `/${lang}${href}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6">
          <a href={`/${lang}`} aria-label={copy.nav.home} className="shrink-0">
            <Logo label={copy.logoLabel} />
          </a>
          <nav aria-label="Platform areas" className="hidden items-center gap-1 lg:flex">
            {areaLinks.map((area) => (
              <a key={area.key} href={link(area.href)} className="rounded-full px-3 py-2 text-sm font-semibold text-[var(--muted-copy)] hover:bg-[var(--page-bg)] hover:text-[var(--copy)]">{area.label}</a>
            ))}
          </nav>
          <form action={link("/jobs")} className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--page-bg)] px-3 md:flex">
            <Icon name="search" className="h-4 w-4 text-[var(--muted-copy)]" />
            <input name="q" aria-label="Search the platform" placeholder="Search jobs, lessons…" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[var(--copy)] outline-none placeholder:text-[var(--muted-copy)]" />
          </form>
          <LanguageSwitcher current={lang} copy={copy} />
          <ThemeToggle />
          <details className="relative lg:hidden">
            <summary className="grid min-h-11 min-w-11 cursor-pointer list-none place-items-center rounded-full border border-[var(--line)] text-[var(--copy)] [&::-webkit-details-marker]:hidden" aria-label={copy.nav.menu}>
              <Icon name="menu" className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-xl">
              <form action={link("/jobs")} className="mb-2 flex items-center gap-2 rounded-lg border border-[var(--line)] px-3">
                <Icon name="search" className="h-4 w-4 text-[var(--muted-copy)]" />
                <input name="q" aria-label="Search the platform" placeholder="Search" className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[var(--copy)] outline-none" />
              </form>
              {areaLinks.map((area) => <a key={area.key} href={link(area.href)} className="block rounded-lg px-3 py-3 font-semibold text-[var(--copy)] hover:bg-[var(--page-bg)]">{area.label}</a>)}
            </div>
          </details>
        </div>
      </header>
      <nav aria-label="Mobile platform navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--line)] bg-[var(--surface)]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {areaLinks.map((area) => (
          <a key={area.key} href={link(area.href)} className="flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold text-[var(--muted-copy)]">
            <Icon name={icons[area.key]} className="h-5 w-5" />
            {area.label}
          </a>
        ))}
      </nav>
    </>
  );
}
