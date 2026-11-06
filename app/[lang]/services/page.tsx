import Header from "@/components/Header";
import { Card, Tag } from "@/components/ui/Controls";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24"><div className="max-w-3xl"><Tag>Services</Tag><h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">{copy.services.heading}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{copy.services.description}</p></div><div className="mt-12 grid gap-4 md:grid-cols-2">{copy.services.items.map((service) => <Card key={service.title} className="p-7"><h2 className="font-display text-2xl font-bold">{service.title}</h2><p className="mt-3 max-w-lg leading-relaxed text-muted">{service.text}</p></Card>)}</div><section className="mt-20"><Tag color="cobalt">Our process</Tag><h2 className="mt-4 font-display text-4xl font-extrabold">Clear steps from first conversation to support.</h2><ol className="mt-8 grid gap-4 md:grid-cols-4">{copy.process.items.map((step, index) => <li key={step.title} className="border-t-4 border-cobalt pt-5"><span className="text-4xl font-extrabold text-cobalt/40">0{index + 1}</span><h3 className="mt-3 font-display text-xl font-bold">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p></li>)}</ol></section></main></>;
}
