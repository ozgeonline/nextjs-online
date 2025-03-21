"use client"
import { useState, useEffect, ReactNode } from 'react'
import styles from "../navbar.module.css"

const ScrollingElementSSR = ({children} : {children: ReactNode}) => {
  const [scrolling, setScrolling] = useState(false)

  useEffect(() => {
    // if (typeof window === "undefined") {
    //   console.log("Window is undefined");
    //   return;
    // }

    const handleScroll = () => {
      // console.log("Scroll position:", window.scrollY);
      if (window.scrollY > 10 ) {
        setScrolling(true)
      } else {
        setScrolling(false)
      }
    }
    // console.log("Adding scroll listener");
    handleScroll()
    // console.log("window height:", window.innerHeight);
    // console.log("Doc height:", document.documentElement.scrollHeight);

    window.addEventListener("scroll", handleScroll);
    return () => {
      // console.log("Removing scroll listener");
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
