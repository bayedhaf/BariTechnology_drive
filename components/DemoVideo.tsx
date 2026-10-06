"use client";
import { useRef, useState } from "react";

// Set in .env.local: NEXT_PUBLIC_YOUTUBE_ID (video or live stream ID) or NEXT_PUBLIC_YOUTUBE_CHANNEL (UC... channel ID)
const ID = process.env.NEXT_PUBLIC_YOUTUBE_ID || "TwnrsIN5v70";
const CHANNEL = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL ?? "";

export type VideoLabels = {
  title: string; badge: string; empty: string;
  play: string; pause: string; sound: string; mute: string; open: string; full: string; fit: string; fill: string;
};

const DEFAULTS: VideoLabels = {
  title: "BARI Live Demo", badge: "LIVE DEMO", empty: "Add your YouTube video here",
  play: "Play", pause: "Pause", sound: "Turn sound on", mute: "Mute",
  open: "Open on YouTube", full: "Full screen", fit: "Show whole video", fill: "Fill the square",
};

// Accepts either <DemoVideo l={...} /> or the flat props used by older versions of page.tsx,
// and falls back to English defaults, so a missing label can never crash the page.
export default function DemoVideo(props: { l?: Partial<VideoLabels> } & Partial<VideoLabels>) {
  const { l: nested, ...flat } = props;
  const l: VideoLabels = { ...DEFAULTS, ...flat, ...nested };
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [fit, setFit] = useState(false); // false = fill the square (crop sides), true = show the whole video

  const params = "autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1";
  const base = "https://www.youtube-nocookie.com/embed/";
  const src = ID
    ? `${base}${ID}?${params}&playlist=${ID}`
    : CHANNEL ? `${base}live_stream?channel=${CHANNEL}&${params}` : "";
  const openUrl = ID ? `https://www.youtube.com/watch?v=${ID}` : `https://www.youtube.com/channel/${CHANNEL}/live`;

  const cmd = (func: string) =>
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");

  if (!src)
    return (
      <div className="hero-video">
        <div className="hv-empty"><p>{l.empty}</p></div>
      </div>
    );

  return (
    <div className="hero-video" ref={box}>
      <div className={`hv-crop${fit ? " fit" : ""}`}>
        <iframe
          ref={frame}
          src={src}
          title={l.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <span className="demo-badge"><i /> {l.badge}</span>

      <div className="hv-bar" role="group" aria-label={l.title}>
        <button type="button" title={playing ? l.pause : l.play} aria-label={playing ? l.pause : l.play}
          onClick={() => { cmd(playing ? "pauseVideo" : "playVideo"); setPlaying(!playing); }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button type="button" title={muted ? l.sound : l.mute} aria-label={muted ? l.sound : l.mute}
          onClick={() => { cmd(muted ? "unMute" : "mute"); setMuted(!muted); }}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button type="button" title={fit ? l.fill : l.fit} aria-label={fit ? l.fill : l.fit}
          onClick={() => setFit(!fit)}>
          {fit ? "⤢" : "⤡"}
        </button>
        <button type="button" title={l.full} aria-label={l.full}
          onClick={() => box.current?.requestFullscreen?.()}>⛶</button>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" title={l.open} aria-label={l.open}>↗ YouTube</a>
      </div>
    </div>
  );
}