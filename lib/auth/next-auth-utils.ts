import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get the current user from the session
 * For server components
 */
export async function getUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }
  
  const userId = parseInt(session.user.id);
  
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
    
  return user || null;
}

/**
 * Check if the current user is authenticated
 * For server components
 */
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Get the current user ID from the session
 * For server components
 */
export async function getUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? parseInt(session.user.id) : null;
}