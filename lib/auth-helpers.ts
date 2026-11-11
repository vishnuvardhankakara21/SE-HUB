import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Get the current server-side auth session.
 * Returns the session or null if not authenticated.
 */
export async function getServerAuthSession() {
  return getServerSession(authOptions);
}

/**
 * Require authentication. Returns the session if authenticated,
 * or null if not (caller should handle the redirect/error).
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

/**
 * Require a specific role. Returns the session if the user has the
 * matching role, or null otherwise.
 */
export async function requireRole(role: "student" | "teacher") {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== role) {
    return null;
  }
  return session;
}
