"use client"

import { Button } from "@/components/ui/button"
import debounce from "lodash.debounce"
import type { StaticImageData } from "next/image"
import Image from "next/image"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"

type UserSettingsToggleButtonProps = {
  userImg: StaticImageData | string | null | undefined
  userShortName:string
  children: React.ReactNode
}

export default function UserSettingsToggleButton({
  userImg,
  userShortName,
  children
}: UserSettingsToggleButtonProps) {

  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenMenu = () => {
    setOpenMenu((isOpen) => !isOpen)
  }

  const handleClick = () => setOpenMenu(false);
  const handleLeave = () => setOpenMenu(false);

  const handleClickOutside = (event: PointerEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const debouncedHandleOpenMenu = useMemo(() => debounce(() => {
    setOpenMenu(true);
  }, 200), []);

  useEffect(() => {
    return () => {
      debouncedHandleOpenMenu.cancel();
    };
  }, [debouncedHandleOpenMenu]);
  
  const handleMouseOver = () => {
    debouncedHandleOpenMenu();
  };

  const profileImageSrc = typeof userImg === "string" && userImg.trim().length === 0 ? null : userImg;

  return (
    <div ref={menuRef}>
      <Button
        type="button"
        aria-haspopup="menu"
        aria-expanded={openMenu}
        aria-label="Open user menu"
        variant="ghost"
        className="relative size-7 sm:size-8 rounded-sm"
        onMouseEnter={handleMouseOver}
        onClick={handleOpenMenu}
      >
        <Suspense fallback={userShortName}>
          {profileImageSrc ? (
            <Image
              src={profileImageSrc}
              alt="Profile picture"
              className="absolute rounded-sm"
              fetchPriority="high"
              loading="eager"
              sizes="100%"
              fill
            />
          ) : (
            <span className="text-xs font-semibold uppercase text-white">
              {userShortName}
            </span>
          )}
        </Suspense>
      </Button>
      {openMenu && (
        <div
          role="menu"
          onMouseLeave={handleLeave}
          onClick={handleClick}
          className="absolute top-5 right-0"
        >
          {children}
        </div>
      )}
    </div>
  )
}
