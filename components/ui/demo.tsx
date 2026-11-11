"use client";

import * as React from "react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SunMoonThemeToggle } from "@/components/ui/sun-moon-theme-toggle";
import { Lightfall } from "@/components/ui/Lightfall";

export function DemoLightfall() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl bg-slate-900">
      <Lightfall
        colors={["#ffffff", "#38bdf8", "#818cf8"]}
        backgroundColor="#94a3b8"
        speed={0.3}
        streakCount={2}
        streakWidth={0.8}
        twinkle={0.3}
        backgroundGlow={0.1}
        headGlow={0.6}
        bloom={0.35}
        mouseInteraction
        holdToWarp
        intro
      />
    </div>
  );
}

export function DemoBackgroundPaths() {
  return <BackgroundPaths title="Background Paths" />;
}

export function DemoSunMoonThemeToggle() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-5 bg-background p-6">
      <SunMoonThemeToggle size={50} duration={1740} sky={true} />
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">The moon sets, the sun rises</p>
        <p className="text-xs text-muted-foreground">Celestial theme toggle</p>
      </div>
    </div>
  );
}

export default DemoSunMoonThemeToggle;
