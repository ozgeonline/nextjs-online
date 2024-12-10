"use client"

import React,{ useState, ReactNode, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DropdownMenuProps {
  children: ReactNode;
}

export default function DropdownNavbarMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLInputElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseout', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mouseout', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClick = () => setIsOpen(false);
  
  return (
    <div 
      ref={navbarRef} 
      className="flex lg:hidden mx-5 transition-all ease-in"
    >
      <button
        type="button"
        className="flex text-xs font-medium text-white hover:outline-none"
        onMouseOver={toggleDropdown}
        onClick={toggleDropdown}
      >
        Browse
        <div>
          <ChevronDown className='p-1 fill-white items-center cursor-pointer'/>
          {isOpen && <ChevronUp  className='p-1 fill-white '/>}
        </div>
      </button>
      
      <div>
        {isOpen && 
          <div onClick={handleClick} className='absolute left-11 mt-10'>
            {children}
          </div>
        }
      </div>
    </div>
  );
}
