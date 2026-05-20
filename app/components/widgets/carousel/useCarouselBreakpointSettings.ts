"use client"

import { RefObject, useEffect, useMemo, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl";

type BreakpointState = Record<`is${Capitalize<Breakpoint>}`, boolean>;

type CarouselSettings = {
  sliderWidth: number
  slidesPerView: number
  breakpoint: BreakpointState
}

const breakpointConditions: Record<Breakpoint, (width: number) => boolean> = {
  sm: (width) => width >= 640 && width < 768,
  md: (width) => width >= 768 && width < 1024,
  lg: (width) => width >= 1024 && width < 1280,
  xl: (width) => width >= 1280,
};

function getSlidesPerView(width: number) {
  if (breakpointConditions.xl(width)) return 6;
  if (breakpointConditions.lg(width)) return 5;
  if (breakpointConditions.md(width)) return 4;
  if (breakpointConditions.sm(width)) return 3;
  return 2;
}

function getBreakpointState(width: number): BreakpointState {
  return {
    isSm: breakpointConditions.sm(width),
    isMd: breakpointConditions.md(width),
    isLg: breakpointConditions.lg(width),
    isXl: breakpointConditions.xl(width),
  };
}

export function useCarouselBreakpointSettings(
  sliderRef: RefObject<HTMLDivElement>,
): CarouselSettings {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  useEffect(() => {
    const sliderElement = sliderRef.current;

    if (!sliderElement) return;

    const updateSliderWidth = () => {
      const measuredWidth =
        sliderElement.clientWidth ||
        sliderElement.parentElement?.clientWidth ||
        window.innerWidth;

      setSliderWidth(measuredWidth);
    };

    updateSliderWidth();

    const resizeObserver = new ResizeObserver(updateSliderWidth);
    resizeObserver.observe(sliderElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [sliderRef]);

  const breakpoint = useMemo(() => getBreakpointState(viewportWidth), [viewportWidth]);
  const slidesPerView = useMemo(() => getSlidesPerView(viewportWidth), [viewportWidth]);

  return {
    sliderWidth,
    slidesPerView,
    breakpoint,
  };
}
