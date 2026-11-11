"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Zap,
  ExternalLink,
  X,
  Key,
} from "lucide-react";
import { saveUserRole } from "@/lib/data/auth-store";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const roleParam = searchParams.get("role");

  // User decides upfront whether they are Student or Teacher
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher">(
    roleParam === "teacher" ? "teacher" : "student"
  );

  useEffect(() => {
    if (roleParam === "teacher" || roleParam === "student") {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  // Credential states
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [facultyEmail, setFacultyEmail] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyCode, setFacultyCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authError) {
      if (authError === "AccountNotFound" || authError === "AccessDenied") {
        setErrorMessage(
          "No registered account found with this email. Please create your account first before signing in."
        );
      } else if (authError === "AccountSuspended") {
        setErrorMessage("Your account is currently inactive. Please contact the department.");
      } else if (authError === "OAuthSignin" || authError === "OAuthCallback" || authError === "Callback") {
        setErrorMessage(
          "Google Sign-In Notice: Please ensure you create an account first, or check your Google redirect settings."
        );
      } else {
        setErrorMessage(`Authentication notice: ${authError}`);
      }
    }
  }, [authError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const email = selectedRole === "teacher" ? facultyEmail : studentEmail;
    const password = selectedRole === "teacher" ? facultyPassword : studentPassword;
    const normalized = email.toLowerCase().trim();

    const BLOCKED_PLACEHOLDERS = [
      "example@anits.edu.in",
      "student@anits.edu.in",
      "test@anits.edu.in",
      "dummy@anits.edu.in",
      "sample@anits.edu.in",
    ];

    if (BLOCKED_PLACEHOLDERS.includes(normalized)) {
      setErrorMessage("example@anits.edu.in is a placeholder and cannot be used to sign in. Please enter your authentic college email.");
      setIsLoading(false);
      return;
    }

    if (selectedRole === "student" && !normalized.endsWith("@anits.edu.in")) {
      setErrorMessage("Student login requires college email ending with @anits.edu.in (e.g., A24126510021@anits.edu.in)");
      setIsLoading(false);
      return;
    }

    if (selectedRole === "teacher" && !facultyCode.trim()) {
      setErrorMessage("Faculty Authorization Code is required for Faculty Sign In.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        facultyCode: selectedRole === "teacher" ? facultyCode.trim() : "",
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(
          res.error === "CredentialsSignin"
            ? "Invalid credentials or authorization code. Please verify your details."
            : res.error
        );
        setIsLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const actualRole = session?.user?.role || selectedRole;

      saveUserRole(actualRole);

      if (actualRole === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/student");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Authentication service unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (selectedRole === "teacher" && !facultyCode.trim()) {
        setErrorMessage("Please enter your Department Faculty Code below before initiating Faculty Sign-In.");
        return;
      }
      setIsGoogleLoading(true);
      setErrorMessage("");
      await signIn("google", {
        callbackUrl: selectedRole === "teacher" ? "/teacher" : "/student",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to initiate Google Sign-In.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Theme Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold">
          <span>Software Engineering Subject Portal</span>
        </div>
        <ThemeToggle size={34} />
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
          Institutional Sign In
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
          Select your academic persona to enter your syllabus workspace
        </p>
      </div>

      {/* Authentication Notice Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 space-y-1">
            <span className="font-bold block">Sign In Notice</span>
            <span className="leading-relaxed block">{errorMessage}</span>
            {errorMessage.includes("create your account first") && (
              <div className="pt-1.5">
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm transition"
                >
                  <span>Create Account First</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              if (authError) {
                router.replace("/login");
              }
            }}
            className="text-amber-700 dark:text-amber-400 hover:opacity-80 p-1"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider text-center font-mono">
          Select Your Academic Role
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Student Selection Card */}
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${selectedRole === "student"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm ring-2 ring-neutral-900/10 dark:ring-white/10"
                : "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === "student"
                    ? "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                  }`}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              {selectedRole === "student" && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white font-mono">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold">Student Portal</div>
              <div className="text-[10px] opacity-70 line-clamp-1">Syllabus & 6-Mark Q&As</div>
            </div>
          </button>

          {/* Teacher Selection Card */}
          <button
            type="button"
            onClick={() => setSelectedRole("teacher")}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${selectedRole === "teacher"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-600/20"
                : "bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === "teacher"
                    ? "bg-amber-700 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500"
                  }`}
              >
                <FileCheck className="w-4 h-4" />
              </div>
              {selectedRole === "teacher" && (
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white text-amber-700 font-mono">
                  Active
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold">Faculty Studio</div>
              <div className="text-[10px] opacity-70 line-clamp-1">Materials & Notices</div>
            </div>
          </button>
        </div>
      </div>

      {/* SINGLE GOOGLE SIGN IN OPTION */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 font-bold text-xs flex items-center justify-center space-x-2.5 transition shadow-sm hover:shadow disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {isGoogleLoading
              ? "Connecting to Google..."
              : `Sign In with Google (@anits.edu.in)`}
          </span>
        </button>

        <div className="relative flex items-center justify-center pt-1">
          <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
          <span className="bg-white dark:bg-neutral-900 px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider relative font-mono">
            Or college credentials
          </span>
        </div>
      </div>

      {/* STUDENT SIGN IN FORM */}
      {selectedRole === "student" && (
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Student Institutional Email (@anits.edu.in)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@anits.edu.in"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Student Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:underline inline-flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-50 text-white dark:text-neutral-900 font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Student Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* TEACHER SIGN IN FORM */}
      {selectedRole === "teacher" && (
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Faculty Institutional Email (@anits.edu.in)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                placeholder="faculty@anits.edu.in"
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Faculty Portal Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? "Hide" : "Show"}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={facultyPassword}
                onChange={(e) => setFacultyPassword(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Department Faculty Code Input */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Department Faculty Code</span>
              </label>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                Required
              </span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-amber-600 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="password"
                required
                value={facultyCode}
                onChange={(e) => setFacultyCode(e.target.value)}
                placeholder="Enter Department Faculty Code"
                className="w-full bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-700/60 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-wider"
              />
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
              Only faculty members with the matching code can access Faculty Studio.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Faculty Studio"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Footer link to register */}
      <div className="text-center text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        New to the Software Engineering Platform?{" "}
        <Link
          href="/register"
          className="text-neutral-900 dark:text-white font-bold hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-400">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
