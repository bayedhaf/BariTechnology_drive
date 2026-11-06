import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import { dictionaries, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import "../globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

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

  return (
    <html
      lang={lang}
      className={`${display.variable} ${body.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

export type LocaleParams = { lang: Locale };
