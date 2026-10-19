"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap, RotateCcw, Volume2, VolumeX, Trophy, Play } from "lucide-react";

export function VoltRunner({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(197);
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
      setHighScore(parseInt(saved, 10) || 197);
    }
  }, []);

  const stateRef = useRef({
    gameState: "start" as "start" | "playing" | "gameover",
    score: 0,
    speed: 6.0,
    frame: 0,
    spark: {
      x: 80,
      y: 222,
      width: 28,
      height: 38,
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
    groundY: 260,
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
      st.spark.vy = -11.0;
      st.spark.isGrounded = false;
      st.spark.jumpsLeft -= 1;
      playBeep(st.spark.jumpsLeft === 1 ? 540 : 800, "sine", 0.12);

      // Spawn bright electrical jump sparks
      for (let i = 0; i < 10; i++) {
        st.particles.push({
          x: st.spark.x + st.spark.width / 2,
          y: st.spark.y + st.spark.height,
          vx: (Math.random() - 0.5) * 8,
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
    st.speed = 6.0;
    st.frame = 0;
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
      st.frame += 1;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Dark background
      ctx.fillStyle = "#120f12";
      ctx.fillRect(0, 0, width, height);

      // 2. Perspective & Circuit Grid Lines
      ctx.strokeStyle = "#241a20";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Electric Lightning Lines in Background ("Bijli ki lines")
      // Animated electrical surges crackling across the horizon
      ctx.save();
      const surgeAlpha = 0.35 + Math.sin(st.frame * 0.1) * 0.2;
      ctx.strokeStyle = `rgba(239, 68, 68, ${surgeAlpha})`;
      ctx.shadowColor = "#dc2626";
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let lx = 0;
      let ly = st.groundY - 35;
      ctx.moveTo(lx, ly);
      while (lx < width) {
        lx += Math.random() * 30 + 15;
        // Jitter lightning path
        ly = st.groundY - 35 + (Math.sin(st.frame * 0.05 + lx * 0.02) * 12) + ((st.frame % 4 === 0) ? (Math.random() - 0.5) * 8 : 0);
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();

      // Occasional high-voltage second crackle
      if (st.frame % 12 < 4) {
        ctx.strokeStyle = "rgba(250, 204, 21, 0.75)";
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let cx = 0;
        let cy = st.groundY - 70;
        ctx.moveTo(cx, cy);
        while (cx < width) {
          cx += Math.random() * 40 + 20;
          cy = st.groundY - 70 + (Math.random() - 0.5) * 18;
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 4. Ground Trace Line (Glowing Circuit Bus)
      ctx.shadowColor = "#dc2626";
      ctx.shadowBlur = 12;
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, st.groundY);
      ctx.lineTo(width, st.groundY);
      ctx.stroke();

      // Lower ground shading
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#0c0a0c";
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
          if (!st.spark.isGrounded) {
            // Landed sound & contact sparks
            playBeep(260, "square", 0.05);
            for (let i = 0; i < 4; i++) {
              st.particles.push({
                x: st.spark.x + st.spark.width / 2,
                y: st.groundY,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 2,
                life: 1,
                maxLife: 12,
                color: "#facc15",
              });
            }
          }
          st.spark.isGrounded = true;
          st.spark.jumpsLeft = 2;
        }

        // Continuous running sparks when grounded
        if (st.spark.isGrounded && Math.random() < 0.45) {
          st.particles.push({
            x: st.spark.x + Math.random() * 10,
            y: st.groundY,
            vx: -st.speed * 0.8 - Math.random() * 2,
            vy: -Math.random() * 2,
            life: 1,
            maxLife: 15,
            color: Math.random() > 0.4 ? "#facc15" : "#ef4444",
          });
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

            // Explosive short-circuit burst particles
            for (let k = 0; k < 25; k++) {
              st.particles.push({
                x: st.spark.x + st.spark.width / 2,
                y: st.spark.y + st.spark.height / 2,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                life: 1,
                maxLife: 30 + Math.random() * 15,
                color: ["#ef4444", "#facc15", "#ffffff", "#38bdf8"][Math.floor(Math.random() * 4)],
              });
            }

            const currentScore = Math.floor(st.score / 5);
            if (currentScore > highScore) {
              setHighScore(currentScore);
              localStorage.setItem("volt_runner_high_score", currentScore.toString());
            }
            break;
          }

          if (obs.x + obs.width < -10) {
            st.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Obstacles (Commercial Electrical Components)
      for (const obs of st.obstacles) {
        ctx.save();
        if (obs.type === "resistor") {
          // Ceramic Power Resistor
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#d97706";
          ctx.fillRect(obs.x, obs.y + 4, obs.width, obs.height - 8);

          // Metal terminals
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(obs.x - 3, obs.y + obs.height / 2 - 2, 4, 4);
          ctx.fillRect(obs.x + obs.width - 1, obs.y + obs.height / 2 - 2, 4, 4);

          // Color bands
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(obs.x + 6, obs.y + 4, 3, obs.height - 8);
          ctx.fillStyle = "#eab308";
          ctx.fillRect(obs.x + 13, obs.y + 4, 3, obs.height - 8);
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(obs.x + 20, obs.y + 4, 3, obs.height - 8);
        } else if (obs.type === "capacitor") {
          // Electrolytic Cylinder Capacitor
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 4);
          ctx.fill();

          // Cathode stripe
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(obs.x + 2, obs.y, 4, obs.height);
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(obs.x + 3, obs.y + 6, 2, 2);
          ctx.fillRect(obs.x + 3, obs.y + 14, 2, 2);
        } else {
          // Glass Cartridge Fuse
          ctx.shadowColor = "#ef4444";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.fillRect(obs.x + 2, obs.y, obs.width - 4, obs.height);

          // Chrome caps
          ctx.fillStyle = "#cbd5e1";
          ctx.fillRect(obs.x, obs.y, obs.width, 4);
          ctx.fillRect(obs.x, obs.y + obs.height - 4, obs.width, 4);

          // Internal filament line
          ctx.strokeStyle = "#facc15";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y + 4);
          ctx.lineTo(obs.x + obs.width / 2 + 2, obs.y + obs.height / 2);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height - 4);
          ctx.stroke();
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

      // Draw Spark Runner Character (Electric Lightning Bolt Symbol)
      if (st.gameState !== "gameover") {
        ctx.save();

        const sx = st.spark.x;
        const sy = st.spark.y;

        // Dynamic electric aura around spark
        ctx.shadowColor = st.spark.jumpsLeft === 1 ? "#38bdf8" : "#f59e0b";
        ctx.shadowBlur = 18;

        // Outer vibrant lightning bolt polygon
        ctx.fillStyle = st.spark.jumpsLeft === 1 ? "#38bdf8" : "#facc15";
        ctx.beginPath();
        ctx.moveTo(sx + 18, sy);
        ctx.lineTo(sx + 2, sy + 18);
        ctx.lineTo(sx + 14, sy + 18);
        ctx.lineTo(sx + 6, sy + 38);
        ctx.lineTo(sx + 28, sy + 15);
        ctx.lineTo(sx + 15, sy + 15);
        ctx.closePath();
        ctx.fill();

        // High-voltage bright white hot interior core
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(sx + 18, sy + 5);
        ctx.lineTo(sx + 8, sy + 17);
        ctx.lineTo(sx + 15, sy + 17);
        ctx.lineTo(sx + 11, sy + 30);
        ctx.lineTo(sx + 22, sy + 16);
        ctx.lineTo(sx + 15, sy + 16);
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
    <div className={`w-full max-w-3xl mx-auto bg-[#131114] border-2 border-red-600/70 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.35)] relative select-none ${className}`}>
      {/* Game Cabinet Header */}
      <div className="bg-[#1c181b] px-4 py-2.5 border-b border-neutral-800/80 text-white flex flex-col items-center justify-center relative">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-neutral-200">
          <Zap className="size-3.5 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span>VOLT RUNNER • 404 CIRCUIT</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono text-neutral-400 mt-0.5">
          <div>
            <span>SCORE: </span>
            <span className="font-bold text-yellow-400">{score}</span>
          </div>
          <div>
            <span>HIGH SCORE: </span>
            <span className="font-bold text-neutral-200">{highScore}</span>
          </div>
        </div>

        {/* Sound toggle at top right */}
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
          title={soundEnabled ? "Mute Game Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5 text-red-400" />}
        </button>
      </div>

      {/* Canvas Area with Touch Action None to prevent gesture interference */}
      <div
        className="relative cursor-pointer touch-none bg-[#131114]"
        onClick={jump}
        onTouchStart={(e) => {
          e.preventDefault();
          jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={760}
          height={320}
          className="w-full h-auto max-h-[38vh] sm:max-h-[58vh] block"
        />

        {/* Start Overlay: Centered with Spark Theme */}
        {gameState === "start" && (
          <div className="absolute inset-0 bg-[#0d0b0d]/80 backdrop-blur-2xs flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-2.5 sm:space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xs">
              <Zap className="size-3 fill-amber-400 text-amber-400" />
              <span>Interactive 404 Mini-Game</span>
            </div>

            <h3 className="text-lg sm:text-3xl font-black text-white uppercase tracking-tight">
              Reconnect The Power Grid
            </h3>

            <p className="text-[11px] sm:text-xs text-neutral-300 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
              Jump over high-voltage resistors and blown capacitors. Double-jump in mid-air to clear wide gaps!
            </p>

            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onTouchStart={(e) => {
                  e.preventDefault();
                  startGame();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  startGame();
                }}
                className="bg-[#8B1812] hover:bg-[#a11c15] text-white font-black text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-red-950/70 border border-red-500/40 inline-flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="size-3.5 fill-white" />
                <span className="sm:hidden">Tap To Play</span>
                <span className="hidden sm:inline">Press Space or Click to Jump</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 space-y-3">
            <span className="text-red-500 text-[10px] sm:text-xs font-black uppercase tracking-widest">
              CIRCUIT SHORT-CIRCUITED!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">Game Over</h3>
            <div className="flex items-center gap-4 text-xs sm:text-sm font-mono text-white">
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-xs block">FINAL SCORE</span>
                <span className="font-bold text-yellow-400 text-base sm:text-lg">{score}</span>
              </div>
              <div className="w-px h-6 sm:h-8 bg-neutral-700" />
              <div>
                <span className="text-neutral-400 text-[10px] sm:text-xs block">BEST SCORE</span>
                <span className="font-bold text-emerald-400 text-base sm:text-lg">{Math.max(score, highScore)}</span>
              </div>
            </div>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                restartGame();
              }}
              onClick={(e) => {
                e.preventDefault();
                restartGame();
              }}
              className="mt-2 bg-[#8B1812] hover:bg-[#a11c15] text-white font-black text-xs uppercase tracking-wider px-5 sm:px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span className="sm:hidden">Tap to Retry</span>
              <span className="hidden sm:inline">Retry (Press Space)</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dedicated Thumb Jump Button */}
      <div className="sm:hidden p-2.5 bg-[#181417] border-t border-neutral-800">
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          onClick={(e) => {
            e.preventDefault();
            jump();
          }}
          className="w-full bg-[#8B1812] active:bg-[#a11c15] text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/80 border border-red-500/40 select-none active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="size-4 fill-yellow-400 text-yellow-400 animate-pulse" />
          <span>TAP TO JUMP (DOUBLE JUMP READY)</span>
        </button>
      </div>

      {/* Controls Footer */}
      <div className="bg-[#181417] px-3 sm:px-4 py-2 border-t border-neutral-800/80 text-center text-[10px] sm:text-[11px] text-neutral-400 font-mono">
        <span className="hidden sm:inline">Controls: [SPACE] or [UP ARROW] to Jump • Double Jump Available</span>
        <span className="sm:hidden text-amber-400/90 font-bold">Tap Screen Anywhere or Use Jump Button Above</span>
      </div>
    </div>
  );
}
