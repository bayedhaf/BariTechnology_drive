"use client";

import { useState } from "react";
import { mockFriends, mockGames } from "@/lib/platform";
import { Button, Card, Input, Tag } from "@/components/ui/Controls";
import Icon from "@/components/ui/Icon";
import DodgeBlocks from "./DodgeBlocks";

const gameStyles = {
  violet: { frame: "bg-violet-soft text-violet", border: "border-violet/30" },
  cobalt: { frame: "bg-blue-100 text-cobalt", border: "border-cobalt/30" },
  coral: { frame: "bg-coral-soft text-coral", border: "border-coral/30" },
} as const;

export default function PlayLobby() {
  const [room, setRoom] = useState(false);
  const [code, setCode] = useState("");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  if (selectedGame === "Dodge the Blocks") {
    return <div><button type="button" className="mb-5 text-sm font-bold text-night-muted hover:text-night-text" onClick={() => setSelectedGame(null)}>← Back to games</button><DodgeBlocks /></div>;
  }
  return <div className="grid gap-10 lg:grid-cols-[1fr_0.34fr]">
    <div><div className="flex flex-wrap gap-3"><Button onClick={() => setRoom(true)}>Create room</Button><Button variant="secondary" onClick={() => setRoom(true)}>Join with code</Button></div><div className="mt-10"><p className="text-sm font-bold text-violet">Choose a game</p><h2 className="mt-2 font-display text-3xl font-extrabold">Play together</h2><div className="mt-5 grid gap-4 sm:grid-cols-3">{mockGames.map((game) => <Card key={game.title} className={gameStyles[game.accent as keyof typeof gameStyles].border}><div className={`grid h-32 place-items-center rounded-xl ${gameStyles[game.accent as keyof typeof gameStyles].frame}`}><Icon name="game" className="h-12 w-12" /></div><h3 className="mt-4 font-display text-xl font-bold">{game.title}</h3><p className="mt-1 text-sm text-muted">{game.players}</p><Button variant="secondary" className="mt-4 w-full" onClick={() => game.title === "Dodge the Blocks" ? setSelectedGame(game.title) : setRoom(true)}>{game.title === "Dodge the Blocks" ? "Play game" : "Join room"}</Button></Card>)}</div></div></div>
    <Card className="h-fit"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-violet">Community</p><h2 className="mt-1 font-display text-2xl font-extrabold">Friends online</h2></div><Tag color="violet">Demo</Tag></div><ul className="mt-5 space-y-3">{mockFriends.map((friend) => <li key={friend.name} className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${friend.color}`} aria-hidden="true" /><span className="font-semibold">{friend.name}</span><span className="text-sm text-muted">({friend.status})</span></li>)}</ul><p className="mt-6 text-xs text-muted">Status uses text and shape as well as color.</p></Card>
    {room && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-5"><Card className="w-full max-w-md"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-extrabold">Join a room</h2><button className="min-h-11 px-3 text-2xl" onClick={() => setRoom(false)} aria-label="Close room dialog">×</button></div><p className="mt-2 text-sm text-muted">Enter a code or create a new placeholder room.</p><Input label="Room code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="2BG-1234" /><div className="mt-5 flex gap-3"><Button onClick={() => setRoom(false)}>{code ? "Join room" : "Create room"}</Button><Button variant="ghost" onClick={() => setRoom(false)}>Cancel</Button></div><p className="mt-4 text-xs text-muted">TODO: connect real rooms, video, chat and game state.</p></Card></div>}
  </div>;
}
