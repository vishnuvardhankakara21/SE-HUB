import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import AcidSquares from "@/components/ui/AcidSquares";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-4 overflow-hidden bg-[#120f17]">
      {/* Animated AcidSquares WebGL Background from React Bits */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <AcidSquares
          color="#120f17"
          accentColor="#ff4fb8"
          secondaryColor="#3b6bff"
          tileSize={1}
          gap={0.12}
          roundness={0.25}
          rotation={35}
          waves={1}
          pulse={1}
          lighting="split"
          tilt={0.7}
          grain={0.12}
          intro={true}
          mouseInteraction={true}
          pulseOnClick={true}
          opacity={0.9}
        />
      </div>

      {/* Atmospheric vignette overlay */}
      <div className="fixed inset-0 z-0 bg-radial-gradient from-transparent via-[#120f17]/20 to-[#120f17]/70 pointer-events-none" />

      {/* Header and Auth Form */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white drop-shadow-md">
              Software Engineering Portal
            </span>
          </Link>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}

