import Header from "@/components/Header";
import LessonWorkspace from "@/components/learn/LessonWorkspace";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-12 pb-28 sm:px-8 md:py-20 md:pb-20"><LessonWorkspace lang={lang} /></main></>;
}
