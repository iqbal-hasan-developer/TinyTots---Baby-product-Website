import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  message,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfd6de] bg-[#f8fafc] p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-primary shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold text-brand-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66717b]">{message}</p>
    </div>
  );
}
