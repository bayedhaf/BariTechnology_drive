// BARI logo: a sun rising from an open book (dawn + learning).
// The book and the word follow currentColor, so the logo works on dark and light backgrounds.
export default function Logo({ size = 40, word = true }: { size?: number; word?: boolean }) {
  return (
    <span className="logo-lockup" style={{ ["--s" as string]: `${size}px` }}>
      <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="BARI" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="bari-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFD66B"/><stop offset="1" stopColor="#FF7A2F"/></linearGradient></defs>
        <g stroke="#FFC857" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M11.3 42.4L4.4 41.1M18.5 29.9L14 24.6M32 25V18M45.5 29.9L50 24.6M52.7 42.4L59.6 41.1"/></g>
<path d="M17 46a15 15 0 0 1 30 0Z" fill="url(#bari-g)"/>
        <path d="M6 51C17 47 27 48 32 54C37 48 47 47 58 51V59C47 55 37 56 32 62C27 56 17 55 6 59Z" fill="currentColor"/>
      </svg>
      {word && <span className="logo-word" aria-hidden="true">BARI</span>}
    </span>
  );
}