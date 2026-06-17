import "server-only";

import { createClient } from "@supabase/supabase-js";

const missingSupabaseConfigMessage =
  "Supabase order persistence is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then retry checkout.";
const missingSupabasePublicConfigMessage =
  "Supabase public catalog reads are not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(missingSupabaseConfigMessage);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function getSupabasePublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error(missingSupabasePublicConfigMessage);
  }

  return createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isSupabaseConfigError(error: unknown): boolean {
  return error instanceof Error && error.message === missingSupabaseConfigMessage;
}

export function isSupabasePublicConfigError(error: unknown): boolean {
  return error instanceof Error && error.message === missingSupabasePublicConfigMessage;
}
