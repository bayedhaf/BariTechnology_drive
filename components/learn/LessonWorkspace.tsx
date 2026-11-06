"use client";

import { useState } from "react";
import { Card, ProgressBar, Tag } from "@/components/ui/Controls";
import type { Locale } from "@/lib/i18n";

const text = {
  en: {
    lesson: "Lesson 1 · Beginner", title: "What technology can do for you.",
    intro: "Technology is most useful when it helps you solve a real problem. In this lesson, you will learn how to choose a tool, practise safely and turn a small idea into a useful next step.",
    video: "Lesson video", videoNote: "Video placeholder · 08:42",
    notes: "Your notes", notesHint: "Write a thought, question or action to remember…", download: "Download notes", saved: "Notes downloaded",
    complete: "Mark lesson complete", completed: "Lesson complete", progress: "Course progress", outline: "Course outline",
    question: "Quick check", questionText: "What is the best first step when choosing a new digital tool?",
    answers: ["Choose the most popular tool", "Start with the problem you want to solve", "Use every feature at once"], correct: "Start with the problem you want to solve", check: "Check answer", right: "Correct — start with the problem.", wrong: "Not quite. Think about the problem first.",
    recommended: "Continue learning", recommendText: "A useful next step based on this lesson.", next: "Staying safe online", duration: "12 min · Beginner",
    discussion: "Join the conversation", commentHint: "Share a question or useful example…", post: "Post comment", posted: "Your comment is visible in this demo.", noComment: "Be the first to share a thought.",
  },
  om: {
    lesson: "Barnoota 1 · Jalqabaa", title: "Teekinooloojiin maal siif gochuu danda'a?",
    intro: "Teekinooloojiin yeroo rakkoo dhugaa furuuf si gargaaru caalaatti fayyada. Barnoota kana keessatti meeshaa akkamitti filachuu fi yaada xiqqaa gara tarkaanfii faayidaa qabuutti jijjiiruu baratta.",
    video: "Viidiyoo barnootaa", videoNote: "Iddoo viidiyoo · 08:42",
    notes: "Yaadannoo kee", notesHint: "Yaada, gaaffii ykn hojii yaadachuu barbaaddu barreessi…", download: "Yaadannoo buusi", saved: "Yaadannoon buufame",
    complete: "Barnoota xumuri", completed: "Barnootni xumurame", progress: "Adeemsa koorsii", outline: "Tarree barnootaa",
    question: "Qorannoo gabaabaa", questionText: "Yeroo meeshaa dijitaalaa haaraa filattu tarkaanfiin jalqabaa maali?",
    answers: ["Meeshaa beekamaa filadhu", "Rakkoo furuu barbaaddu irraa jalqabi", "Amaloota hunda yeroo tokkoon fayyadami"], correct: "Rakkoo furuu barbaaddu irraa jalqabi", check: "Deebii qoradhu", right: "Sirrii — rakkoo irraa jalqabi.", wrong: "Guutuu miti. Jalqaba rakkoo yaadi.",
    recommended: "Barnoota itti aanu", recommendText: "Tarkaanfii itti aanu kan barnoota kana irratti hundaa'e.", next: "Toora interneetii irratti of eegi", duration: "Daqiiqaa 12 · Jalqabaa",
    discussion: "Mariitti makami", commentHint: "Gaaffii ykn fakkeenya faayidaa qabu qoodi…", post: "Yaada maxxansi", posted: "Yaadni kee demo kana keessatti mul'ata.", noComment: "Yaada qooduuf nama jalqabaa ta'i.",
  },
} as const;

export default function LessonWorkspace({ lang }: { lang: Locale }) {
  const copy = text[lang];
  const [notes, setNotes] = useState("");
  const [complete, setComplete] = useState(false);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [comment, setComment] = useState("");
  const [posted, setPosted] = useState("");
  const progress = complete ? 50 : 35;

  function downloadNotes() {
    const blob = new Blob([notes || "No notes added yet."], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "2bg-digital-basics-notes.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function postComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (comment.trim()) {
      setPosted(comment.trim());
      setComment("");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Tag color="sky">{copy.outline}</Tag>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Digital basics</h1>
        <div className="mt-5 flex items-center justify-between text-xs font-bold text-muted"><span>{copy.progress}</span><span>{progress}%</span></div>
        <div className="mt-2"><ProgressBar value={progress} color="sky" /></div>
        <ol className="mt-6 grid gap-2 text-sm">
          <li className="rounded-xl border border-sky bg-sky-soft p-3 font-bold text-ink">01 · Getting started</li>
          <li className="rounded-xl border border-[var(--line)] p-3 text-muted">02 · Staying safe online</li>
          <li className="rounded-xl border border-[var(--line)] p-3 text-muted">03 · Useful tools</li>
          <li className="rounded-xl border border-[var(--line)] p-3 text-muted">04 · Practice project</li>
        </ol>
      </aside>

      <article className="min-w-0">
        <Tag color="sky">{copy.lesson}</Tag>
        <h2 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">{copy.title}</h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">{copy.intro}</p>

        <section className="mt-8 overflow-hidden rounded-3xl bg-ink shadow-xl" aria-label={copy.video}>
          <div className="relative grid min-h-[18rem] place-items-center overflow-hidden bg-gradient-to-br from-cobalt via-ink to-violet p-8 text-center sm:min-h-[25rem]">
            <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-sky/30 blur-3xl" />
            <div className="relative">
              <button type="button" aria-label={`Play ${copy.video}`} className="grid h-20 w-20 place-items-center rounded-full bg-amber text-3xl text-ink shadow-lg transition hover:scale-105">▶</button>
              <p className="mt-5 font-display text-xl font-bold text-white">{copy.video}</p>
              <p className="mt-1 text-sm text-white/65">{copy.videoNote}</p>
            </div>
          </div>
        </section>

        <Card className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-2xl font-bold">{copy.notes}</h3><p className="mt-1 text-sm text-muted">{copy.notesHint}</p></div><button type="button" onClick={downloadNotes} className="min-h-11 rounded-full border border-[var(--line)] px-4 text-sm font-bold hover:border-cobalt hover:text-cobalt">{copy.download}</button></div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-5 min-h-36 w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--page-bg)] p-4 text-base outline-none focus:border-cobalt" placeholder={copy.notesHint} />
          <p aria-live="polite" className="mt-2 text-sm text-mint">{notes && copy.saved}</p>
        </Card>

        <Card className="mt-6">
          <h3 className="font-display text-2xl font-bold">{copy.question}</h3>
          <p className="mt-2 text-muted">{copy.questionText}</p>
          <div className="mt-5 grid gap-3">{copy.answers.map((option) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${answer === option ? "border-cobalt bg-blue-50" : "border-[var(--line)] hover:border-cobalt"}`}><input type="radio" name="answer" value={option} checked={answer === option} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }} className="mt-1 accent-cobalt" />{option}</label>)}</div>
          <button type="button" onClick={() => setChecked(true)} disabled={!answer} className="mt-5 min-h-11 rounded-full bg-cobalt px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{copy.check}</button>
          {checked && <p className={`mt-4 text-sm font-bold ${answer === copy.correct ? "text-mint" : "text-coral"}`}>{answer === copy.correct ? copy.right : copy.wrong}</p>}
        </Card>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="bg-sky-soft"><p className="text-sm font-bold text-ink">{copy.recommended}</p><h3 className="mt-3 font-display text-2xl font-bold text-ink">{copy.next}</h3><p className="mt-2 text-sm text-ink/70">{copy.recommendText}</p><button type="button" className="mt-5 min-h-11 rounded-full bg-ink px-4 text-sm font-bold text-white">{copy.duration} →</button></Card>
          <Card><h3 className="font-display text-2xl font-bold">{copy.discussion}</h3><form onSubmit={postComment} className="mt-4 grid gap-3"><textarea value={comment} onChange={(event) => setComment(event.target.value)} className="min-h-24 rounded-xl border border-[var(--line)] bg-[var(--page-bg)] p-3 text-sm outline-none focus:border-cobalt" placeholder={copy.commentHint} /><button type="submit" className="min-h-11 rounded-full bg-amber px-4 text-sm font-bold text-ink">{copy.post}</button></form>{posted ? <p className="mt-4 rounded-xl bg-[var(--page-bg)] p-3 text-sm">{posted}</p> : <p className="mt-4 text-sm text-muted">{copy.noComment}</p>}</Card>
        </div>

        <button type="button" onClick={() => setComplete((value) => !value)} className="mt-8 min-h-12 rounded-full bg-amber px-6 font-bold text-ink hover:bg-cobalt hover:text-white">{complete ? copy.completed : copy.complete}</button>
      </article>
    </div>
  );
}
