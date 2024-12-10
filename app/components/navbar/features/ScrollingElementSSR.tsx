"use client"
import { useState, useEffect, ReactNode } from 'react'
import styles from "../navbar.module.css"

const ScrollingElementSSR = ({children} : {children: ReactNode}) => {
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10 ) {
        setScrolling(true)
      } else {
        setScrolling(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`${scrolling ? styles.navbar : ""} ${styles.navbarDefault}`} >
      {children}
    </div>
  )
}

export default ScrollingElementSSR;
