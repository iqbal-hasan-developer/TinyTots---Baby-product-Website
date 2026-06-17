import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { getAdminUser, isAllowedAdminEmail } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminLoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const user = await getAdminUser();

  if (user && isAllowedAdminEmail(user.email)) {
    redirect("/admin");
  }

  const params = searchParams ? await searchParams : {};
  const initialError =
    params.error === "unauthorized"
      ? "This account is signed in but is not allowlisted for admin access."
      : undefined;

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#f6f8fb] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e3e7ec] bg-white shadow-sm md:grid-cols-[1fr_430px]">
        <div className="flex flex-col justify-between bg-[#1d2922] p-8 text-white sm:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/56">
              TinyTots BD
            </p>
            <h1 className="mt-4 max-w-lg text-3xl font-bold tracking-normal text-white md:text-4xl">
              Protected order workspace
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              View saved Supabase orders, inspect customer details, and manage manual payment and fulfillment statuses from a dedicated owner dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-3 text-sm text-white/72">
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              Admin users are created manually in Supabase Auth and must be listed in the server-only allowlist.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
              No public sign-up is enabled for this admin area.
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-secondary md:hidden">
            TinyTots BD
          </p>
          <AdminLoginForm initialError={initialError} />
        </div>
      </div>
    </section>
  );
}
