import Header from "@/components/Header";
import JobsBoard from "@/components/jobs/JobsBoard";
import { Tag } from "@/components/ui/Controls";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24"><div className="max-w-3xl"><Tag color="mint">Jobs</Tag><h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">Find work that moves you forward.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Search placeholder opportunities, save a role and see how the future jobs platform will work.</p></div><div className="mt-12"><JobsBoard /></div></main></>;
}
