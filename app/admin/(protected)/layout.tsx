import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdmin();

  return (
    <section className="min-h-screen w-full bg-[#f6f8fb]">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <aside className="hidden w-[280px] shrink-0 border-r border-black/10 bg-[#1d2922] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-sm">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                  TinyTots BD
                </p>
                <h1 className="text-lg font-bold text-white">Admin Desk</h1>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <AdminNav />
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/8 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/50">
              Signed in
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-white">{user.email}</p>
            <div className="mt-4">
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#e3e7ec] bg-white/92 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-secondary">
                  TinyTots BD
                </p>
                <h1 className="text-lg font-bold text-brand-text">Admin Desk</h1>
              </div>
              <AdminLogoutButton />
            </div>
            <div className="mt-3 overflow-x-auto pb-1">
              <div className="min-w-[360px] rounded-2xl bg-[#1d2922] p-2">
                <AdminNav />
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </section>
  );
}
