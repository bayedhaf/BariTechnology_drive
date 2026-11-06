"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button, Card } from "@/components/ui/Controls";

type Obstacle = { lane: number; y: number; barrier: boolean };
type Coin = { lane: number; y: number; height: number };
type GameStatus = "ready" | "playing" | "over";

export default function DodgeBlocks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ lane: 1, jump: 0, velocity: 0, lives: 3, score: 0, coins: 0, speed: 220, elapsed: 0, spawn: 0.6, hurt: 0, obstacles: [] as Obstacle[], coinsList: [] as Coin[] });
  const [status, setStatus] = useState<GameStatus>("ready");
  const best = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener("2bg-dodge-best-change", onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("2bg-dodge-best-change", onChange);
      };
    },
    () => Number(window.localStorage.getItem("2bg-dodge-best") ?? 0),
    () => 0,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || status !== "playing") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const canvasElement = canvas;
    const drawingContext = context;
    const state = stateRef.current;
    let frame = 0;
    let previous = performance.now();

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      const rect = canvasElement.getBoundingClientRect();
      canvasElement.width = rect.width * ratio;
      canvasElement.height = rect.height * ratio;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw(now: number) {
      const delta = Math.min((now - previous) / 1000, 0.04);
      previous = now;
      const width = canvasElement.clientWidth;
      const height = canvasElement.clientHeight;
      state.elapsed += delta;
      state.speed = Math.min(520, 220 + state.elapsed * 8);
      state.spawn -= delta;
      state.hurt = Math.max(0, state.hurt - delta);
      if (state.spawn <= 0) {
        const lane = Math.floor(Math.random() * 3);
        state.obstacles.push({ lane, y: -50, barrier: Math.random() > 0.6 });
        if (Math.random() > 0.45) state.coinsList.push({ lane: Math.floor(Math.random() * 3), y: -120, height: 0 });
        state.spawn = Math.max(0.42, 0.9 - state.elapsed * 0.006);
      }

      state.obstacles.forEach((obstacle) => { obstacle.y += state.speed * delta; });
      state.coinsList.forEach((coin) => { coin.y += state.speed * delta; coin.height += delta * 6; });
      const laneWidth = width / 3;
      const playerX = laneWidth * (state.lane + 0.5);
      const playerY = height - 76 - state.jump;

      for (let index = state.obstacles.length - 1; index >= 0; index -= 1) {
        const obstacle = state.obstacles[index];
        const obstacleX = laneWidth * (obstacle.lane + 0.5);
        const hit = Math.abs(obstacle.y - playerY) < 34 && Math.abs(obstacleX - playerX) < laneWidth * 0.35 && state.jump < (obstacle.barrier ? 38 : 54);
        if (hit && state.hurt <= 0) {
          state.lives -= 1;
          state.hurt = 1.1;
          state.obstacles.splice(index, 1);
          if (state.lives <= 0) {
            const finalScore = Math.floor(state.score) + state.coins * 25;
            const nextBest = Math.max(best, finalScore);
            window.localStorage.setItem("2bg-dodge-best", String(nextBest));
            window.dispatchEvent(new Event("2bg-dodge-best-change"));
            setStatus("over");
            return;
          }
        } else if (obstacle.y > height + 60) {
          state.obstacles.splice(index, 1);
        }
      }

      for (let index = state.coinsList.length - 1; index >= 0; index -= 1) {
        const coin = state.coinsList[index];
        const coinX = laneWidth * (coin.lane + 0.5);
        if (Math.abs(coin.y - playerY) < 32 && Math.abs(coinX - playerX) < laneWidth * 0.3) {
          state.coins += 1;
          state.coinsList.splice(index, 1);
        } else if (coin.y > height + 40) {
          state.coinsList.splice(index, 1);
        }
      }

      state.score += delta * state.speed / 20;
      state.jump += state.velocity * delta;
      state.velocity -= 920 * delta;
      if (state.jump <= 0) { state.jump = 0; state.velocity = 0; }

      drawingContext.clearRect(0, 0, width, height);
      const gradient = drawingContext.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#120a24");
      gradient.addColorStop(1, "#241446");
      drawingContext.fillStyle = gradient;
      drawingContext.fillRect(0, 0, width, height);
      drawingContext.strokeStyle = "rgba(169,182,214,.22)";
      drawingContext.lineWidth = 2;
      for (let index = 1; index < 3; index += 1) {
        drawingContext.beginPath();
        drawingContext.moveTo(laneWidth * index, 0);
        drawingContext.lineTo(laneWidth * index, height);
        drawingContext.stroke();
      }
      drawingContext.fillStyle = "#ff3d81";
      state.obstacles.forEach((obstacle) => {
        const obstacleX = laneWidth * (obstacle.lane + 0.5);
        drawingContext.fillRect(obstacleX - laneWidth * 0.28, obstacle.y, laneWidth * 0.56, obstacle.barrier ? 18 : 42);
      });
      drawingContext.fillStyle = "#3de8d0";
      state.coinsList.forEach((coin) => {
        const coinX = laneWidth * (coin.lane + 0.5);
        drawingContext.beginPath();
        drawingContext.arc(coinX, coin.y, 9 + Math.sin(coin.height) * 2, 0, Math.PI * 2);
        drawingContext.fill();
      });
      if (state.hurt <= 0 || Math.floor(state.hurt * 12) % 2 === 0) {
        drawingContext.fillStyle = "#ffb340";
        drawingContext.fillRect(playerX - 20, playerY - 20, 40, 40);
      }
      drawingContext.fillStyle = "#fff4e0";
      drawingContext.font = "700 16px system-ui";
      drawingContext.fillText(`Score ${Math.floor(state.score)}`, 16, 28);
      drawingContext.fillText(`Lives ${"♥".repeat(state.lives)}${"♡".repeat(3 - state.lives)}`, 16, 52);
      drawingContext.fillText(`Coins ${state.coins}`, width - 90, 28);
      frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [best, status]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (status !== "playing") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") stateRef.current.lane = Math.max(0, stateRef.current.lane - 1);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") stateRef.current.lane = Math.min(2, stateRef.current.lane + 1);
      if (event.code === "Space" || event.key === "ArrowUp") {
        event.preventDefault();
        if (stateRef.current.jump === 0) stateRef.current.velocity = 540;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status]);

  function start() {
    stateRef.current = { lane: 1, jump: 0, velocity: 0, lives: 3, score: 0, coins: 0, speed: 220, elapsed: 0, spawn: 0.6, hurt: 0, obstacles: [], coinsList: [] };
    setStatus("playing");
  }

  return <Card className="overflow-hidden border-violet/40 bg-night-raised p-3 text-night-text sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-2xl font-extrabold">Dodge the Blocks</h2><p className="text-sm text-night-muted">Use A/D or arrow keys. Press Space to jump.</p></div><p className="text-sm text-night-muted">Best: <span className="font-bold text-amber">{best}</span></p></div>
    <div className="relative mt-4 overflow-hidden rounded-xl border border-night-line">
      <canvas ref={canvasRef} className="h-[min(68vh,520px)] min-h-[360px] w-full touch-none" onPointerUp={(event) => { if (status !== "playing") return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientY < rect.top + rect.height * 0.35 && stateRef.current.jump === 0) stateRef.current.velocity = 540; else stateRef.current.lane = event.clientX < rect.left + rect.width / 2 ? Math.max(0, stateRef.current.lane - 1) : Math.min(2, stateRef.current.lane + 1); }} />
      {status !== "playing" && <div className="absolute inset-0 grid place-items-center bg-night/75 p-5 text-center"><div><p className="font-display text-4xl font-extrabold">{status === "over" ? "Run over" : "Ready?"}</p><p className="mt-2 max-w-sm text-night-muted">{status === "over" ? "Avoid the blocks, jump barriers and collect coins to beat your best score." : "Switch lanes, jump low barriers and keep moving."}</p><Button className="mt-5" onClick={start}>{status === "over" ? "Play again" : "Start game"}</Button></div></div>}
    </div>
    <p className="mt-3 text-xs text-night-muted">TODO: add multiplayer rooms, shared scores and server-side leaderboards.</p>
  </Card>;
}
