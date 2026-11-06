"use client";

import type { Dictionary, Locale } from "@/lib/i18n";
import { locales, dictionaries } from "@/lib/i18n";

export default function LanguageSwitcher({
  current,
  copy,
  mobile = false,
}: {
  current: Locale;
  copy: Dictionary;
  mobile?: boolean;
}) {
  return (
    <div
      aria-label={copy.nav.languages}
      className={mobile ? "border-t border-mist mt-2 pt-2" : "flex items-center gap-2"}
    >
      {locales.map((locale) => (
        <a
          key={locale}
          href={`/${locale}`}
          aria-current={locale === current ? "page" : undefined}
          onClick={() => {
            document.cookie = `preferred-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
          }}
          className={
            mobile
              ? "block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-paper"
              : "text-sm font-medium text-[var(--muted-copy)] hover:text-[var(--copy)]"
          }
        >
          {dictionaries[locale].languageName}
        </a>
      ))}
    </div>
  );
}
