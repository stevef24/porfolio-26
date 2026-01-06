"use client";

import { useContext, createContext } from "react";
import type { User, Session } from "@supabase/supabase-js";

/**
 * Auth Context Types
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;

/**
 * Auth Context
 * Created here, provided by AuthProvider
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Hook to access auth state and actions
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * Hook to get current user (convenience wrapper)
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
