"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface Movie {
  title: string;
}
interface SortBySelectProps {
  data: Movie[];
  sortOrder: 'default' | 'asc' | 'desc';
  onSortChange: (order: 'default' | 'asc' | 'desc') => void;
}

const SortBySelect = ({data, sortOrder, onSortChange }: SortBySelectProps) => {
  const [sortedData, setSortedData] = useState<Movie[]>(data);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: 'default' | 'asc' | 'desc') => {
    onSortChange(value);
    setShowDropdown(false);

    const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
    currentParams.set('sortOrder', value);
    router.push(`?${currentParams.toString()}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  type SortOption = {
    label: string;
    value: 'default' | 'asc' | 'desc';
  };
  
  const sortOptions: SortOption[] = [
    { label: 'Suggestions for you', value: 'default' },
    { label: 'A-Z', value: 'asc' },
    { label: 'Z-A', value: 'desc' },
  ];

  const renderOptions = () => (
    <div className="absolute flex flex-col z-10 min-w-full sm:min-w-[14rem] sm:right-0 bg-black border opacity-80">
      {sortOptions.map(option => (
        <div
          key={option.value}
          className="px-2 cursor-pointer hover:underline text-sm"
          onClick={() => handleSortChange(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (sortOrder === 'default') {
      setSortedData(data);
      return;
    }

    const sorted = [...data].sort((a, b) =>
      sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setSortedData(sorted);
  }, [data, sortOrder]);

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex max-sm:flex-col sm:space-x-2 max-sm:space-y-2 cursor-pointer"
      >
        <div className='inline-flex flex-nowrap max-sm:text-sm'>
          Sort by
        </div>
        <div 
          className={`
            ${showDropdown ? "bg-[#333]" : "bg-black "}
            flex justify-between items-center
            hover:bg-[#333] transition-colors ease-in min-w-40 sm:min-w-56 max-sm:text-sm border border-white px-2 font-semibold 
          `}
        >
          {sortOrder === 'default' ? 'Suggestions For You' : sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          <span className='text-xs'>&#11206;</span>
        </div>
      </div>
      {showDropdown && renderOptions()}
    </div>
  );
};

export default SortBySelect;


