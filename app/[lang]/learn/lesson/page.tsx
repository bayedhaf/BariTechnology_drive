import Header from "@/components/Header";
import { Card, ProgressBar, Tag } from "@/components/ui/Controls";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function LessonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto grid max-w-7xl gap-8 px-5 py-12 pb-28 sm:px-8 md:grid-cols-[260px_1fr] md:py-20 md:pb-20"><aside><Tag color="sky">Course outline</Tag><h1 className="mt-4 font-display text-2xl font-extrabold">Digital basics</h1><ProgressBar value={35} color="sky" /><ol className="mt-6 space-y-2 text-sm"><li className="rounded-lg bg-sky-soft p-3 font-bold text-ink">1. Getting started</li><li className="rounded-lg p-3 text-muted">2. Staying safe online</li><li className="rounded-lg p-3 text-muted">3. Useful tools</li><li className="rounded-lg p-3 text-muted">4. Practice project</li></ol></aside><article className="max-w-3xl"><Tag color="sky">Lesson 1 · Beginner</Tag><h2 className="mt-4 font-display text-5xl font-extrabold tracking-tight">What technology can do for you.</h2><p className="mt-6 text-lg leading-relaxed text-muted">This placeholder lesson introduces the course structure and leaves room for translated learning content.</p><Card className="mt-8"><h3 className="font-display text-2xl font-bold">Lesson notes</h3><p className="mt-3 leading-relaxed text-muted">Use this space for a video, reading, examples and a small practice task. TODO: connect lesson content and completion storage.</p><button className="mt-6 min-h-11 rounded-full bg-amber px-5 font-bold text-ink">Mark lesson complete</button></Card></article></main></>;
}
