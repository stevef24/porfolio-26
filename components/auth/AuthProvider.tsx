"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AuthContext, type AuthContextType } from "@/hooks/useAuth";
import { hydrateProgressFromServer } from "@/hooks/useSyncProgress";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasHydratedRef = useRef(false);

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

    function initAuth(): void {
      void supabase.auth
        .getSession()
        .then(({ data: { session: s } }: { data: { session: Session | null } }) => {
          setSession(s);
          setUser(s?.user ?? null);
        })
        .catch((error: Error) => {
          console.error("Error getting auth session:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Hydrate progress from server on sign in
      if (event === "SIGNED_IN" && session?.user && !hasHydratedRef.current) {
        hasHydratedRef.current = true;
        void hydrateProgressFromServer();
      }

      // Reset hydration flag on sign out
      if (event === "SIGNED_OUT") {
        hasHydratedRef.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Sign in with magic link
  const signInWithEmail = useCallback(
    function signInWithEmail(email: string): Promise<{ error: Error | null }> {
      if (!supabase) {
        return Promise.resolve({
          error: new Error("Authentication is not configured"),
        });
      }

      return supabase.auth
        .signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        .then(({ error }: { error: { message: string } | null }) => {
          if (error) {
            return { error: new Error(error.message) };
          }
          return { error: null };
        })
        .catch((error: unknown) => ({
          error: error instanceof Error ? error : new Error("Failed to send email"),
        }));
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(function signOut(): Promise<void> {
    if (!supabase) {
      return Promise.resolve();
    }

    return supabase.auth
      .signOut()
      .then(() => {
        setUser(null);
        setSession(null);
      })
      .catch((error: unknown) => {
        console.error("Error signing out:", error);
      });
  }, [supabase]);

  // Refresh session
  const refreshSession = useCallback(function refreshSession(): Promise<void> {
    if (!supabase) {
      return Promise.resolve();
    }

    return supabase.auth
      .refreshSession()
      .then(({ data: { session: s } }: { data: { session: Session | null } }) => {
        setSession(s);
        setUser(s?.user ?? null);
      })
      .catch((error: unknown) => {
        console.error("Error refreshing session:", error);
      });
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
