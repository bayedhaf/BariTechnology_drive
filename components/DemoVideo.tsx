"use client";

import { useRef, useState } from "react";

export type VideoLabels = {
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

const videoId = process.env.NEXT_PUBLIC_YOUTUBE_ID?.trim() ?? "";
const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL?.trim() ?? "";
const youtubeIdPattern = /^[\w-]{11}$/;
const validVideoId = youtubeIdPattern.test(videoId) ? videoId : "";
const embedBase = "https://www.youtube-nocookie.com/embed/";

export default function DemoVideo({ l }: { l: VideoLabels }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [fit, setFit] = useState(false);

  const params = "autoplay=1&mute=1&controls=0&loop=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1";
  const src = validVideoId
    ? `${embedBase}${validVideoId}?${params}&playlist=${validVideoId}`
    : channelId
      ? `${embedBase}live_stream?channel=${encodeURIComponent(channelId)}&${params}`
      : "";
  const openUrl = validVideoId
    ? `https://www.youtube.com/watch?v=${validVideoId}`
    : `https://www.youtube.com/channel/${encodeURIComponent(channelId)}/live`;

  const command = (func: "pauseVideo" | "playVideo" | "unMute" | "mute") => {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "https://www.youtube-nocookie.com",
    );
  };

  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-3xl bg-ink px-6 text-center text-white shadow-xl">
        <p className="max-w-sm text-white/80">{l.empty}</p>
      </div>
    );
  }

  return (
    <div ref={box} className="relative overflow-hidden rounded-3xl bg-ink shadow-xl">
      <div className={`aspect-video ${fit ? "" : "scale-[1.18]"}`}>
        <iframe
          ref={frame}
          src={src}
          title={l.title}
          className="h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide text-ink">
        <span aria-hidden="true" className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber" />
        {l.badge}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10" role="group" aria-label={l.title}>
        <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/30" title={playing ? l.pause : l.play} aria-label={playing ? l.pause : l.play} onClick={() => { command(playing ? "pauseVideo" : "playVideo"); setPlaying(!playing); }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/30" title={muted ? l.sound : l.mute} aria-label={muted ? l.sound : l.mute} onClick={() => { command(muted ? "unMute" : "mute"); setMuted(!muted); }}>
          {muted ? "🔇" : "🔊"}
        </button>
        <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/30" title={fit ? l.fill : l.fit} aria-label={fit ? l.fill : l.fit} onClick={() => setFit(!fit)}>
          {fit ? "⤢" : "⤡"}
        </button>
        <button type="button" className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/30" title={l.full} aria-label={l.full} onClick={() => box.current?.requestFullscreen?.()}>
          ⛶
        </button>
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/15 px-3 py-2 text-sm text-white hover:bg-white/30" title={l.open} aria-label={l.open}>
          ↗ YouTube
        </a>
      </div>
    </div>
  );
}
