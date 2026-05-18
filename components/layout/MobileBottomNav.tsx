"use client";

import Link from "next/link";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-context";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const { t } = useLanguage();

  const navItems = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.shop"), href: "/shop", icon: ShoppingBag },
    { name: t("nav.cart"), href: "/cart", icon: ShoppingCart, badge: itemCount },
    { name: t("nav.account"), href: "/account", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-outline px-6 py-2 z-[100] pb-[env(safe-area-inset-bottom,0.5rem)]">
      <nav className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] py-1",
                isActive ? "text-brand-primary" : "text-brand-text-muted hover:text-brand-text"
              )}
            >
              <div className="relative">
                <item.icon className={cn("w-6 h-6", isActive && "fill-brand-primary-light")} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#ffecb3] text-brand-text text-[10px] font-bold flex items-center justify-center rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
