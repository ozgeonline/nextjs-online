"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCarouselBreakpointSettings } from '../widgets/useCarouselBreakpointSettings';
import { useCardContext } from '../providers/CardContext';
import { useVideoContext } from '../providers/VideoContext';
import styles from "./providers.module.css"

interface CarouselModalProps {
  children: React.ReactNode;
  id?: number[];
  sliderButtonSection?: boolean;
  sliderButtonSectionTop10?: boolean;
  continueCard?: boolean;
  sectionTitle?: string
  sectionTitleStyle?: string
  filterWatchedVideos?: boolean;
}

export default function CarouselModal({
  children: slides,
  id,
  sliderButtonSection,
  sliderButtonSectionTop10,
  continueCard,
  sectionTitle,
  sectionTitleStyle,
  filterWatchedVideos = false,

}: CarouselModalProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { isHover } = useCardContext();
  const { hasSavedTime, savedTime } = useVideoContext();
  const { sliderWidth, slidesPerView } = useCarouselBreakpointSettings(sliderRef);

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
  const slideWidth = sliderWidth > 0 ? sliderWidth / slidesPerView : 0;
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
  const isContentLoaded = sliderWidth > 0;
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

  const renderSlides = renderedSlides.map(({ child, keyPrefix }, index) => {
    if (!React.isValidElement(child)) return null;

    return (
      <div
        key={`${keyPrefix}-${child.key ?? index}`}
        aria-label={`${index}.slide`}
        style={{ width: `${slideWidth}px` }}
      >
        <div
          style={{ width: `${slideWidth}px` }}
          className="px-[0.5vw]"
        >
          {child}
        </div>
      </div>
    );
  });

  return (
    <div
      className={`
        animate-slide-X 
         ${isHover ? 'opacity-100 z-50' : 'opacity-95'}
      `}
      aria-label='Carousel wrapper'
    >
      {isContentLoaded && (
        <h2 className={`
          ${sectionTitleStyle} 
          relative title sm:text-2xl px-2 
        `}>
          {sectionTitle}
        </h2>
      )}
      <div
        ref={sliderRef}
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
    </div>
  )
}
