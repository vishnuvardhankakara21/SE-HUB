"use client";

import React from "react";
import { SunMoonThemeToggle } from "@/components/ui/sun-moon-theme-toggle";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export function ThemeToggle({ className = "", size = 38 }: ThemeToggleProps) {
  return (
    <div className={`min-w-[44px] min-h-[44px] flex items-center justify-center ${className}`}>
      <SunMoonThemeToggle
        size={size}
        storageKey="se_platform_theme"
        syncDocument={true}
        duration={1200}
        sky={true}
      />
    </div>
  );
}

export default ThemeToggle;
