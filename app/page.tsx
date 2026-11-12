"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  PenTool,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Compass,
  Cpu,
  FileCheck,
  Mail,
  Github,
} from "lucide-react";
import ShapeGrid from "@/components/ui/ShapeGrid";
import { Card3D } from "@/components/ui/Card3D";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Ensure WebGL Canvas re-awakens on client-side route return
    const resizeTimer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
    };
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Five-Unit Complete Curriculum",
      desc: "Comprehensive college syllabus covering classical SDLC, Process Models, SRS, IEEE 830, Cohesion/Coupling, and COCOMO.",
      badge: "60 Periods",
    },
    {
      icon: GraduationCap,
      title: "79 Verified Exam Q&As",
      desc: "Exact university 6-mark standard model solutions featuring architectural diagrams, step-by-step proofs, and marking schemes.",
      badge: "Exam Bank",
    },
    {
      icon: ImageIcon,
      title: "16 Reference System Architectures",
      desc: "Detailed Activity, Statechart, Component, and Deployment diagrams for Library, LMS, Banking, and University portals.",
      badge: "16 Diagrams",
    },
    {
      icon: PenTool,
      title: "Embedded Diagram Studio",
      desc: "Full-screen diagrams.net (draw.io) workspace with built-in UML Class, Sequence, DFD, and Component stencils.",
      badge: "draw.io Integration",
    },
    {
      icon: CheckCircle2,
      title: "Self-Assessment Engine",
      desc: "Unit-wise MCQs with server-side validation, instant technical explanations, and gamified mastery telemetry.",
      badge: "Instant Grading",
    },
    {
      icon: ShieldCheck,
      title: "Dual-Role Institutional Governance",
      desc: "Strictly isolated Student and Faculty portals with cryptographic credential verification and course resource vaults.",
      badge: "Role Security",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col justify-between selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      {/* Top Navigation */}
      <header className="h-16 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm shadow-sm">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Software Engineering
            </span>
            <span className="block text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
              B.Tech Academic Platform
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle size={36} />
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
          >
            Sign In
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 transition shadow-sm"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content with Lightfall Canvas Background */}
      <main className="flex-1">
        {/* Dynamic ShapeGrid Interactive Hero Section */}
        <section className="relative min-h-[660px] md:min-h-[720px] flex items-center justify-center overflow-hidden border-b border-neutral-200/80 dark:border-neutral-800/80">
          {/* React Bits ShapeGrid Canvas Background */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <ShapeGrid
              key={isDark ? "shapegrid-dark" : "shapegrid-light"}
              shape="square"
              direction="diagonal"
              lineColor={isDark ? "#2a2734" : "#e2e8f0"}
              hoverColor={isDark ? "#10b981" : "#059669"}
              hoverFillColor={isDark ? "#064e3b" : "#d1fae5"}
              fillOpacity={isDark ? 0.22 : 0.28}
              cellSize={40}
              speed={0.45}
              tiltX={0}
              tiltY={0}
              rainbow={false}
              clickCascade={true}
              trail={0.7}
              glow={isDark ? 0.45 : 0.25}
              fade={0.8}
              backgroundColor="transparent"
            />
          </div>

          {/* Vignette Gradients for Text Legibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-white dark:from-neutral-950/30 dark:via-transparent dark:to-neutral-950 z-10" />

          {/* Hero Foreground Content */}
          <div className="relative z-20 pointer-events-none max-w-5xl mx-auto px-6 py-20 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Department of Computer Science & Engineering • Academic Portal</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.08]">
              Software Engineering <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400">
                Interactive Learning Platform
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              An institutional curriculum platform for B.Tech students & faculty. Master SDLC models, university examination solutions, and professional UML architecture with diagrams.net.
            </p>

            {/* Mandatory Authentication Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2 pointer-events-auto">
              <Link href="/login">
                <div className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Button
                    variant="ghost"
                    className="rounded-[1.15rem] px-8 py-5 text-sm sm:text-base font-bold backdrop-blur-md bg-neutral-950 hover:bg-neutral-900 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 transition-all duration-300 border border-neutral-800 dark:border-neutral-200"
                  >
                    <span>Sign In to Access Platform</span>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>

              <Link href="/register">
                <Button
                  variant="outline"
                  className="rounded-2xl px-7 py-5 text-sm sm:text-base font-semibold border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition"
                >
                  <span>Create Institutional Account</span>
                </Button>
              </Link>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                Authentication Required • Student Roll Number or Faculty Credentials
              </span>
            </div>

            {/* Lightfall Warp / Mouse Interaction Instruction */}
            <div className="pt-3">
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-200/50 dark:bg-neutral-900/50 backdrop-blur text-neutral-500 dark:text-neutral-400">
                Hold click to warp light trails • Move cursor to bend streaks
              </span>
            </div>
          </div>
        </section>

        {/* Engineering Curriculum Units Overview Bar */}
        <section className="py-8 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
              {[
                { unit: "Unit I", title: "Process Models & Agile", count: "20 Q&As" },
                { unit: "Unit II", title: "SRS & DFD Modeling", count: "12 Q&As" },
                { unit: "Unit III", title: "4+1 Views & UML", count: "19 Q&As" },
                { unit: "Unit IV", title: "Testing & McCabe V(G)", count: "15 Q&As" },
                { unit: "Unit V", title: "COCOMO & Metrics", count: "13 Q&As" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
                >
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                    {item.unit}
                  </span>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">
                    {item.title}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Institutional Engineering Rigor</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Built for Engineering Academic Excellence
            </h2>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
              Every diagram, formula, theorem, and question adheres strictly to AICTE and university course standards with mathematical precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <Card3D
                key={idx}
                maxTilt={10}
                glowColor="16, 185, 129"
                className="p-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center shadow-inner">
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Card3D>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-neutral-200/80 dark:border-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-950 space-y-2">
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          Developed by <span className="text-emerald-600 dark:text-emerald-400 font-bold">KAKARA VISHNU VARDHAN</span> • Department of Computer Science & Engineering
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 pt-0.5">
          <a
            href="mailto:vishnuvardhankakara21@gmail.com"
            className="inline-flex items-center space-x-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            <span>vishnuvardhankakara21@gmail.com</span>
          </a>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <a
            href="https://github.com/vishnuvardhankakara21"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <Github className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
            <span>github.com/vishnuvardhankakara21</span>
          </a>
        </div>

        <p className="text-[11px] text-neutral-400 pt-1">
          Software Engineering Academic Learning Platform • Department of Computer Science & Engineering • All Academic Architecture & Platform Development Rights Reserved
        </p>
      </footer>
    </div>
  );
}
