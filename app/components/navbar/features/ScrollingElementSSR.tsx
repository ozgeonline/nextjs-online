"use client"
import { useState, useEffect, ReactNode } from 'react'
import styles from "../navbar.module.css"

const ScrollingElementSSR = ({ children }: { children: ReactNode }) => {
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolling = window.scrollY > 10;
      setScrolling((currentScrolling) =>
        currentScrolling === nextScrolling ? currentScrolling : nextScrolling
      );
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className={`${scrolling ? styles.navbar : ""} ${styles.navbarDefault}`} >
      {children}
    </div>
  )
}

export default ScrollingElementSSR;
