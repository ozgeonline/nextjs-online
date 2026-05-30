"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUIContext } from '@/app/components/providers/UIContext';
import { useVideoContext } from '@/app/components/providers/VideoContext';
import { useCarouselBreakpointSettings } from './useCarouselBreakpointSettings';
import styles from "./carousel.module.css"

interface InfiniteCarouselProps {
  children: React.ReactNode;
  id?: number[];
  sliderButtonSection?: boolean;
  sliderButtonSectionTop10?: boolean;
  continueCard?: boolean;
  sectionTitle?: string
  sectionTitleStyle?: string
  filterWatchedVideos?: boolean;
}

export default function InfiniteCarousel({
  children: slides,
  id,
  sliderButtonSection,
  sliderButtonSectionTop10,
  continueCard,
  sectionTitle,
  sectionTitleStyle,
  filterWatchedVideos = false,

}: InfiniteCarouselProps) {
  const sliderViewportRef = useRef<HTMLDivElement>(null);
  const { isHover } = useUIContext();
  const { hasSavedTime, savedTime } = useVideoContext();
  const { sliderWidth, slidesPerView } = useCarouselBreakpointSettings(sliderViewportRef);

  // Keeps the current visual order of slides 
  // so infinite looping can reorder React nodes without direct DOM mutation.
  const [orderedSlides, setOrderedSlides] = useState<React.ReactNode[]>([]);

  // Moves the carousel track by pixel value;
  // this is reset after each loop reorder to avoid visible jumps.
  const [trackTranslate, setTrackTranslate] = useState(0);

  // Tracks whether the user has moved forward at least once,
  // so the previous-side clone and prev button can appear after the first next action.
  const [hasMoved, setHasMoved] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimerRef = useRef<number | null>(null);

  const fallbackSliderWidth =
    sliderWidth ||
    sliderViewportRef.current?.clientWidth ||
    sliderViewportRef.current?.parentElement?.clientWidth ||
    (typeof window !== "undefined" ? window.innerWidth : 0);

  const slideWidth = fallbackSliderWidth > 0 ? fallbackSliderWidth / slidesPerView : 0;
  const slidesArray = useMemo(() => React.Children.toArray(slides), [slides]);

  const visibleSlides = useMemo(() => {
    if (!filterWatchedVideos) return slidesArray;

    return slidesArray.filter((_, index) => {
      const movieId = id?.[index];
      return movieId ? hasSavedTime(movieId) : true;
    });
  }, [filterWatchedVideos, hasSavedTime, id, slidesArray]);

  // Infinite controls are only useful 
  // when there are more slides than the visible viewport can show.
  const canLoop = orderedSlides.length > slidesPerView;

  // Prevents controls/title from rendering before the carousel has a measurable width.
  const isContentLoaded = fallbackSliderWidth > 0;
  const savedTimeLength = Object.keys(savedTime).length;

  // One navigation step equals the number of slides currently visible in the viewport.
  const stepSize = Math.min(slidesPerView, orderedSlides.length);
  const stepWidth = stepSize * slideWidth;
  const baseTranslate = canLoop && hasMoved ? -stepWidth : 0;

  useEffect(() => {
    setOrderedSlides(visibleSlides);
    setTrackTranslate(0);
    setHasMoved(false);
    setIsTransitioning(false);
  }, [visibleSlides]);

  useEffect(() => {
    if (!isTransitioning) {
      setTrackTranslate(baseTranslate);
    }
  }, [baseTranslate, isTransitioning]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const hasVisibleSlides = visibleSlides.length > 0;

  if (!hasVisibleSlides && !continueCard) {
    return null;
  }

  const renderedSlides = canLoop
    ? [
      ...(hasMoved
        ? orderedSlides.slice(-stepSize).map((child) => ({ child, keyPrefix: "before" }))
        : []),
      ...orderedSlides.map((child) => ({ child, keyPrefix: "main" })),
      ...orderedSlides.slice(0, stepSize).map((child) => ({ child, keyPrefix: "after" })),
    ]
    : orderedSlides.map((child) => ({ child, keyPrefix: "main" }));

  const handleClick = (direction: "prev" | "next") => {
    if (isTransitioning || !canLoop) return;

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    if (direction === "next") {
      setIsTransitioning(true);
      setTrackTranslate(baseTranslate - stepWidth);

      transitionTimerRef.current = window.setTimeout(() => {
        setOrderedSlides((currentSlides) => [
          ...currentSlides.slice(stepSize),
          ...currentSlides.slice(0, stepSize),
        ]);
        setHasMoved(true);
        setIsTransitioning(false);
        setTrackTranslate(-stepWidth);
      }, 500);

      return;
    }

    setIsTransitioning(true);
    setTrackTranslate(0);

    transitionTimerRef.current = window.setTimeout(() => {
      setOrderedSlides((currentSlides) => [
        ...currentSlides.slice(-stepSize),
        ...currentSlides.slice(0, -stepSize),
      ]);
      setHasMoved(true);
      setIsTransitioning(false);
      setTrackTranslate(-stepWidth);
    }, 500);
  };

  const visibleStartIndex = canLoop && hasMoved ? stepSize : 0;
  const visibleEndIndex = visibleStartIndex + slidesPerView - 1;

  const renderSlides = renderedSlides.map(({ child, keyPrefix }, index) => {
    if (!React.isValidElement(child)) return null;

    const isLastVisibleSlide = index === visibleEndIndex;
    const isNearLastVisibleTop10Slide = Boolean(sliderButtonSectionTop10) && index >= visibleEndIndex - 1;

    return (
      <div
        key={`${keyPrefix}-${child.key ?? index}`}
        aria-label={`${index}.slide`}
        style={{ width: `${slideWidth}px`, minWidth: `${slideWidth}px`, flexShrink: 0 }}
        className={
          isLastVisibleSlide || isNearLastVisibleTop10Slide
            ? styles.lastVisibleSlide
            : undefined
        }
      >
        <div
          style={{ width: `${slideWidth}px`, minWidth: `${slideWidth}px` }}
          className="px-[0.5vw]"
        >
          {child}
        </div>
      </div>
    );
  });

  return (
    <div
      ref={sliderViewportRef}
      className={`
        animate-slide-X 
         ${isHover ? 'opacity-100 z-50' : 'opacity-95'}
      `}
      aria-label='Carousel wrapper'
    >
      {isContentLoaded && hasVisibleSlides && (
        <h2 className={`
          ${sectionTitleStyle} 
          relative title sm:text-2xl px-2 
        `}>
          {sectionTitle}
        </h2>
      )}
      {hasVisibleSlides ? (
        <>
          <div
            className="flex"
            style={{
              transform: `translateX(${trackTranslate}px)`,
              transition: isTransitioning ? "transform 0.5s ease" : "none",
            }}
          >
            {renderSlides}
          </div>

          <div className='relative w-full h-full z-50'>
            {isContentLoaded && (
              <div>
                <button
                  onClick={() => handleClick("prev")}
                  aria-label='Previous Button'
                  className={
                    `${styles.prevButton} ${styles.carouselButtons} group/prev ` +
                    `${sliderButtonSection && styles.sliderButtonSectionSize} ` +
                    `${sliderButtonSectionTop10 && styles.sliderButtonSectionTop10Size} ` +
                    `${canLoop && hasMoved ? "block" : "hidden"}`
                  }
                >
                  <ChevronLeft
                    className={`
                      ${styles.buttonIcon}
                      group-hover/prev:text-white 
                    `}
                  />
                </button>
                <button
                  onClick={() => handleClick("next")}
                  aria-label='Next Button'
                  className={
                    `${styles.nextButton} ${styles.carouselButtons} group/next ` +
                    `${sliderButtonSection && styles.sliderButtonSectionSize} ` +
                    `${sliderButtonSectionTop10 && styles.sliderButtonSectionTop10Size} ` +
                    `${canLoop && (!continueCard || savedTimeLength > slidesPerView)
                      ? "block"
                      : "hidden"
                    }`
                  }
                >
                  <ChevronRight
                    className={`
                      ${styles.buttonIcon}
                      group-hover/next:text-white
                    `}
                  />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div
          className={styles.emptyContinueSection}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
