"use client"
import { useState, useEffect } from 'react';

// Define the breakpoints
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

const breakpointConditions: Record<Breakpoint, (width: number) => boolean> = {
  sm: (width) => width >= 640 && width < 768,
  md: (width) => width >= 768 && width < 1024,
  lg: (width) => width >= 1024 && width < 1280,
  xl: (width) => width >= 1280,
};

// Hook to calculate slider width and number of slides
export const CarouselBreakpointSettings = (sliderRef: React.RefObject<HTMLDivElement>) => {
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [slidesPerView, setSlidesPerView] = useState<number>(2); // Default to 2 slides

  const isClient = typeof window !== "undefined";

  // Utility to determine the current screen breakpoint
  const getBreakpointState = (breakpoint: Breakpoint): boolean => {
    if (!isClient) return false;
    const condition = breakpointConditions[breakpoint];
    return condition ? condition(window.innerWidth) : false;
  };

  const [isSm, setIsSm] = useState(getBreakpointState('sm'));
  const [isMd, setIsMd] = useState(getBreakpointState('md'));
  const [isLg, setIsLg] = useState(getBreakpointState('lg'));
  const [isXl, setIsXl] = useState(getBreakpointState('xl'));

  useEffect(() => {
    if (!isClient) return;
    const handleResize = () => {
      setIsSm(getBreakpointState('sm'));
      setIsMd(getBreakpointState('md'));
      setIsLg(getBreakpointState('lg'));
      setIsXl(getBreakpointState('xl'));

      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation on mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sliderRef, isClient]);

  useEffect(() => {
    const slides =
      isXl ? 6 :
      isLg ? 5 :
      isMd ? 4 :
      isSm ? 3 : 2;
    setSlidesPerView(slides);
  }, [isSm, isMd, isLg, isXl]);

  return { sliderWidth, slidesPerView };
};
