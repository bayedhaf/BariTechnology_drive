import en from "@/dictionaries/en";
import om from "@/dictionaries/om";

export const locales = ["en", "om"] as const;
export type Locale = (typeof locales)[number];

export type Dictionary = {
  languageName: string;
  logoLabel: string;
  nav: {
    services: string;
    process: string;
    why: string;
    contact: string;
    quote: string;
    menu: string;
    main: string;
    home: string;
    languages: string;
  };
  hero: {
    title: string;
    description: string;
    contactCta: string;
    servicesCta: string;
  };
  services: {
    heading: string;
    description: string;
    items: { icon: string; title: string; text: string }[];
  };
  process: {
    heading: string;
    items: { title: string; text: string }[];
  };
  why: {
    heading: string;
    items: { title: string; text: string }[];
  };
  contact: {
    heading: string;
    email: string;
    phone: string;
  };
  footer: {
    rights: string;
    founder: string;
  };
  intro: {
    tagline: string;
    skip: string;
  };
  art: {
    website: string;
    network: string;
    backups: string;
  };
  demo: {
    heading: string;
    description: string;
    title: string;
    badge: string;
    empty: string;
    play: string;
    pause: string;
    sound: string;
    mute: string;
    open: string;
    full: string;
    fit: string;
    fill: string;
  };
  metadata: {
    title: string;
    description: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = { en, om };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
