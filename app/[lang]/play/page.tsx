import Header from "@/components/Header";
import PlayLobby from "@/components/play/PlayLobby";
import { Tag } from "@/components/ui/Controls";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function PlayPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <div className="min-h-screen bg-night text-night-text"><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24"><div className="max-w-3xl"><Tag color="violet">Play and meet</Tag><h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">Make room for a little fun.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-night-muted">A dark-theme lobby concept for games, video rooms and friendly conversations. UI only for now.</p></div><div className="mt-12"><PlayLobby /></div></main></div>;
}
