interface StatusBadgeProps {
  value: string;
  label?: string;
}

const statusTones: Record<string, string> = {
  pending: "bg-[#fff4d8] text-[#7a5a00] ring-[#ead28f]",
  confirmed: "bg-[#e9f7ed] text-[#246239] ring-[#bfdfc8]",
  processing: "bg-[#eaf2ff] text-[#225a9a] ring-[#c4d9f5]",
  shipped: "bg-[#f0edff] text-[#5742a6] ring-[#d8cef6]",
  delivered: "bg-[#e7f6ec] text-[#1f6b3a] ring-[#badfc6]",
  cancelled: "bg-[#ffeee8] text-[#8a1a1a] ring-[#f4c2b8]",
  verified: "bg-[#e7f6ec] text-[#1f6b3a] ring-[#badfc6]",
  paid: "bg-[#e7f6ec] text-[#1f6b3a] ring-[#badfc6]",
  failed: "bg-[#ffeee8] text-[#8a1a1a] ring-[#f4c2b8]",
  refunded: "bg-[#eef1f5] text-[#4b5663] ring-[#d7dde5]",
};

function toLabel(value: string): string {
  if (value === "cod") return "COD";
  if (value === "bkash") return "bKash";
  if (value === "nagad") return "Nagad";
  return value.replaceAll("-", " ");
}

export default function StatusBadge({ value, label }: StatusBadgeProps) {
  const tone = statusTones[value] ?? "bg-[#eef1f5] text-[#4b5663] ring-[#d7dde5]";

  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-left text-xs font-bold capitalize ring-1 ${tone}`}>
      {label ?? toLabel(value)}
    </span>
  );
}

export function OrderStatusBadge({ value }: StatusBadgeProps) {
  return <StatusBadge value={value} />;
}

export function PaymentStatusBadge({ value }: StatusBadgeProps) {
  return <StatusBadge value={value} />;
}

export function PaymentMethodBadge({ value }: StatusBadgeProps) {
  const tone =
    value === "cod"
      ? "bg-[#eef1f5] text-[#384552] ring-[#d7dde5]"
      : value === "bkash"
        ? "bg-[#ffeaf4] text-[#a30f5f] ring-[#f4c2dc]"
        : "bg-[#fff0df] text-[#9a4c00] ring-[#efd0aa]";

  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-left text-xs font-bold ring-1 ${tone}`}>
      {toLabel(value)}
    </span>
  );
}
