"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import RedCircle_Animation from "@/app/components/animation/RedCircle_Animation";
import styles from "./select.module.css";

export type SortOrder = "default" | "asc" | "desc";

type SortOption = {
  label: string;
  value: SortOrder;
};

interface BrowseSortSelectProps {
  initialSortOrder: SortOrder;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Suggestions for you", value: "default" },
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
];

const SORT_LABELS: Record<SortOrder, string> = {
  default: "Suggestions For You",
  asc: "A-Z",
  desc: "Z-A",
};

export default function BrowseSortSelect({ initialSortOrder }: BrowseSortSelectProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSortOrder(initialSortOrder);
  }, [initialSortOrder]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    setIsDropdownOpen(false);

    const currentParams = new URLSearchParams(searchParams.toString());

    if (order === "default") {
      currentParams.delete("sortOrder");
    } else {
      currentParams.set("sortOrder", order);
    }

    const nextUrl = currentParams.toString()
      ? `${pathname}?${currentParams.toString()}`
      : pathname;

    startTransition(() => {
      router.push(nextUrl);
    });
  };

  return (
    <div>
      {isPending && (
        <div
          className={`
            ${styles.animationWrapper} -translate-x-1/2 -translate-y-1/2 backdrop-brightness-50
          `}
        >
          <RedCircle_Animation />
        </div>
      )}

      <div ref={dropdownRef} className="relative">
        <div className="flex max-sm:flex-col sm:space-x-2 max-sm:space-y-2">
          <span className="inline-flex flex-nowrap max-sm:text-sm">
            Sort by
          </span>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen((isOpen) => !isOpen)}
            className={`
              ${isDropdownOpen ? "bg-main-gray" : "bg-black "}
              ${styles.dropdownSelectionBtnWrapperDefault}
            `}
          >
            {SORT_LABELS[sortOrder]}
            <span className="text-xs">
              <ChevronDown className="fill-white" />
            </span>
          </button>
        </div>

        {isDropdownOpen && (
          <div className={styles.openedDropdownMenu} role="menu">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={sortOrder === option.value}
                className="block w-full px-2 text-left text-sm cursor-pointer hover:underline"
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
