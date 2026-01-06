"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AuthContext, type AuthContextType } from "@/hooks/useAuth";
import type { User, Session } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabaseConfigured = isSupabaseConfigured();
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    [supabaseConfigured]
  );

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in with magic link
  const signInWithEmail = useCallback(
    async (email: string) => {
      if (!supabase) {
        return { error: new Error("Authentication is not configured") };
      }

      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          return { error: new Error(error.message) };
        }

        return { error: null };
      } catch (error) {
        return {
          error:
            error instanceof Error ? error : new Error("Failed to send email"),
        };
      }
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [supabase]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!supabase) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [supabase]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      signInWithEmail,
      signOut,
      refreshSession,
    }),
    [user, session, isLoading, signInWithEmail, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
