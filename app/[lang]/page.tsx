import Header from "@/components/Header";
import HeroArt from "@/components/HeroArt";
import IntroSplash from "@/components/IntroSplash";
import Logo from "@/components/Logo";
import DemoVideo from "@/components/DemoVideo";
import { Card, Tag } from "@/components/ui/Controls";
import { areaLinks } from "@/lib/platform";
import { dictionaries, isLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { notFound } from "next/navigation";

const areaClasses = {
  cobalt: "bg-cobalt text-white",
  sky: "bg-sky text-ink",
  coral: "bg-coral text-ink",
  mint: "bg-mint text-ink",
  violet: "bg-violet text-white",
};

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const copy = dictionaries[lang];
  const path = (href: string) => `/${lang}${href}`;

  return (
    <>
      <IntroSplash tagline={copy.intro.tagline} skipLabel={copy.intro.skip} />
      <Header lang={lang} copy={copy} />
      <main className="pb-20 lg:pb-0">
        <section className="relative overflow-hidden bg-cobalt text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:py-24">
            <div className="settle max-w-2xl">
              <Tag color="cobalt">One platform, many ways forward</Tag>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl lg:text-8xl">Technology for the work, learning and play ahead.</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{copy.hero.description}</p>
              <a href={path("/services")} className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-amber px-6 py-3 font-bold text-ink hover:bg-white">Start with 2BG <span aria-hidden="true">→</span></a>
            </div>
            <HeroArt labels={copy.art} />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-cobalt">Choose your path</p><h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-6xl">One place to build what is next.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-12 md:grid-rows-2">
            {areaLinks.map((area, index) => (
              <a key={area.key} href={path(area.href)} className={`${areaClasses[area.color]} group rounded-2xl p-6 transition-transform hover:-translate-y-1 ${index === 1 ? "md:col-span-5 md:row-span-2 md:p-8" : index === 2 ? "md:col-span-4" : "md:col-span-3"}`}>
                <div className="flex h-full flex-col justify-between gap-10"><div><p className="text-sm font-bold opacity-70">0{index + 1}</p><h3 className="mt-3 font-display text-3xl font-extrabold">{area.label}</h3><p className="mt-3 max-w-xs leading-relaxed opacity-80">{area.description}</p></div><span className="flex items-center gap-2 text-sm font-bold">Explore <span className="transition-transform group-hover:translate-x-1">→</span></span></div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-[var(--surface)]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:py-24">
            <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-cobalt">Services</p><h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">{copy.services.heading}</h2><p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{copy.services.description}</p><a href={path("/services")} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-5 font-bold hover:border-cobalt hover:text-cobalt">See all services <span>→</span></a></div>
            <div className="grid gap-3 sm:grid-cols-2">{copy.services.items.slice(0, 4).map((service) => <Card key={service.title}><h3 className="font-display text-xl font-bold">{service.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{service.text}</p></Card>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24"><div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-violet">Learn and grow</p><h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Practical skills for real life and work.</h2><p className="mt-5 max-w-md text-lg leading-relaxed text-muted">Explore digital literacy, AI and useful technology lessons designed for a first step.</p><a href={path("/learn")} className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-cobalt px-5 font-bold text-white hover:bg-cobalt-deep">Explore Learn <span>→</span></a></div><DemoVideo l={copy.demo} /></div></section>

        <section className="bg-ink text-white"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:items-center md:py-20"><div><h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">{copy.contact.heading}</h2><p className="mt-4 text-white/70">{site.address}</p></div><div className="flex flex-wrap gap-3"><a href={`mailto:${site.email}`} className="rounded-full bg-amber px-5 py-3 font-bold text-ink">{copy.contact.email} {site.email}</a><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="rounded-full border border-white/40 px-5 py-3 font-bold">{copy.contact.phone}</a></div></div></section>
      </main>
      <footer className="border-t border-[var(--line)] bg-[var(--surface)]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between"><Logo label={copy.logoLabel} /><div className="text-muted"><p className="font-semibold text-[var(--copy)]">{copy.footer.founder}: Eng. Bayisa Balcha</p><p className="mt-1">© {new Date().getFullYear()} {site.name}. {copy.footer.rights}</p></div></div></footer>
    </>
  );
}
