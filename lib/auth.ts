import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export function isInstitutionalEduEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return normalized.endsWith("@anits.edu.in");
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      facultyCode: { label: "Faculty Code", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email and password are required");
      }

      await connectToDatabase();

      const normalizedEmail = credentials.email.toLowerCase().trim();
      const BLOCKED_PLACEHOLDERS = [
        "example@anits.edu.in",
        "student@anits.edu.in",
        "test@anits.edu.in",
        "dummy@anits.edu.in",
        "sample@anits.edu.in",
      ];

      if (BLOCKED_PLACEHOLDERS.includes(normalizedEmail)) {
        throw new Error("example@anits.edu.in is a placeholder and cannot be used. Please use your authentic college email.");
      }

      const expectedFacultyCode = process.env.FACULTY_CODE || process.env.TEACHER_INVITE_CODE || "FACULTY2026";

      // One-click demo sign-in simulation for instant testing
      if (credentials.password === "DEMO_GOOGLE_OAUTH_SIMULATION") {
        const isTeacher = credentials.email.includes("faculty") || credentials.email.includes("teacher");
        if (isTeacher) {
          if (!credentials.facultyCode || credentials.facultyCode.trim() !== expectedFacultyCode) {
            throw new Error("Invalid Faculty Authorization Code. Faculty access is restricted to verified departmental code holders.");
          }
        }

        let demoUser = await User.findOne({ email: credentials.email.toLowerCase().trim() });
        if (!demoUser) {
          demoUser = await User.create({
            name: isTeacher ? "Faculty Instructor" : "Student",
            email: credentials.email.toLowerCase().trim(),
            role: isTeacher ? "teacher" : "student",
            status: "active",
            rollNumber: isTeacher ? undefined : "A24126510021",
            className: isTeacher ? undefined : "III/IV B.Tech",
            section: isTeacher ? undefined : "Section A",
            avatarUrl: "https://lh3.googleusercontent.com/a/default-user",
            xp: 0,
            streak: { current: 0, longest: 0 },
          });
        }
        return {
          id: demoUser._id.toString(),
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          rollNumber: demoUser.rollNumber,
          className: demoUser.className,
          section: demoUser.section,
        };
      }

      const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });

      if (!user) {
        throw new Error("No registered account found with this email. Please create an account first.");
      }

      // Check student college email domain constraint
      if (user.role === "student" && !user.email.toLowerCase().endsWith("@anits.edu.in")) {
        throw new Error("Student login requires college email ending with @anits.edu.in.");
      }

      // Strict Faculty Code verification: Only faculty with matching code can log in
      if (user.role === "teacher") {
        if (!credentials.facultyCode || credentials.facultyCode.trim() !== expectedFacultyCode) {
          throw new Error("Invalid Faculty Authorization Code. Faculty login is restricted to verified departmental code holders.");
        }
      }

      if (!user.passwordHash) {
        throw new Error("This account was registered through social login. Please sign in with Google.");
      }

      const isValid = await compare(credentials.password, user.passwordHash);
      if (!isValid) {
        throw new Error("Invalid email or password");
      }

      if (user.status !== "active") {
        throw new Error("Your account is not active. Please contact the department head.");
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        className: user.className,
        section: user.section,
      };
    },
  }),
];

// Register Google OAuth Provider
providers.push(
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    allowDangerousEmailAccountLinking: true,
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "se_learning_platform_super_secret_key_change_in_production_2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();

        const email = user.email?.toLowerCase().trim() || "";
        const existingUser = await User.findOne({ email });

        // REQUIRE REGISTRATION FIRST: If user is not already registered in MongoDB, redirect to /register
        if (!existingUser) {
          return `/register?error=AccountNotFound&email=${encodeURIComponent(email)}`;
        }

        if (existingUser.status !== "active") {
          return `/login?error=AccountSuspended`;
        }

        // Attach existing user data so the jwt callback can use it
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.name = existingUser.name;
        user.rollNumber = existingUser.rollNumber;
        user.className = existingUser.className;
        user.section = existingUser.section;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rollNumber = user.rollNumber;
        token.className = user.className;
        token.section = user.section;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.rollNumber = token.rollNumber;
        session.user.className = token.className;
        session.user.section = token.section;
      }
      return session;
    },
  },
};
