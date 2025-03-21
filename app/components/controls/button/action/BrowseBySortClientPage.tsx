"use client";

import { useState, useTransition, useMemo, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RedCircle_Animation from "@/app/components/animation/RedCircle_Animation";
import { MovieProps } from "@/app/types/props";
import styles from "../controlsButton.module.css";
import { ChevronDown } from "lucide-react";

interface CategoryPageClientProps extends MovieProps {
  initialData: MovieProps[];
  initialSortOrder: "default" | "asc" | "desc";
}

type SortOption = {
  label: string;
  value: "default" | "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Suggestions for you", value: "default" },
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
];

const BrowseBySortClientPage = ({ initialData, initialSortOrder }: CategoryPageClientProps) => {
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  //console.log("pathname",pathname)

  // Memoized data
  const sortedData = useMemo(() => {
    if (sortOrder === "default") return initialData;

    return [...initialData].sort((a, b) => {
      const aTitle = a.title ?? "";
      const bTitle = b.title ?? "";
      return sortOrder === "asc" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
    });
  }, [sortOrder, initialData]);

  const handleSortChange = (order: "default" | "asc" | "desc") => {
    startTransition(() => {
      setSortOrder(order);
    });

    setShowDropdown(false);

    const currentParams = new URLSearchParams(Object.fromEntries(searchParams));
    currentParams.set("sortOrder", order);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

      {/* Dropdown Sort Selection */}
      <div ref={dropdownRef} className="relative">
         {/* Dropdown Menu Selection Button Disagn */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex max-sm:flex-col sm:space-x-2 max-sm:space-y-2 cursor-pointer"
        >
          <div className="inline-flex flex-nowrap max-sm:text-sm">
            Sort by
          </div>
          <div
            className={`
              ${showDropdown ? "bg-main-gray" : "bg-black "}
              ${styles.dropdownSelectionBtnWrapperDefault}
            `}
          >
            {sortOrder === "default" ? "Suggestions For You" : sortOrder === "asc" ? "A-Z" : "Z-A"}
            <span className="text-xs">
              <ChevronDown className="fill-white"/>
            </span>
          </div>
        </div>

        {/* UI Disagn when Dropdown is opened*/}
        {showDropdown && (
          <div className={styles.openedDropdownMenu}>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className="px-2 cursor-pointer hover:underline text-sm"
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sorted Movies (Hidden JSON for Debugging) */}
      <div className="hidden">{JSON.stringify(sortedData)}</div>
    </div>
  );
};

export default BrowseBySortClientPage;
