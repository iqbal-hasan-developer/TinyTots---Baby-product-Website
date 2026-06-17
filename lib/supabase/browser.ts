"use client";

import { createBrowserClient } from "@supabase/ssr";

const missingBrowserConfigMessage =
  "Supabase auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then retry admin login.";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(missingBrowserConfigMessage);
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
