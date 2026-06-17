"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface AdminLoginFormProps {
  initialError?: string;
}

export default function AdminLoginForm({ initialError }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your admin email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message || "Admin login failed.");
        return;
      }

      const response = await fetch("/api/admin/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        await supabase.auth.signOut();
        setError("This account is not allowed to access the admin panel.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Admin login is not configured yet. Check Supabase auth environment variables.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary-light text-brand-primary">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-secondary">
            Admin access
          </p>
          <h1 className="text-2xl font-bold text-brand-text">Sign in</h1>
        </div>
      </div>
      <p className="text-sm leading-6 text-[#66717b]">
        Use a Supabase Auth admin account. Admin users are managed manually for now.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-[#ba1a1a]/30 bg-[#ffeee8] px-4 py-3 text-sm font-bold text-[#8a1a1a]" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-sm font-bold text-brand-text">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm font-bold text-brand-text">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-[#dfe5eb] bg-[#f8fafc] px-4 py-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 font-bold text-white shadow-sm transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
