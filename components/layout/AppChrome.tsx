"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

interface AppChromeProps {
  children: React.ReactNode;
}

export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="min-h-screen w-full bg-[#f6f8fb]">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col w-full min-w-0 pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <FloatingWhatsApp />
    </>
  );
}
