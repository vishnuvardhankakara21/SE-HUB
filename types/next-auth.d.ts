import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "teacher";
      rollNumber?: string;
      className?: string;
      section?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "student" | "teacher";
    rollNumber?: string;
    className?: string;
    section?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "student" | "teacher";
    rollNumber?: string;
    className?: string;
    section?: string;
  }
}
