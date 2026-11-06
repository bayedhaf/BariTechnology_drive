"use client";

import { useMemo, useState } from "react";
import { mockJobs } from "@/lib/platform";
import { Button, Card, Input, Select, Tag } from "@/components/ui/Controls";

export default function JobsBoard() {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("All fields");
  const [location, setLocation] = useState("All locations");
  const [saved, setSaved] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");

  const jobs = useMemo(() => mockJobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.tags.join(" ")}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (field === "All fields" || job.tags.includes(field)) && (location === "All locations" || job.location === location);
  }), [field, location, query]);

  function toggleSaved(title: string) {
    setSaved((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.34fr]">
      <div>
        <div className="grid gap-3 rounded-2xl bg-mint-soft p-4 md:grid-cols-[1fr_0.6fr_0.6fr]">
          <Input label="Search jobs" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Role, skill or company" />
          <Select label="Field" value={field} onChange={(event) => setField(event.target.value)}><option>All fields</option><option>Web</option><option>Marketing</option><option>IT support</option></Select>
          <Select label="Location" value={location} onChange={(event) => setLocation(event.target.value)}><option>All locations</option><option>Addis Ababa</option><option>Remote</option><option>Adama</option></Select>
        </div>
        <div className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-mint">Recommended for you</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Opportunities to explore</h2></div><p className="text-sm text-muted">{jobs.length} demo results</p></div><div className="mt-5 grid gap-3">{jobs.map((job) => <Card key={job.title}><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="font-display text-xl font-bold">{job.title}</h3><p className="mt-1 text-sm text-muted">{job.company} · {job.location} · {job.type}</p><div className="mt-3 flex flex-wrap gap-2">{job.tags.map((tag) => <Tag key={tag} color="mint">{tag}</Tag>)}</div><p className="mt-4 text-xs text-muted">{job.posted} · Placeholder data</p></div><Button variant="secondary" onClick={() => toggleSaved(job.title)}>{saved.includes(job.title) ? "Saved" : "Save job"}</Button></div></Card>)}</div>{jobs.length === 0 && <Card className="mt-4 text-center"><h3 className="font-bold">No demo jobs match those filters.</h3><p className="mt-2 text-sm text-muted">Try a broader search or choose “All” in the filters.</p></Card>}</div>
      </div>
      <Card className="h-fit"><p className="text-sm font-bold text-mint">For employers</p><h2 className="mt-2 font-display text-2xl font-extrabold">Post a job</h2><p className="mt-3 text-sm leading-relaxed text-muted">A simple guided form is ready for the future jobs backend.</p><div className="mt-6 flex items-center gap-2" aria-label={`Step ${step + 1} of 3`}>{[0, 1, 2].map((item) => <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? "bg-mint" : "bg-[var(--line)]"}`} />)}</div><div className="mt-6">{step === 0 && <Input label="Job title" placeholder="Example: Junior designer" />}{step === 1 && <Input label="Company name" placeholder="Your organisation" />}{step === 2 && <Input label="Contact email" type="email" placeholder="you@example.com" />}</div>{message && <p className="mt-3 text-sm font-semibold text-coral">{message}</p>}<Button className="mt-5 w-full" onClick={() => { if (step < 2) setStep(step + 1); else setMessage("Demo only: connect a backend before publishing this job."); }}>{step < 2 ? "Continue" : "Post job"}</Button><p className="mt-3 text-xs text-muted">TODO: add validation, authentication and job storage.</p></Card>
    </div>
  );
}
