"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  FileCheck,
  Key,
  Hash,
  Camera,
  Layers,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const urlError = searchParams.get("error");
  const emailParam = searchParams.get("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("III/IV B.Tech");
  const [section, setSection] = useState("Section A");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [facultyCode, setFacultyCode] = useState("");
  const [role, setRole] = useState<"student" | "teacher">(
    roleParam === "teacher" ? "teacher" : "student"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    urlError === "AccountNotFound"
      ? "No account found with this email. Please fill in your student / faculty details below to create your account first."
      : ""
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (roleParam === "teacher" || roleParam === "student") {
      setRole(roleParam);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [roleParam, emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const normalizedEmail = email.toLowerCase().trim();

    const BLOCKED_PLACEHOLDERS = [
      "example@anits.edu.in",
      "student@anits.edu.in",
      "test@anits.edu.in",
      "dummy@anits.edu.in",
      "sample@anits.edu.in",
    ];

    if (BLOCKED_PLACEHOLDERS.includes(normalizedEmail)) {
      setErrorMsg("example@anits.edu.in is a placeholder and cannot be used. Please enter your authentic ANITS college email address.");
      setIsSubmitting(false);
      return;
    }

    if (role === "student") {
      if (!normalizedEmail.endsWith("@anits.edu.in")) {
        setErrorMsg("Student registration requires an official college email ending with @anits.edu.in (e.g., A24126510021@anits.edu.in)");
        setIsSubmitting(false);
        return;
      }

      if (!rollNumber.trim()) {
        setErrorMsg("Roll Number is required for students (e.g., A24126510021).");
        setIsSubmitting(false);
        return;
      }
    }

    if (role === "teacher" && !facultyCode.trim()) {
      setErrorMsg("Faculty Authorization Code is mandatory for teacher registration.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password,
          role,
          rollNumber: role === "student" ? rollNumber.trim().toUpperCase() : undefined,
          className: role === "student" ? className.trim() : undefined,
          section: role === "student" ? section.trim() : undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          facultyCode: role === "teacher" ? facultyCode.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Registration failed. Please check your details.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMsg("Registration service temporarily unavailable. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold">
          <span>ANITS Institutional Portal</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Department of Computer Science & Engineering • ANITS
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Registration Successful
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
            Your {role === "teacher" ? "Faculty" : "Student"} profile is active. You can now sign in with your @anits.edu.in account.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold transition shadow-sm"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* SINGLE GOOGLE SIGN UP OPTION */}
          <button
            type="button"
            onClick={() =>
              signIn("google", {
                callbackUrl: role === "teacher" ? "/teacher" : "/student",
              })
            }
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center space-x-2.5 transition shadow-sm hover:shadow"
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
            <span>Sign Up with Google (@anits.edu.in)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
            <span className="bg-white dark:bg-neutral-900 px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider relative font-mono">
              Or fill student / faculty details
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-800 dark:text-rose-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Role Selector Cards */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 font-mono uppercase text-[10px] tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === "student"
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm ring-2 ring-neutral-900/10 dark:ring-white/10"
                      : "bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-bold text-xs">ANITS Student</span>
                  </div>
                  <span className="text-[10px] opacity-70 block mt-0.5">Syllabus, Q&As & Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("teacher")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    role === "teacher"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-600/20"
                      : "bg-neutral-50 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCheck className="w-4 h-4" />
                    <span className="font-bold text-xs">Faculty</span>
                  </div>
                  <span className="text-[10px] opacity-70 block mt-0.5">Course Governance</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>
            </div>

            {/* STUDENT SPECIFIC: Roll Number */}
            {role === "student" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    ANITS College Roll Number
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">Format: A24126510021</span>
                </div>
                <div className="relative">
                  <Hash className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="A24126510021"
                    maxLength={14}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                  />
                </div>
              </div>
            )}

            {/* Institutional Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {role === "student" ? "College Email (@anits.edu.in)" : "Faculty Email"}
                </label>
                {role === "student" && (
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    Must end with @anits.edu.in
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "student" ? "A24126510021@anits.edu.in" : "faculty@anits.edu.in"}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>
            </div>

            {/* STUDENT SPECIFIC: Class & Section */}
            {role === "student" && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Class / Year
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-xs"
                  >
                    <option value="II/IV B.Tech">II/IV B.Tech</option>
                    <option value="III/IV B.Tech">III/IV B.Tech</option>
                    <option value="IV/IV B.Tech">IV/IV B.Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 text-xs"
                  >
                    <option value="Section A">Section A</option>
                    <option value="Section B">Section B</option>
                    <option value="Section C">Section C</option>
                  </select>
                </div>
              </div>
            )}

            {/* Optional Profile Picture URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Profile Picture URL (Optional)
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">Optional</span>
              </div>
              <div className="relative">
                <Camera className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg (or leave empty)"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                />
              </div>
            </div>

            {/* TEACHER SPECIFIC: Faculty Authorization Code */}
            {role === "teacher" && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span>Faculty Authorization Code</span>
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
                  Required to verify your faculty credentials with the department.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 disabled:opacity-50 text-white dark:text-neutral-900 font-bold transition shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>{isSubmitting ? "Creating Account..." : `Complete ${role === "teacher" ? "Faculty" : "Student"} Registration`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <div className="text-center text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        Already registered?{" "}
        <Link
          href="/login"
          className="text-neutral-900 dark:text-white font-bold hover:underline"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-neutral-500">
          Loading registration portal...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
