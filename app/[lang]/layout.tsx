import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = dictionaries[lang];
  const languages = Object.fromEntries(locales.map((locale) => [locale, `/${locale}`]));

  return {
    title: `${site.name} | ${copy.metadata.title}`,
    description: copy.metadata.description,
    openGraph: {
      title: `${site.name} | ${copy.metadata.title}`,
      description: copy.metadata.description,
      type: "website",
      locale: lang,
    },
    alternates: { languages },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <div lang={lang}>{children}</div>;
}

export type LocaleParams = { lang: Locale };
