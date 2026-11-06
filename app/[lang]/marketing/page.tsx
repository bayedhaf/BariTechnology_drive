import Header from "@/components/Header";
import ComingSoon from "@/components/ComingSoon";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function MarketingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><ComingSoon area="marketing" lang={lang} copy={copy} /></>;
}
