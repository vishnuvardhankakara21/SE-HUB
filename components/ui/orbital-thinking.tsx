"use client";

import React, { useEffect, useRef, useState } from "react";

const CANVAS_SIZE = 220;
const ORB_RADIUS = 66;
const TAU = Math.PI * 2;

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RINGS = 16;
const DOT_LIST = (() => {
  const rand = mulberry32(7);
  const out: { x: number; y: number; z: number; u: number; seed: number }[] = [];
  for (let k = 0; k < RINGS; k++) {
    const y = 1 - ((k + 0.5) / RINGS) * 2;
    const r = Math.sqrt(1 - y * y);
    const m = Math.max(4, Math.round(30 * r));
    for (let j = 0; j < m; j++) {
      const a = (j / m) * TAU + k * 0.35;
      out.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, u: (1 - y) / 2, seed: rand() * 6.283 });
    }
  }
  return out;
})();

const N = DOT_LIST.length;
const DX = Float32Array.from(DOT_LIST, (d) => d.x);
const DY = Float32Array.from(DOT_LIST, (d) => d.y);
const DZ = Float32Array.from(DOT_LIST, (d) => d.z);
const DU = Float32Array.from(DOT_LIST, (d) => d.u);
const DS = Float32Array.from(DOT_LIST, (d) => d.seed);

const G_STEPS = 24, A_STEPS = 48;
const COLORS: string[] = (() => {
  const out: string[] = [];
  for (let gi = 0; gi <= G_STEPS; gi++) {
    const g = gi / G_STEPS;
    const r = Math.round(52 + (235 - 52) * (1 - g));
    const gg = Math.round(211 + (235 - 211) * (1 - g));
    const b = Math.round(153 + (235 - 153) * (1 - g));
    for (let ai = 0; ai <= A_STEPS; ai++) {
      out.push(`rgba(${r},${gg},${b},${(ai / A_STEPS).toFixed(3)})`);
    }
  }
  return out;
})();

interface OrbitalThinkingIndicatorProps {
  statusText?: string;
  className?: string;
}

export function OrbitalThinkingIndicator({
  statusText = "Analyzing Software Engineering Syllabus...",
  className = "",
}: OrbitalThinkingIndicatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Thinking & Parsing Query...",
    "Searching 79-Question Exam Bank...",
    "Analyzing Curriculum Unit Standards...",
    "Composing Structured Academic Solution...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1100);
    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(CANVAS_SIZE * dpr);
    canvas.height = Math.round(CANVAS_SIZE * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let time = 0;
    let rot = 0;
    let rafId = 0;
    let last = performance.now();
    const lit = new Float32Array(N);
    const SX = new Float32Array(N), SY = new Float32Array(N), SR = new Float32Array(N), SD = new Float32Array(N);
    const SC = new Int16Array(N);
    const C0 = CANVAS_SIZE / 2;
    const CP = Math.cos(0.35), SP = Math.sin(0.35);

    const frame = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      time += dt;
      rot += 0.9 * dt;

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const yaw = rot;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw);
      const decay = Math.exp(-dt / 0.5);
      const h0 = (time * 300) % N;

      for (let n = 0; n < N; n++) {
        let dd = Math.abs(n - h0);
        if (dd > N - dd) dd = N - dd;
        const v = Math.max(0, 1 - dd / 16);
        const pulse = v * v;
        lit[n] = Math.max(lit[n] * decay, pulse);

        const dx = DX[n], dy = DY[n], dz = DZ[n];
        const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
        const y2 = dy * CP - z1 * SP, z2 = dy * SP + z1 * CP;
        const f = 2.8 / (2.8 - z2), depth = (z2 + 1) / 2;
        const ox = x1 * ORB_RADIUS * f, oy = -y2 * ORB_RADIUS * f;

        const a = Math.min(1, 0.12 + 0.35 * depth * depth + 0.7 * lit[n]);
        SX[n] = C0 + ox;
        SY[n] = C0 + oy;
        SD[n] = depth;
        SR[n] = 1.25 * (0.45 + 0.75 * depth) * f + 0.9 * lit[n];

        const ai = Math.round(a * A_STEPS);
        const gi = Math.round(0.7 * G_STEPS);
        SC[n] = ai <= 0 ? -1 : gi * (A_STEPS + 1) + ai;
      }

      // Two pass render: back half then front half
      for (let pass = 0; pass < 2; pass++) {
        for (let n = 0; n < N; n++) {
          const c = SC[n];
          if (c < 0) continue;
          if ((SD[n] >= 0.5) !== (pass === 1)) continue;
          ctx.fillStyle = COLORS[c];
          ctx.beginPath();
          ctx.arc(SX[n], SY[n], SR[n], 0, TAU);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 my-4 relative ${className}`}>
      {/* Background radial halo */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Orbit Canvas with Glowing Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer glowing particle border */}
        <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-spin" style={{ animationDuration: "12s" }} />
        <div className="absolute inset-5 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
        
        {/* Core Canvas */}
        <canvas
          ref={canvasRef}
          className="relative z-10 pointer-events-none drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          style={{ width: "220px", height: "220px" }}
        />
      </div>

      {/* Dynamic Status Label Badge */}
      <div className="mt-4 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-lg backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>{steps[activeStep] || statusText}</span>
      </div>

      <p className="mt-2 text-[11px] font-mono text-neutral-400">
        Reasoning across 5 curriculum units and official university marking schemes
      </p>
    </div>
  );
}

export default OrbitalThinkingIndicator;

