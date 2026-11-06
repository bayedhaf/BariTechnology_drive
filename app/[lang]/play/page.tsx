import Header from "@/components/Header";
import DodgeGame from "@/components/games/DodgeGame";
import Image from "next/image";
import { Card, Tag } from "@/components/ui/Controls";
import { mockGames } from "@/lib/platform";
import { Rajdhani } from "next/font/google";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "700"],
});

export default async function PlayPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <div className="min-h-screen bg-night text-night-text"><Header lang={lang} copy={copy} /><main className={`${rajdhani.className} mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:py-12 lg:pb-12`}><div className="mb-8 max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet">Play</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Make room for a little fun.</h1><p className="mt-3 text-night-muted">Play a quick game, discover upcoming activities and meet friends in future rooms.</p></div><section aria-labelledby="games-heading"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-violet">Game library</p><h2 id="games-heading" className="mt-2 font-display text-3xl font-extrabold">Choose something to play</h2></div><Tag color="violet">Demo platform</Tag></div><div className="mt-5 grid gap-4 md:grid-cols-3">{mockGames.map((game) => <Card key={game.title} className="border-night-line bg-night-raised text-night-text"><div className="relative h-40 overflow-hidden rounded-xl bg-violet/20 text-violet">{game.title === "Dodge the Blocks" ? <Image src="/dodge-the-blocks.png" alt="Dodge the Blocks gameplay" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="grid h-full place-items-center"><span className="font-display text-4xl font-extrabold">?</span></div>}</div><h3 className="mt-4 font-display text-xl font-bold">{game.title}</h3><p className="mt-1 text-sm text-night-muted">{game.players}</p>{game.title === "Dodge the Blocks" ? <p className="mt-4 text-sm font-bold text-amber">Playable now ↓</p> : <p className="mt-4 text-sm text-night-muted">Placeholder — coming soon</p>}</Card>)}</div></section><section aria-labelledby="game-heading" className="mt-12"><div className="mb-5"><p className="text-sm font-bold text-violet">Now playing</p><h2 id="game-heading" className="mt-2 font-display text-3xl font-extrabold">Dodge the Blocks</h2></div><div className="overflow-hidden rounded-2xl border border-night-line bg-night-raised p-2 shadow-2xl sm:p-4"><DodgeGame embedded /></div></section></main></div>;
}
