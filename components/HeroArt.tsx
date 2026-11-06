/** The logo's "B" scaled up: two stacked units, like servers or two steps up. */
function Chip({
  label,
  dot,
  className,
  delay,
}: {
  label: string;
  dot: string;
  className: string;
  delay: string;
}) {
  return (
    <span
      className={`settle absolute flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg ${className}`}
      style={{ "--d": delay } as React.CSSProperties}
    >
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

export default function HeroArt({
  labels,
}: {
  labels: { website: string; network: string; backups: string };
}) {
  return (
    <div className="relative mx-auto aspect-[10/11] w-full max-w-md" aria-hidden="true">
      <svg viewBox="0 0 400 440" className="settle h-full w-full" style={{ "--d": "0ms" } as React.CSSProperties}>
        <defs>
          <linearGradient id="poster-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffe39a" />
            <stop offset="0.5" stopColor="#c99d3d" />
            <stop offset="1" stopColor="#fff0b8" />
          </linearGradient>
          <linearGradient id="poster-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f4bff" />
            <stop offset="1" stopColor="#426cff" />
          </linearGradient>
        </defs>
        <rect x="22" y="18" width="356" height="404" rx="28" fill="#07152d" stroke="#c99d3d" strokeOpacity="0.5" strokeWidth="2" />
        <path d="M48 110h304M48 330h304M200 45v350" stroke="url(#poster-gold)" strokeOpacity="0.35" />
        <path d="M54 82L346 358M346 82L54 358" stroke="url(#poster-gold)" strokeWidth="2" strokeOpacity="0.8" />
        <circle cx="200" cy="220" r="126" fill="none" stroke="url(#poster-gold)" strokeWidth="3" />
        <circle cx="200" cy="220" r="92" fill="none" stroke="#1f4bff" strokeOpacity="0.7" strokeWidth="12" />
        <path d="M76 280V145h28v105h44v30zm72 0V145h48c31 0 49 17 49 43 0 14-6 26-18 34 14 7 22 20 22 37 0 13-4 22-12 30h-35c10-7 15-16 15-27 0-13-9-21-26-21h-15v39zm28-70h18c15 0 23-7 23-19s-8-19-23-19h-18zm75 70V145h28v58l48-58h36l-54 64 58 71h-38l-50-61v61z" fill="white" fillOpacity="0.96" />
        <path d="M88 302h224" stroke="url(#poster-gold)" strokeWidth="5" />
        <circle cx="74" cy="78" r="5" fill="#ffb400" />
        <circle cx="326" cy="362" r="5" fill="#1f4bff" />
      </svg>
      <Chip label={labels.website} dot="#19b37a" className="left-[56%] top-[6%]" delay="350ms" />
      <Chip label={labels.network} dot="#1F4BFF" className="left-[62%] top-[46%]" delay="500ms" />
      <Chip label={labels.backups} dot="#FFB400" className="left-[38%] top-[88%]" delay="650ms" />
    </div>
  );
}