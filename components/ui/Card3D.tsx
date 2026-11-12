"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  maxTilt?: number; // max tilt degrees (default: 8)
  canvasEffect?: boolean; // dynamic canvas spotlight & aura (default: true)
  glowColor?: string; // RGB values for spotlight, default: "16, 185, 129" (emerald)
  depth?: number; // translateZ for inner content in px (default: 16)
}

export function Card3D({
  children,
  className = "",
  containerClassName = "",
  maxTilt = 8,
  canvasEffect = true,
  glowColor = "16, 185, 129", // emerald
  depth = 16,
  style,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const animFrameRef = useRef<number | null>(null);

  // Canvas drawing loop for dynamic specular sheen & aura
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (isHovered && mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
      // Lerp mouse coordinates
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.2;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.2;

      const px = mousePosRef.current.x;
      const py = mousePosRef.current.y;
      const radius = Math.max(width, height) * 0.75;

      // Radial spotlight glare
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, radius);
      gradient.addColorStop(0, `rgba(${glowColor}, 0.18)`);
      gradient.addColorStop(0.35, `rgba(${glowColor}, 0.08)`);
      gradient.addColorStop(0.7, `rgba(${glowColor}, 0.02)`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Subtle specular rim highlight
      const specular = ctx.createRadialGradient(px, py, 0, px, py, 80);
      specular.addColorStop(0, "rgba(255, 255, 255, 0.22)");
      specular.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = specular;
      ctx.fillRect(0, 0, width, height);

      animFrameRef.current = requestAnimationFrame(renderCanvas);
    }
  }, [isHovered, glowColor]);

  // Sync canvas size with bounding box
  useEffect(() => {
    if (!canvasEffect) return;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const rect = card.getBoundingClientRect();
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [canvasEffect]);

  useEffect(() => {
    if (isHovered && canvasEffect) {
      animFrameRef.current = requestAnimationFrame(renderCanvas);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovered, canvasEffect, renderCanvas]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current.targetX = x;
    mousePosRef.current.targetY = y;
    if (mousePosRef.current.x < 0) {
      mousePosRef.current.x = x;
      mousePosRef.current.y = y;
    }

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    mousePosRef.current = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  };

  return (
    <div
      className={cn("perspective-1000 inline-block w-full", containerClassName)}
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden transition-all duration-200 ease-out preserve-3d will-change-transform",
          isHovered ? "shadow-2xl ring-1 ring-emerald-500/20" : "shadow-sm",
          className
        )}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered
            ? "transform 0.1s ease-out, box-shadow 0.2s ease-out"
            : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease-out",
          transformStyle: "preserve-3d",
          ...style,
        }}
        {...props}
      >
        {/* Dynamic Canvas Glare & Aura Layer */}
        {canvasEffect && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10 w-full h-full rounded-[inherit] transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        )}

        {/* 3D Depth Content Layer */}
        <div
          className="relative z-20 w-full h-full preserve-3d"
          style={{
            transform: isHovered ? `translateZ(${depth}px)` : "translateZ(0px)",
            transition: isHovered ? "transform 0.15s ease-out" : "transform 0.4s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default Card3D;
