import { createBrowserClient } from "@supabase/ssr";

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Creates a Supabase client for browser-side operations.
 * Use this in Client Components ("use client").
 * Returns null if Supabase is not configured.
 */
export function createClient(): ReturnType<typeof createBrowserClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a mock client that does nothing when Supabase is not configured
    // This allows the app to run without Supabase during development
    return null;
  }

  return createBrowserClient(url, anonKey);
}
