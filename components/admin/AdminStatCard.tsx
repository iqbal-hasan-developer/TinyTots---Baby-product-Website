import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  tone?: "green" | "gold" | "rose" | "ink";
}

const tones = {
  green: "bg-brand-primary-light text-brand-primary",
  gold: "bg-brand-secondary-light text-brand-secondary",
  rose: "bg-[#ffeee8] text-[#8a1a1a]",
  ink: "bg-[#eef1f5] text-[#26313c]",
};

export default function AdminStatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "green",
}: AdminStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#e3e7ec] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#5c6670]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal text-brand-text">{value}</p>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {helper && <p className="mt-4 text-xs font-medium text-[#6b747e]">{helper}</p>}
    </div>
  );
}
