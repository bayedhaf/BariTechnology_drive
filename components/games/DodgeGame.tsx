"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Overlay = {
  visible: boolean;
  title: string;
  result: string;
  hint: string;
  button: string;
  focus: boolean;
};

type GameState = "ready" | "playing" | "paused" | "over";

const START_HINT =
  "Switch lanes with ← → or A D. Jump low barriers with Space. Collect coins, and you have three lives.\nOn touch: tap left or right, swipe up to jump.";

const INITIAL_OVERLAY: Overlay = {
  visible: true,
  title: "Dodge the Blocks",
  result: "",
  hint: START_HINT,
  button: "Start",
  focus: false,
};

export default function DodgeGame({ embedded = false }: { embedded?: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);
  const livesRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const coinsRef = useRef<HTMLSpanElement>(null);
  const goRef = useRef<HTMLButtonElement>(null);
  const apiRef = useRef<{ activate: () => void } | null>(null);

  const [overlay, setOverlay] = useState<Overlay>(INITIAL_OVERLAY);

  // Move keyboard focus to the button when the game ends.
  useEffect(() => {
    if (overlay.visible && overlay.focus) goRef.current?.focus();
  }, [overlay]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const setText = (
      ref: React.RefObject<HTMLElement | null>,
      value: string | number
    ) => {
      if (ref.current) ref.current.textContent = String(value);
    };

    // Keep the look of the original (three r128): no color management, legacy light scale.
    THREE.ColorManagement.enabled = false;

    const LANES = [-2.5, 0, 2.5];
    let best = 0;
    try {
      best = +(localStorage.getItem("dtb-best") ?? 0) || 0;
    } catch {}
    setText(bestRef, best);

    // ---------- Audio (tiny synth, created on first input) ----------
    let ac: AudioContext | undefined;
    function beep(f: number, d: number, type?: OscillatorType, v?: number) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ac = ac || new Ctor();
        const o = ac.createOscillator();
        const g = ac.createGain();
        const t0 = ac.currentTime;
        o.type = type || "square";
        o.frequency.setValueAtTime(f, t0);
        g.gain.setValueAtTime(v || 0.04, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
        o.connect(g);
        g.connect(ac.destination);
        o.start(t0);
        o.stop(t0 + d);
      } catch {}
    }

    // ---------- Scene ----------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x120a24);
    scene.fog = new THREE.Fog(0x120a24, 18, 55);

    const width = () => mount.clientWidth || window.innerWidth;
    const height = () => mount.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(70, width() / height(), 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setSize(width(), height());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55 * Math.PI));
    const sun = new THREE.DirectionalLight(0xffd9a0, 0.9 * Math.PI);
    sun.position.set(5, 10, 6);
    scene.add(sun);

    const track = new THREE.Mesh(
      new THREE.PlaneGeometry(7.6, 90),
      new THREE.MeshStandardMaterial({ color: 0x241446 })
    );
    track.rotation.x = -Math.PI / 2;
    track.position.z = -30;
    scene.add(track);

    // scrolling lane dashes
    const dashGeo = new THREE.BoxGeometry(0.12, 0.02, 2);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0x5a4a8c });
    const dashes: THREE.Mesh[] = [];
    for (const x of [-1.25, 1.25]) {
      for (let i = 0; i < 12; i++) {
        const d = new THREE.Mesh(dashGeo, dashMat);
        d.position.set(x, 0.02, 8 - i * 5);
        scene.add(d);
        dashes.push(d);
      }
    }

    // roadside towers
    const towers: THREE.Mesh[] = [];
    const towerMats = [0xff3d81, 0x3de8d0, 0x7a5cff].map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: 0x1c1038,
          emissive: c,
          emissiveIntensity: 0.35,
        })
    );
    const unit = new THREE.BoxGeometry(2, 1, 2);
    function resetTower(t: THREE.Mesh, z: number) {
      const h = 2 + Math.random() * 8;
      t.scale.y = h;
      t.position.set(t.userData.side * (6 + Math.random() * 3), h / 2, z);
    }
    for (const side of [-1, 1]) {
      for (let i = 0; i < 10; i++) {
        const t = new THREE.Mesh(unit, towerMats[(i + (side > 0 ? 1 : 0)) % 3]);
        t.userData.side = side;
        resetTower(t, 8 - i * 6);
        scene.add(t);
        towers.push(t);
      }
    }

    // player + blob shadow
    const player = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffb340, emissive: 0x6a3a00 })
    );
    scene.add(player);
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.6, 16),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.4,
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    // obstacle + coin assets
    const blockGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const barrierGeo = new THREE.BoxGeometry(2.2, 0.7, 0.8);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0xff3d81,
      emissive: 0x5a1030,
    });
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x7a5cff,
      emissive: 0x2a1a6a,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const blockEdges = new THREE.EdgesGeometry(blockGeo);
    const barrierEdges = new THREE.EdgesGeometry(barrierGeo);
    const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 14);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0x3de8d0,
      emissive: 0x138070,
    });
    const partGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const partMats = new Map<number, THREE.MeshBasicMaterial>();

    let obstacles: THREE.Mesh[] = [];
    let coinsArr: THREE.Mesh[] = [];
    let parts: THREE.Mesh[] = [];

    function addObstacle(laneIdx: number, type: "block" | "barrier", z: number) {
      const high = type === "block";
      const m = new THREE.Mesh(
        high ? blockGeo : barrierGeo,
        high ? blockMat : barrierMat
      );
      m.add(new THREE.LineSegments(high ? blockEdges : barrierEdges, edgeMat));
      const h = high ? 1.8 : 0.7;
      m.position.set(LANES[laneIdx], h / 2, z);
      m.userData = { top: h, hw: high ? 0.9 : 1.1, hd: high ? 0.9 : 0.4 };
      scene.add(m);
      obstacles.push(m);
    }
    function addCoin(laneIdx: number, z: number, y?: number) {
      const c = new THREE.Mesh(coinGeo, coinMat);
      c.rotation.x = Math.PI / 2;
      c.position.set(LANES[laneIdx], y || 0.8, z);
      scene.add(c);
      coinsArr.push(c);
    }
    function burst(pos: THREE.Vector3, color: number, n: number, power: number) {
      let mat = partMats.get(color);
      if (!mat) {
        mat = new THREE.MeshBasicMaterial({ color });
        partMats.set(color, mat);
      }
      for (let i = 0; i < n; i++) {
        const p = new THREE.Mesh(partGeo, mat);
        p.position.copy(pos);
        p.userData = {
          v: new THREE.Vector3(
            (Math.random() - 0.5) * power,
            Math.random() * power * 0.8,
            (Math.random() - 0.5) * power
          ),
          life: 0.7,
        };
        scene.add(p);
        parts.push(p);
      }
    }

    // ---------- Spawning: always leaves an open or jumpable path ----------
    function spawnPattern() {
      const z = -48;
      const r = Math.random();
      const open = Math.floor(Math.random() * 3);
      if (r < 0.4) {
        addObstacle(open, "block", z);
      } else if (r < 0.65) {
        for (let l = 0; l < 3; l++) if (l !== open) addObstacle(l, "block", z);
        for (let i = 0; i < 4; i++) addCoin(open, z - i * 2);
      } else if (r < 0.85) {
        for (let l = 0; l < 3; l++) addObstacle(l, "barrier", z);
        for (let l = 0; l < 3; l++) addCoin(l, z, 2.3); // reward the jump
      } else {
        addObstacle(open, "block", z);
        addObstacle((open + 1 + Math.floor(Math.random() * 2)) % 3, "barrier", z - 7);
      }
      if (Math.random() < 0.35)
        for (let i = 0; i < 5; i++)
          addCoin(Math.floor(Math.random() * 3), z - 14 - i * 2);
    }

    // ---------- State ----------
    let state: GameState = "ready";
    let lane = 1;
    let vy = 0;
    let onGround = true;
    let t = 0;
    let dist = 0;
    let speed = 14;
    let spawnT = 0;
    let lives = 3;
    let hurtT = 0;
    let coinCount = 0;
    let shake = 0;

    let last = performance.now();
    const getDelta = () => {
      const now = performance.now();
      const d = (now - last) / 1000;
      last = now;
      return d;
    };

    const scoreVal = () => Math.floor(dist / 2) + coinCount * 25;
    const setLives = () =>
      setText(livesRef, "♥".repeat(lives) + "♡".repeat(3 - lives));

    function start() {
      [...obstacles, ...coinsArr, ...parts].forEach((o) => scene.remove(o));
      obstacles = [];
      coinsArr = [];
      parts = [];
      lane = 1;
      vy = 0;
      onGround = true;
      t = 0;
      dist = 0;
      speed = 14;
      spawnT = 0.6;
      lives = 3;
      hurtT = 0;
      coinCount = 0;
      shake = 0;
      player.position.set(0, 0.5, 0);
      player.visible = true;
      player.rotation.set(0, 0, 0);
      setLives();
      setText(coinsRef, 0);
      setOverlay((o) => ({ ...o, visible: false, focus: false }));
      state = "playing";
      getDelta();
      beep(520, 0.12, "triangle");
    }

    function endGame() {
      state = "over";
      const s = scoreVal();
      let msg = `Score ${s}`;
      if (s > best) {
        best = s;
        msg += " — new best!";
        try {
          localStorage.setItem("dtb-best", String(best));
        } catch {}
      }
      setText(bestRef, best);
      setOverlay({
        visible: true,
        title: "Crashed",
        result: msg,
        hint: `You lasted ${t.toFixed(1)} seconds and collected ${coinCount} coins.`,
        button: "Play again",
        focus: true,
      });
    }

    function pause(on: boolean) {
      if (on && state === "playing") {
        state = "paused";
        setOverlay({
          visible: true,
          title: "Paused",
          result: "",
          hint: "Press P or Escape to resume.",
          button: "Resume",
          focus: false,
        });
      } else if (!on && state === "paused") {
        state = "playing";
        setOverlay((o) => ({ ...o, visible: false, focus: false }));
        getDelta();
      }
    }

    function jump() {
      if (state === "playing" && onGround) {
        vy = 11.5;
        onGround = false;
        beep(660, 0.1, "sine", 0.05);
      }
    }
    function move(d: number) {
      if (state === "playing") lane = Math.max(0, Math.min(2, lane + d));
    }

    apiRef.current = {
      activate: () => {
        if (state === "paused") pause(false);
        else start();
      },
    };

    // ---------- Input ----------
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const c = e.code;
      if (c === "ArrowLeft" || c === "KeyA") move(-1);
      else if (c === "ArrowRight" || c === "KeyD") move(1);
      else if (c === "Space" || c === "ArrowUp" || c === "KeyW") {
        e.preventDefault();
        if (state === "ready" || state === "over") start();
        else if (state === "paused") pause(false);
        else jump();
      } else if (c === "Enter" && (state === "ready" || state === "over")) {
        e.preventDefault();
        start();
      } else if (c === "KeyP" || c === "Escape") {
        if (state === "paused") pause(false);
        else pause(true);
      }
    };
    let sx = 0;
    let sy = 0;
    const onPointerDown = (e: PointerEvent) => {
      sx = e.clientX;
      sy = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (dy < -40 && Math.abs(dy) > Math.abs(dx)) jump();
      else if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1);
      else move(e.clientX < window.innerWidth / 2 ? -1 : 1);
    };
    const onVisibility = () => {
      if (document.hidden) pause(true);
    };
    const onResize = () => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // ---------- Loop ----------
    let raf = 0;
    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(getDelta(), 0.05);
      const idle = state === "ready" || state === "over";
      const live = state === "playing";
      const flow = live ? speed : idle ? 5 : 0;

      // world scroll
      dashes.forEach((d) => {
        d.position.z += flow * dt;
        if (d.position.z > 8) d.position.z -= 60;
      });
      towers.forEach((tw) => {
        tw.position.z += flow * dt;
        if (tw.position.z > 12) resetTower(tw, tw.position.z - 60);
      });

      if (live) {
        t += dt;
        dist += speed * dt;
        speed = Math.min(38, 14 + t * 0.35);

        // player movement, jump physics, tilt
        const tx = LANES[lane];
        const dx = tx - player.position.x;
        player.position.x += dx * Math.min(1, dt * 14);
        player.rotation.z = -dx * 0.12;
        if (!onGround) {
          vy -= 32 * dt;
          player.position.y += vy * dt;
          player.rotation.x -= dt * 9;
          if (player.position.y <= 0.5) {
            player.position.y = 0.5;
            vy = 0;
            onGround = true;
            player.rotation.x = 0;
          }
        }
        shadow.position.set(player.position.x, 0.03, 0);
        shadow.scale.setScalar(Math.max(0.4, 1 - (player.position.y - 0.5) * 0.25));

        // invulnerability blink
        if (hurtT > 0) {
          hurtT -= dt;
          player.visible = Math.floor(hurtT * 14) % 2 === 0;
          if (hurtT <= 0) player.visible = true;
        }

        // spawn
        spawnT -= dt;
        if (spawnT <= 0) {
          spawnPattern();
          spawnT = Math.max(0.55, 1.5 - t * 0.012) + Math.random() * 0.25;
        }

        // obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const o = obstacles[i];
          o.position.z += speed * dt;
          const u = o.userData;
          if (
            hurtT <= 0 &&
            Math.abs(o.position.z) < u.hd + 0.5 &&
            Math.abs(o.position.x - player.position.x) < u.hw + 0.4 &&
            player.position.y - 0.5 < u.top - 0.05
          ) {
            lives--;
            setLives();
            hurtT = 1.5;
            shake = 0.6;
            burst(o.position, 0xff3d81, 18, 9);
            beep(110, 0.3, "sawtooth", 0.08);
            scene.remove(o);
            obstacles.splice(i, 1);
            if (lives <= 0) {
              burst(player.position, 0xffb340, 30, 12);
              player.visible = false;
              endGame();
            }
            continue;
          }
          if (o.position.z > 8) {
            scene.remove(o);
            obstacles.splice(i, 1);
          }
        }

        // coins
        for (let i = coinsArr.length - 1; i >= 0; i--) {
          const c = coinsArr[i];
          c.position.z += speed * dt;
          c.rotation.z += dt * 5;
          const near =
            Math.abs(c.position.z) < 0.9 &&
            Math.abs(c.position.x - player.position.x) < 0.9 &&
            Math.abs(c.position.y - player.position.y) < 1.1;
          if (near) {
            coinCount++;
            setText(coinsRef, coinCount);
            burst(c.position, 0x3de8d0, 6, 4);
            beep(880 + Math.min(coinCount, 20) * 20, 0.08, "square", 0.03);
            scene.remove(c);
            coinsArr.splice(i, 1);
          } else if (c.position.z > 8) {
            scene.remove(c);
            coinsArr.splice(i, 1);
          }
        }

        setText(scoreRef, scoreVal());
        setText(speedRef, (speed / 14).toFixed(1));
      } else if (idle) {
        player.rotation.y += dt * 1.5; // gentle idle spin on the title screen
      }

      // particles (keep animating after game over)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        const u = p.userData;
        u.life -= dt;
        u.v.y -= 20 * dt;
        p.position.addScaledVector(u.v, dt);
        p.rotation.x += dt * 6;
        p.rotation.y += dt * 6;
        if (u.life <= 0 || p.position.y < 0) {
          scene.remove(p);
          parts.splice(i, 1);
        }
      }

      // camera follow + shake
      shake = Math.max(0, shake - dt * 2);
      camera.position.set(
        player.position.x * 0.4 + (Math.random() - 0.5) * shake,
        6 + (Math.random() - 0.5) * shake,
        12
      );
      camera.lookAt(player.position.x * 0.2, 1, -4);

      renderer.render(scene, camera);
    }

    player.position.set(0, 0.5, 0);
    setLives();
    animate();

    // ---------- Cleanup (also runs in React StrictMode) ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      partMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      void ac?.close();
      apiRef.current = null;
      THREE.ColorManagement.enabled = true;
    };
  }, []);

  return (
    <div className={`${embedded ? "relative h-[min(760px,78vh)] min-h-[520px] rounded-2xl" : "fixed inset-0 z-40"} touch-none select-none overflow-hidden bg-[#120a24] text-[#fff4e0]`}>
      <div ref={mountRef} className="absolute inset-0" />

      {/* HUD */}
      <div className="pointer-events-none absolute left-4 right-4 top-[calc(env(safe-area-inset-top,0px)+12px)] flex items-start justify-between text-[22px] font-bold [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
        <div>
          Score <span ref={scoreRef}>0</span>
          <small className="block text-sm font-medium opacity-75">
            Best <span ref={bestRef}>0</span>
          </small>
        </div>
        <div
          ref={livesRef}
          aria-label="Lives"
          className="text-[26px] tracking-[3px] text-[#ff3d81]"
        />
        <div className="text-right">
          Speed <span ref={speedRef}>1.0</span>x
          <small className="block text-sm font-medium opacity-75">
            Coins <span ref={coinsRef}>0</span>
          </small>
        </div>
      </div>

      {/* Start / paused / game over screen */}
      {overlay.visible && (
        <div
          role="dialog"
          aria-label={overlay.title}
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#120a24]/80 p-6 text-center"
        >
          <h1 className="mb-1.5 text-[clamp(40px,9vw,72px)] font-bold leading-none">
            {overlay.title}
          </h1>
          {overlay.result && (
            <p className="my-1.5 text-3xl font-bold text-[#ffb340]">{overlay.result}</p>
          )}
          <p className="my-1.5 max-w-[30em] whitespace-pre-line text-xl opacity-90">
            {overlay.hint}
          </p>
          <button
            ref={goRef}
            type="button"
            onClick={() => {
              apiRef.current?.activate();
              goRef.current?.blur();
            }}
            className="mt-6 cursor-pointer rounded-md bg-[#ffb340] px-9 py-2.5 text-[22px] font-bold text-[#2a1500] hover:bg-[#ffc566] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#3de8d0]"
          >
            {overlay.button}
          </button>
          <Link
            href="/"
            className="mt-4 rounded-full border border-white/40 px-5 py-1.5 text-base font-medium text-[#fff4e0] hover:bg-white/10"
          >
            Exit game
          </Link>
        </div>
      )}
    </div>
  );
}