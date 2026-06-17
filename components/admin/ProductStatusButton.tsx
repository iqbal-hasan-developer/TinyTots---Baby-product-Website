"use client";

import { useState } from "react";
import { Archive, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductStatusButtonProps {
  productId: string;
  isActive: boolean;
}

export default function ProductStatusButton({
  productId,
  isActive,
}: ProductStatusButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const nextActive = !isActive;

  const handleClick = async () => {
    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: nextActive }),
      });

      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error ?? "Product status could not be updated.");
        return;
      }

      router.refresh();
    } catch {
      setError("Product status could not be updated. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isSaving}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#dfe5eb] bg-white px-3 text-xs font-bold text-brand-text transition-colors hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isActive ? <Archive className="h-3.5 w-3.5" aria-hidden="true" /> : <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />}
        {isSaving ? "Saving" : isActive ? "Archive" : "Publish"}
      </button>
      {error && <p className="max-w-[140px] text-xs font-semibold text-[#8a1a1a]">{error}</p>}
    </div>
  );
}
