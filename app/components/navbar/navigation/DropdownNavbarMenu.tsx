"use client"

import React, { useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useUIContext } from '@/app/components/providers/UIContext';

interface DropdownMenuProps {
  children: React.ReactNode;
  onClick?: () => void;
  onAnimationStart?: () => void;
}

export default function DropdownNavbarMenu({ children }: DropdownMenuProps) {
  const { isOpen, setIsOpen } = useUIContext()
  const navbarRef = useRef<HTMLDivElement>(null);
  const DropdownIcon = isOpen ? ChevronUp : ChevronDown;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openDropdown = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event: PointerEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={navbarRef} 
      className="flex lg:hidden mx-5 transition-all ease-in relative left-5"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex text-xs font-medium text-white hover:outline-none"
        onMouseEnter={openDropdown}
        onClick={toggleDropdown}
      >
        Browse
      </button>
      <div aria-hidden="true">
        <DropdownIcon className='p-1 fill-white items-center cursor-pointer'/>
      </div>

      {isOpen && (
        <div
          role="menu"
          className='absolute left-1/2 transform -translate-x-1/2 mt-10'
        >
          {children}
        </div>
      )}
    </div>
  );
}
