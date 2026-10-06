"use client";
import { FormEvent, useEffect, useState } from "react";
import { content, Lang } from "./content";
import Logo from "../components/Logo";
import DemoVideo from "../components/DemoVideo";

export default function Home() {
  const [lang, setLang] = useState<Lang>("om");
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");
  const t = content[lang];

  useEffect(() => {
    const saved = localStorage.getItem("bari-lang") as Lang | null;
    if (saved === "om" || saved === "en") setLang(saved);
    fetch("/api/waitlist").then((r) => r.json()).then((d) => setCount(d.count)).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("bari-lang", lang);
  }, [lang]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") || "").trim();
    const contact = String(f.get("contact") || "").trim();
    if (!name || !contact) return setMsg(t.bad);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, role: f.get("role"), lang }),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setCount(d.count);
      setMsg(t.ok);
      form.reset();
    } catch {
      setMsg(t.fail);
    }
  }

  return (
    <>
      <header className="hero">
        <div className="wrap">
          <nav className="nav" aria-label="Main">
            <a className="logo" href="#top" aria-label="BARI"><Logo /></a>
            <div className="nav-r">
              <div className="lang" role="group" aria-label="Language">
                {(["om", "en"] as Lang[]).map((l) => (
                  <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>
                    {content[l].langName}
                  </button>
                ))}
              </div>
              <a className="btn sm" href="#join">{t.join}</a>
            </div>
          </nav>
          <div className="hero-grid">
          <div className="hero-body" id="top">
            <h1>{t.h1}</h1>
            <p>{t.sub}</p>
            <a className="btn" href="#join">{t.joinHero}</a>
            <div className="tag">{t.meaning}</div>
          </div>
          <DemoVideo l={{ title: t.demoTitle, badge: t.demoBadge, empty: t.demoEmpty, play: t.demoPlayBtn, pause: t.demoPause, sound: t.demoSound, mute: t.demoMute, open: t.demoOpen, full: t.demoFull, fit: t.demoFit, fill: t.demoFill }} />
          </div>
        </div>
        <div className="big" aria-hidden="true">BARI</div>
        <div className="sun" aria-hidden="true" />
        <svg className="hills" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120V70C150 20 260 90 420 60S720 10 880 55 1100 90 1200 50V120Z" fill="#14163A" />
        </svg>
      </header>

      <main>
        <section id="what">
          <div className="wrap">
            <h2 className="sec-h">{t.whatH}</h2>
            <p className="lead">{t.whatLead}</p>
            <div className="grid feat">
              {t.features.map((x) => (
                <article className="card" key={x.t}>
                  <div className="ic">{x.ic}</div>
                  <h3>{x.t}</h3>
                  <p>{x.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="who" id="who">
          <div className="wrap">
            <h2 className="sec-h">{t.whoH}</h2>
            <p className="lead">{t.whoLead}</p>
            <div className="ages">
              {t.ages.map((a) => (
                <div className="age" key={a.tag}>
                  <span>{a.tag}</span>
                  <h3>{a.t}</h3>
                  <p>{a.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="topics">
          <div className="wrap">
            <h2 className="sec-h">{t.topicsH}</h2>
            <p className="lead">{t.topicsLead}</p>
            <ul className="topics">{t.topics.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </section>

        <section id="join" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="wait">
              <div>
                <h2>{t.waitH}</h2>
                <p>{t.waitP}</p>
                {count > 0 && <div className="count" aria-live="polite">{t.count(count)}</div>}
              </div>
              <form onSubmit={submit} noValidate>
                <label>{t.name}<input name="name" autoComplete="name" required /></label>
                <label>{t.contact}<input name="contact" required placeholder="+251… / @username" /></label>
                <label>{t.role}
                  <select name="role" defaultValue="youth">
                    {Object.entries(t.roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </label>
                <button className="btn" type="submit">{t.join}</button>
                <div className="msg" role="status">{msg}</div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-brand"><Logo size={30} /> <span>{t.h1}</span></div>
          <div>© 2026 BARI</div>
        </div>
      </footer>
    </>
  );
}