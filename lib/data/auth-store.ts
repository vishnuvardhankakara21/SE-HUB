"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export type UserRole = "student" | "teacher";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  identifier: string; // Roll number for student, Faculty ID for teacher
  department: string;
  avatarInitials: string;
}

export const STUDENT_PROFILE: UserProfile = {
  id: "u-student-1",
  name: "Student",
  email: "student@anits.edu.in",
  role: "student",
  identifier: "ANITS CSE",
  department: "B.Tech Computer Science & Engineering",
  avatarInitials: "ST",
};

export const TEACHER_PROFILE: UserProfile = {
  id: "u-teacher-1",
  name: "Faculty Member",
  email: "faculty@anits.edu.in",
  role: "teacher",
  identifier: "CSE Faculty",
  department: "Dept. of Computer Science & Engineering",
  avatarInitials: "FA",
};

const AUTH_STORAGE_KEY = "se_platform_active_user_role";

export function getInitialRole(): UserRole {
  if (typeof window === "undefined") return "student";
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored === "teacher" || stored === "student") {
    return stored;
  }
  return "student";
}

export function saveUserRole(role: UserRole) {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, role);
    window.dispatchEvent(new Event("auth_role_changed"));
  }
}

export function clearUserRole() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event("auth_role_changed"));
  }
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [localRole, setLocalRole] = useState<UserRole>("student");
  const isLoaded = status !== "loading";

  useEffect(() => {
    setLocalRole(getInitialRole());

    const handleRoleChange = () => {
      setLocalRole(getInitialRole());
    };

    window.addEventListener("auth_role_changed", handleRoleChange);
    window.addEventListener("storage", handleRoleChange);

    return () => {
      window.removeEventListener("auth_role_changed", handleRoleChange);
      window.removeEventListener("storage", handleRoleChange);
    };
  }, []);

  // Server-side session is the AUTHORITATIVE source of truth.
  // If an active session exists, its role completely overrides any client storage.
  const authoritativeRole: UserRole =
    session?.user?.role === "teacher" || session?.user?.role === "student"
      ? session.user.role
      : localRole;

  const currentProfile: UserProfile = session?.user
    ? {
        id: session.user.id || (authoritativeRole === "teacher" ? "u-teacher-1" : "u-student-1"),
        name: session.user.name || (authoritativeRole === "teacher" ? "Faculty Member" : "Student"),
        email: session.user.email || "",
        role: authoritativeRole,
        identifier: (session.user as any).rollNumber || (authoritativeRole === "teacher" ? "CSE Faculty" : "ANITS Student"),
        department: "Dept. of Computer Science & Engineering",
        avatarInitials: (session.user.name || (authoritativeRole === "teacher" ? "FA" : "ST"))
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((n) => n[0].toUpperCase())
          .join("") || "U",
      }
    : authoritativeRole === "teacher"
    ? TEACHER_PROFILE
    : STUDENT_PROFILE;

  const loginAs = (targetRole: UserRole) => {
    saveUserRole(targetRole);
    setLocalRole(targetRole);
  };

  const logout = async () => {
    clearUserRole();
    setLocalRole("student");
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      // Ignored
    }
  };

  return {
    role: authoritativeRole,
    profile: currentProfile,
    isLoaded,
    isStudent: authoritativeRole === "student",
    isTeacher: authoritativeRole === "teacher",
    loginAs,
    logout,
  };
}
