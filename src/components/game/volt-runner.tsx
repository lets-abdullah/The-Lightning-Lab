"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap, RotateCcw, Volume2, VolumeX, Trophy, Play } from "lucide-react";

export function VoltRunner({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sound synthesis via Web Audio API (completely offline, zero dependencies)
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq: number, type: OscillatorType, duration: number) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("volt_runner_high_score");
    if (saved) {
      setHighScore(parseInt(saved, 10) || 0);
    }
  }, []);

  const stateRef = useRef({
    gameState: "start" as "start" | "playing" | "gameover",
    score: 0,
    speed: 6.0,
    spark: {
      x: 80,
      y: 190,
      width: 26,
      height: 32,
      vy: 0,
      isGrounded: true,
      jumpsLeft: 2,
    },
    obstacles: [] as Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      type: "resistor" | "capacitor" | "fuse";
    }>,
    particles: [] as Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }>,
    nextSpawn: 70,
    groundY: 220,
  });

  const jump = () => {
    const st = stateRef.current;
    if (st.gameState === "start") {
      startGame();
      return;
    }
    if (st.gameState === "gameover") {
      restartGame();
      return;
    }
    if (st.spark.jumpsLeft > 0) {
      st.spark.vy = -10.5;
      st.spark.isGrounded = false;
      st.spark.jumpsLeft -= 1;
      playBeep(st.spark.jumpsLeft === 1 ? 520 : 780, "sine", 0.12);

      // Spawn electric jump particles
      for (let i = 0; i < 8; i++) {
        st.particles.push({
          x: st.spark.x + st.spark.width / 2,
          y: st.spark.y + st.spark.height,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 3 + 1,
          life: 1,
          maxLife: 20 + Math.random() * 10,
          color: Math.random() > 0.5 ? "#facc15" : "#38bdf8",
        });
      }
    }
  };

  const startGame = () => {
    const st = stateRef.current;
    st.gameState = "playing";
    st.score = 0;
    st.speed = 5.5;
    st.obstacles = [];
    st.particles = [];
    st.nextSpawn = 60;
    st.spark.y = st.groundY - st.spark.height;
    st.spark.vy = 0;
    st.spark.isGrounded = true;
    st.spark.jumpsLeft = 2;
    setScore(0);
    setGameState("playing");
    playBeep(440, "square", 0.1);
  };

  const restartGame = () => {
    startGame();
  };

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const st = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Background
      ctx.fillStyle = "#181416";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle circuit grid lines
      ctx.strokeStyle = "#272124";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Ground Trace Line (Glowing Circuit Bus)
      ctx.shadowColor = "#8B1812";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#8B1812";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, st.groundY);
      ctx.lineTo(width, st.groundY);
      ctx.stroke();

      // Lower ground shading
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#110e10";
      ctx.fillRect(0, st.groundY + 2, width, height - st.groundY);

      if (st.gameState === "playing") {
        st.score += 1;
        if (st.score % 5 === 0) {
          setScore(Math.floor(st.score / 5));
        }

        // Increase speed slightly over time
        if (st.score % 300 === 0 && st.speed < 11) {
          st.speed += 0.4;
          playBeep(880, "triangle", 0.15);
        }

        // Update Spark physics
        st.spark.vy += 0.65; // gravity
        st.spark.y += st.spark.vy;

        if (st.spark.y >= st.groundY - st.spark.height) {
          st.spark.y = st.groundY - st.spark.height;
          st.spark.vy = 0;
          st.spark.isGrounded = true;
          st.spark.jumpsLeft = 2;
        }

        // Spawn obstacles
        st.nextSpawn -= 1;
        if (st.nextSpawn <= 0) {
          const types: Array<"resistor" | "capacitor" | "fuse"> = ["resistor", "capacitor", "fuse"];
          const type = types[Math.floor(Math.random() * types.length)];
          const obsHeight = type === "capacitor" ? 36 : type === "resistor" ? 28 : 22;
          const obsWidth = type === "capacitor" ? 22 : type === "resistor" ? 30 : 20;

          st.obstacles.push({
            x: width + 20,
            y: st.groundY - obsHeight,
            width: obsWidth,
            height: obsHeight,
            type,
          });

          // Randomized next spawn interval (adjusted by speed)
          st.nextSpawn = Math.floor(Math.random() * 50 + 60 - Math.min(st.speed * 2, 35));
        }

        // Move obstacles & collision check
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= st.speed;

          // AABB Hitbox collision
          const hitPadding = 4;
          if (
            st.spark.x + hitPadding < obs.x + obs.width &&
            st.spark.x + st.spark.width - hitPadding > obs.x &&
            st.spark.y + hitPadding < obs.y + obs.height &&
            st.spark.y + st.spark.height > obs.y
          ) {
            // Collision!
            st.gameState = "gameover";
            setGameState("gameover");
            playBeep(180, "sawtooth", 0.35);

            const finalScore = Math.floor(st.score / 5);
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem("volt_runner_high_score", String(finalScore));
            }

            // Explosion particles
            for (let p = 0; p < 25; p++) {
              st.particles.push({
                x: st.spark.x + st.spark.width / 2,
                y: st.spark.y + st.spark.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1,
                maxLife: 30 + Math.random() * 20,
                color: Math.random() > 0.4 ? "#ef4444" : "#facc15",
              });
            }
          }

          if (obs.x + obs.width < -30) {
            st.obstacles.splice(i, 1);
          }
        }

        // Running spark trail particles
        if (Math.random() > 0.3) {
          st.particles.push({
            x: st.spark.x,
            y: st.spark.y + st.spark.height - Math.random() * 10,
            vx: -Math.random() * 2 - 1,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            maxLife: 15,
            color: Math.random() > 0.5 ? "#e11d48" : "#fbbf24",
          });
        }
      }

      // Draw Obstacles
      for (const obs of st.obstacles) {
        ctx.save();
        if (obs.type === "capacitor") {
          // Blue high-voltage capacitor
          ctx.fillStyle = "#0284c7";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);
          // Terminals
          ctx.fillStyle = "#cbd5e1";
          ctx.fillRect(obs.x + 3, obs.y - 4, 4, 4);
          ctx.fillRect(obs.x + obs.width - 7, obs.y - 4, 4, 4);
        } else if (obs.type === "resistor") {
          // Ceramic resistor with colored bands
          ctx.fillStyle = "#d97706";
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          // Color bands
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(obs.x + 6, obs.y, 4, obs.height);
          ctx.fillStyle = "#000000";
          ctx.fillRect(obs.x + 13, obs.y, 4, obs.height);
          ctx.fillStyle = "#eab308";
          ctx.fillRect(obs.x + 20, obs.y, 4, obs.height);
        } else {
          // Glowing blown fuse
          ctx.fillStyle = "#dc2626";
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 8;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = "#fef08a";
          ctx.fillRect(obs.x + 5, obs.y + 4, obs.width - 10, obs.height - 8);
        }
        ctx.restore();
      }

      // Draw Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.restore();

        if (p.life >= p.maxLife) {
          st.particles.splice(i, 1);
        }
      }

      // Draw Spark Runner Character (Lightning Bolt Avatar)
      if (st.gameState !== "gameover") {
        ctx.save();
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 15;

        // Pulsing electric bolt
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        const sx = st.spark.x;
        const sy = st.spark.y;
        // Lightning bolt polygon
        ctx.moveTo(sx + 16, sy);
        ctx.lineTo(sx + 2, sy + 16);
        ctx.lineTo(sx + 13, sy + 16);
        ctx.lineTo(sx + 6, sy + 32);
        ctx.lineTo(sx + 24, sy + 14);
        ctx.lineTo(sx + 13, sy + 14);
        ctx.closePath();
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(sx + 16, sy + 4);
        ctx.lineTo(sx + 7, sy + 15);
        ctx.lineTo(sx + 14, sy + 15);
        ctx.lineTo(sx + 10, sy + 26);
        ctx.lineTo(sx + 20, sy + 15);
        ctx.lineTo(sx + 13, sy + 15);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [highScore, soundEnabled]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`w-full max-w-5xl mx-auto bg-[#181416] border-2 border-[#8B1812]/50 rounded-2xl overflow-hidden shadow-2xl relative select-none ${className}`}>
      {/* Game Header Bar */}
      <div className="bg-[#231f20] px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 text-white">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase">
            VOLT RUNNER • 404 CIRCIUT
          </span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-neutral-400">SCORE:</span>
            <span className="font-bold text-yellow-400 text-sm">{score}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-neutral-300">
            <Trophy className="size-3.5 text-amber-400" />
            <span className="text-[11px] font-bold">{highScore}</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
            title={soundEnabled ? "Mute Game Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-red-400" />}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="relative cursor-pointer touch-none bg-[#181416]"
        onClick={jump}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={280}
          className="w-full h-auto max-h-[62vh] block"
        />

        {/* Start Overlay */}
        {gameState === "start" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-center p-4 space-y-3">
            <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-black uppercase tracking-widest border border-yellow-400/30">
              Interactive 404 Mini-Game
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Reconnect The Power Grid
            </h3>
            <p className="text-xs text-neutral-300 max-w-sm">
              Jump over high-voltage resistors and blown capacitors. Double-jump in mid-air to clear wide gaps!
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-2 bg-[#8B1812] hover:bg-[#a11c15] text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="size-3.5 fill-white" /> Press Space or Click to Jump
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-3">
            <span className="text-red-500 text-xs font-black uppercase tracking-widest">
              CIRCUIT SHORT-CIRCUITED!
            </span>
            <h3 className="text-3xl font-black text-white uppercase">Game Over</h3>
            <div className="flex items-center gap-4 text-sm font-mono text-white">
              <div>
                <span className="text-neutral-400 text-xs block">FINAL SCORE</span>
                <span className="font-bold text-yellow-400 text-lg">{score}</span>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div>
                <span className="text-neutral-400 text-xs block">BEST SCORE</span>
                <span className="font-bold text-emerald-400 text-lg">{Math.max(score, highScore)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={restartGame}
              className="mt-2 bg-[#8B1812] hover:bg-[#a11c15] text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="size-3.5" /> Retry (Press Space)
            </button>
          </div>
        )}
      </div>

      {/* Controls Footer */}
      <div className="bg-[#231f20] px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="hidden sm:inline">Controls: [SPACE] or [UP ARROW] to Jump • Double Jump available</span>
        <button
          type="button"
          onClick={jump}
          className="sm:hidden w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 rounded-md text-xs uppercase tracking-wider"
        >
          Tap Here To Jump
        </button>
        <span className="hidden sm:inline text-neutral-500">The Lightning Lab Offline Arcade</span>
      </div>
    </div>
  );
}
