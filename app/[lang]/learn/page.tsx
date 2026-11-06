import Header from "@/components/Header";
import { Card, ProgressBar, Tag } from "@/components/ui/Controls";
import { mockCourses } from "@/lib/platform";
import { dictionaries, isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function LearnPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  return <><Header lang={lang} copy={copy} /><main className="mx-auto max-w-7xl px-5 py-14 pb-28 sm:px-8 md:py-24 md:pb-24"><div className="max-w-3xl"><Tag color="sky">Learn</Tag><h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">Build digital confidence through practice.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">Short courses and clear lessons for students, job seekers and anyone ready to use technology better.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{mockCourses.map((course) => <Card key={course.title} className="p-6"><Tag color={course.accent as "sky" | "cobalt" | "violet"}>{course.level}</Tag><h2 className="mt-5 font-display text-2xl font-bold">{course.title}</h2><p className="mt-2 text-sm text-muted">{course.duration} · Placeholder course</p><ProgressBar value={course.progress} color={course.accent as "sky" | "cobalt" | "violet"} /><p className="mt-2 text-xs text-muted">{course.progress}% complete</p><a href={`/${lang}/learn/lesson`} className="mt-5 inline-flex min-h-11 items-center rounded-full bg-cobalt px-4 text-sm font-bold text-white">Open course</a></Card>)}</div></main></>;
}
