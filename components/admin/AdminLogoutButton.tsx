"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-brand-outline bg-white px-4 text-sm font-semibold text-brand-text transition-colors hover:border-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {isLoggingOut ? "Signing out" : "Logout"}
    </button>
  );
}
