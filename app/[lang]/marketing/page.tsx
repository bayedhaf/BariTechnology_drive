import Header from "@/components/Header";
import { Card, Tag } from "@/components/ui/Controls";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function MarketingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  const topics = ["Content planning", "Social media basics", "Search visibility", "Email campaigns"];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24"><div className="max-w-3xl"><Tag color="coral">Marketing</Tag><h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">Make useful work easier to find.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Digital marketing services and plain-language learning content for small businesses and people building their next opportunity.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{topics.map((topic) => <Card key={topic} className="min-h-44"><div className="h-2 w-12 rounded-full bg-coral" /><h2 className="mt-8 font-display text-xl font-bold">{topic}</h2><p className="mt-2 text-sm leading-relaxed text-muted">Placeholder topic card for future translated content.</p></Card>)}</div><section className="mt-16 rounded-2xl bg-coral-soft p-7 md:p-12"><h2 className="max-w-2xl font-display text-4xl font-extrabold">Need marketing support?</h2><p className="mt-4 max-w-xl leading-relaxed text-ink/75">Tell us what you are trying to reach and we can plan the next clear step.</p><a href={`/${lang}#contact`} className="mt-7 inline-flex min-h-11 items-center rounded-full bg-amber px-5 font-bold text-ink">Talk to our team</a></section></main></>;
}
