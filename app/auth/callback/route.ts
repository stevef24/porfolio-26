import { NextRequest, NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Auth callback handler for magic link verification.
 * Supabase redirects here after user clicks the magic link in their email.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/?auth_not_configured=true`);
  }

  if (code) {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.redirect(`${origin}/?auth_not_configured=true`);
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication - redirect to intended destination
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Auth callback error:", error.message);
  }

  // Auth failed - redirect to home with error indicator
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
