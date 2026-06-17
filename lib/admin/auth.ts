import "server-only";

import { type User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createSupabaseAuthServerClient, isSupabaseAuthConfigError } from "@/lib/supabase/auth-server";

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getAdminUser(): Promise<User | null> {
  try {
    const supabase = await createSupabaseAuthServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) return null;
    return user;
  } catch (error) {
    if (isSupabaseAuthConfigError(error)) return null;
    throw error;
  }
}

export async function requireAdmin(): Promise<User> {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAllowedAdminEmail(user.email)) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}

export async function requireAdminForApi(): Promise<
  | { ok: true; user: User }
  | { ok: false; response: NextResponse<{ error: string }> }
> {
  const user = await getAdminUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  if (!isAllowedAdminEmail(user.email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    };
  }

  return { ok: true, user };
}
