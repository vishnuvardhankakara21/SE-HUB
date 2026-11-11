import { useEffect, useRef } from "react";

export interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number;
}

export function useSpotlightEffect(config: SpotlightConfig = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    radius = 200,
    brightness = 0.15,
    color = "#ffffff",
    smoothing = 0.1,
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isVisible = false;

    const parseColorToRgba = (colorStr: string, alpha: number) => {
      if (colorStr.startsWith("#")) {
        let hex = colorStr.slice(1);
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((c) => c + c)
            .join("");
        }
        const num = parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      if (colorStr.startsWith("rgb")) {
        const parts = colorStr.match(/\d+/g);
        if (parts && parts.length >= 3) {
          return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
        }
      }
      return `rgba(255, 255, 255, ${alpha})`;
    };

    const handleResize = () => {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        currentX = mouseX;
        currentY = mouseY;
        isVisible = true;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const render = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (isVisible) {
        currentX += (mouseX - currentX) * smoothing;
        currentY += (mouseY - currentY) * smoothing;

        const rad = Math.max(10, radius);
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          rad
        );

        gradient.addColorStop(0, parseColorToRgba(color, brightness));
        gradient.addColorStop(0.4, parseColorToRgba(color, brightness * 0.5));
        gradient.addColorStop(1, parseColorToRgba(color, 0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [radius, brightness, color, smoothing]);

  return canvasRef;
}

export default useSpotlightEffect;

