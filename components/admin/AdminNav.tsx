"use client";

import Link from "next/link";
import { ClipboardList, LayoutDashboard, Package, Store } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1" aria-label="Admin navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-white text-brand-text shadow-sm ring-1 ring-black/5"
                : "text-white/76 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${isActive ? "text-brand-primary" : "text-white/70 group-hover:text-white"}`}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/8 p-4 text-white">
        <Store className="h-5 w-5 text-white/70" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold">Owner workspace</p>
        <p className="mt-1 text-xs leading-5 text-white/62">
          Manage incoming orders and keep the public catalog current from one place.
        </p>
      </div>
    </nav>
  );
}
