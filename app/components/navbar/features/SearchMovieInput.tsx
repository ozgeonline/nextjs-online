"use client"
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation'
import { Search } from 'lucide-react';
import styles from "../navbar.module.css";

const SearchMovieInput: React.FC = () => {
  const [openSearch, setOpenSearch] = useState(false)
  const [query, setQuery] = useState<string>("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousPathRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value && !previousPathRef.current) {
      previousPathRef.current = pathname;
      setOpenSearch(true);
    }
  };

  const handleOpenSearch = () => {
    setOpenSearch(prevState => !prevState);
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node) ) {
      setOpenSearch(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = query.trim();
    const timerId = window.setTimeout(() => {
      if (trimmedQuery) {
        const params = new URLSearchParams({ query: trimmedQuery });
        router.push(`/home/query?${params.toString()}`);
        return;
      }

      if (previousPathRef.current) {
        router.push(previousPathRef.current);
        previousPathRef.current = null;
      }
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [query, router]);

  useEffect(() => {
    if (openSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSearch]);

  return (
    <div className='hidden sm:flex relative items-center'>
      <div
        ref={searchRef}
        className={`
          ${openSearch ? `${styles["search-container"]}` : ""}
          flex justify-evenly relative size-7 sm:size-8
        `}
      >
        <button
          type="button"
          aria-label={openSearch ? "Close search" : "Open search"}
          onClick={() => handleOpenSearch()}
          className="flex items-center justify-center"
        >
          <Search className='flex size-6 sm:size-8 p-1 cursor-pointer' />
        </button>
        <input
          type='search'
          aria-label="Search titles and genres"
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          placeholder='Titles, genres'
          className={`
            ${styles["input-search-field"]}
            ${openSearch ? "" : "hidden"} 
          `}
        />
      </div>
    </div>
  );
};

export default SearchMovieInput;
