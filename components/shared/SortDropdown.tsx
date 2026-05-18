"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type SortOption = {
  value: string;
  label: string;
};

type SortDropdownProps = {
  value: string;
  options: SortOption[];
  onChange: (value: string) => void;
  label: string;
};

export default function SortDropdown({
  value,
  options,
  onChange,
  label,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-full min-w-0 sm:w-[220px]">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-full border border-brand-outline bg-white px-4 py-2.5 text-left text-sm font-medium text-brand-text shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      >
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-brand-text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-40 mt-2 max-w-full overflow-hidden rounded-2xl border border-brand-outline bg-white shadow-lg"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`block w-full min-w-0 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-brand-primary/10 focus:bg-brand-primary/10 focus:outline-none ${
                  isSelected
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-brand-text"
                }`}
              >
                <span className="block min-w-0 whitespace-normal break-words">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
