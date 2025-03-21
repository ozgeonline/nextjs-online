"use client"

import React,{ useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCardContext } from '@/app/components/providers/CardContext';

interface DropdownMenuProps {
  children: React.ReactNode;
  onClick?: () => void;
  onAnimationStart?: () => void;
}

export default function DropdownNavbarMenu({ children }: DropdownMenuProps) {
  const {isOpen, setIsOpen} = useCardContext()
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // console.log(' isOpen:', isOpen)
  //console.log(children)
  
  return (
    <div 
      ref={navbarRef} 
      className="flex lg:hidden mx-5 transition-all ease-in relative left-5"
    >
      <button
        type="button"
        className="flex text-xs font-medium text-white hover:outline-none"
        onMouseOver={toggleDropdown}
        onClick={toggleDropdown}
      >
        Browse
      </button>
      <div >
        <ChevronDown className='p-1 fill-white items-center cursor-pointer'/>
        {isOpen && <ChevronUp  className='p-1 fill-white '/>}
      </div>
      
      <>
        {isOpen &&
          <div className='absolute left-1/2 transform -translate-x-1/2 mt-10'>
            {children}
          </div>
        }
      </>
    </div>
  );
}
