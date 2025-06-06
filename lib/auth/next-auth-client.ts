"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Hook to get the current session
 * For client components
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return { success: false, error: result.error };
      }

      router.push("/dashboard");
      router.refresh();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
    router.refresh();
  };

  return {
    session,
    user: session?.user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  };
}
