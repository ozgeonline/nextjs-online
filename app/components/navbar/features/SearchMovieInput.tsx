"use client"
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation'
import { Search } from 'lucide-react';
import styles from "../navbar.module.css";

const SearchMovieInput: React.FC = () => {
  
  const [openSearch, setOpenSearch] = useState(false)
  const [query, setQuery] = useState<string>("");
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  //console.log("pathname", pathname)
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    
    if (value) {
      if (!previousPath) {
        setPreviousPath(pathname); //saving the path before the query
      }
      setOpenSearch(true);
      router.push(`/home/query?query=${value}`); //path to search page
    } else if (previousPath) {
      router.push(previousPath); //back to the previous path
      setPreviousPath(null);
    }
  };

  const handleOpenSearch = () => {
    setOpenSearch(prevState => !prevState);
  }

  //console.log(inputRef.current?.value)
  
  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node) ) {
      setOpenSearch(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openSearch]);
  //console.log(openSearch)

  return (
    <div className='hidden sm:flex relative items-center'>
      <div
        ref={searchRef}
        className={`
          ${openSearch ? `${styles["search-container"]}` : ""}
          flex justify-evenly relative size-7 sm:size-8
        `}
      >
        <Search
          onClick={() => handleOpenSearch()}
          className='flex size-6 sm:size-8 p-1 cursor-pointer'
        />
        <input
          type='search'
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
