"use client"

import { Button } from "@/components/ui/button"
import debounce from "lodash.debounce"
import Image from "next/image"
import {Suspense, useEffect, useRef, useState } from "react"

type UserSettingsToggleButtonProps = {
  userImg: string 
  userShortName:string
  children: React.ReactNode
}

export default function UserSettingsToggleButton({
  userImg,
  userShortName,
  children
}:UserSettingsToggleButtonProps) {

  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu)
  }
  // console.log(openMenu)
  const handleClick = () => setOpenMenu(false);
  const handleLeave = () => setOpenMenu(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseleave', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mouseleave', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenu]);

  const debouncedHandleOpenMenu = debounce(() => {
    setOpenMenu(true);
  }, 200);
  
  const handleMouseOver = () => {
    debouncedHandleOpenMenu();
  };

  //console.log(menuRef.current)
  return (
    <div>
      <Button
        variant="ghost"
        className="relative size-7 sm:size-8 rounded-sm"
        onMouseOver={handleMouseOver}
        onClick={handleOpenMenu}
      >
        <Suspense fallback={userShortName}>
          <Image 
            src={userImg} 
            alt="Profile picture" 
            className="absolute rounded-sm"
            fetchPriority="high" 
            loading="eager"
            sizes="100%"
            fill
          />
        </Suspense>
      </Button>
      {
        openMenu && (
          <div 
            ref={menuRef}
            onMouseLeave={handleLeave} 
            onClick={handleClick} 
            className="absolute top-5 right-0"
          >
            {children}
          </div>
        )
      }
    </div>
  )
}