"use client"

import { ChevronRight, ChevronLeft } from 'lucide-react';
import React, {  useEffect, useRef, useState } from 'react'
import { CarouselBreakpointSettings } from '../widgets/useCarouselBreakpointSettings';
import { useCardContext } from '../providers/CardContext';
import { useVideoContext } from '../providers/VideoContext';
import styles from "./providers.module.css"

interface CarouselModalProps {
  children: React.ReactNode[];
  id?:number[];
  sliderButtonSection?: boolean;
  sliderButtonSectionTop10?: boolean;
  continueCard?:boolean;
  sectionTitle?:string
  sectionTitleStyle?: string
  filterWatchedVideos?: boolean;
}

export default function CarouselModal ({
  children: slides,
  id,
  sliderButtonSection,
  sliderButtonSectionTop10,
  continueCard,
  sectionTitle,
  sectionTitleStyle,
  filterWatchedVideos=false,
  
}: CarouselModalProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { isHover } = useCardContext();
  const { hasSavedTime, savedTime } = useVideoContext();
  const { sliderWidth, slidesPerView } = CarouselBreakpointSettings(sliderRef);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState(0)
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const [lastChildCompare, setLastChildCompare] = useState<boolean | undefined>(undefined);
  const savedTimeLength = Object.keys(savedTime).length;
  //console.log("savedTimeLength:", savedTimeLength)
  const slideItems = Array.from(sliderRef.current?.children || []);

  useEffect(() => {
    const lastSlideItem = slideItems[slideItems.length - 1];
    const slideItemLabel = lastSlideItem?.getAttribute('aria-label');
    const slideLabel = `${slides.length - 1}.slide`;
    //console.log("slideItemLabel:",slideItemLabel, " slideLabel:",slideLabel)
    console.log("currentSlide:", currentSlide)
    //console.log("slides.length-1-slidesPerView === currentSlide",slides.length-1-slidesPerView === currentSlide)
    //console.log("slideItems.length-1- slidesPerView:",slideItems.length -1- slidesPerView)

    setLastChildCompare(slideItemLabel === slideLabel);
  }, [slideItems, slides]);

  //const isMultipleOfSlidesPerView = currentSlide % slidesPerView === 0;
  //console.log("isMultipleOfSlidesPerView", isMultipleOfSlidesPerView)

  const handleClick = (direction: "prev" | "next") => {

    if (isTransitioning) return;
    setIsTransitioning(true);
    setClickCount((prev)=>prev+1)

    if (direction === "prev") {
      setIsTransitioning(true)
      //const maxIndex = slides.length -1- slidesPerView;
      setCurrentSlide((i) => Math.max(i + slidesPerView, 0));

      for (let i = 0; i < slidesPerView; i++) {
        const lastSlide = slideItems[slideItems.length -1- i];
        sliderRef.current?.insertAdjacentElement("afterbegin", lastSlide);
      }
      
      setTimeout(() => { setCurrentSlide(1) }, 500);
      setTimeout(() => setIsTransitioning(false), 500);

    } 
    else if (direction === "next") {
      console.log("isTransitioning:", isTransitioning)
      setIsTransitioning(true)
      setClickCount((prev)=>prev+1)
    
        if(lastChildCompare ) {
          console.log("if lastChildCompare is working..")
          // for (let i = 0; i <= slidesPerView-(slideItems.length%slidesPerView); i++) {
          //   console.log(" if i:",i)
          //   const addEndSlide =  slideItems[i];
          //   sliderRef.current?.insertAdjacentElement("beforeend", addEndSlide);
          // }
          setCurrentSlide((prev) => Math.min(prev + slidesPerView, slides.length-1-slidesPerView));

          if (slides.length-1-slidesPerView === currentSlide) {
            console.log("slides.length-1-slidesPerView === currentSlide is working..")
            for (let i = 0; i < slidesPerView; i++) {
              console.log(" if i:",i)
              const addEndSlide =  slideItems[i];
              sliderRef.current?.insertAdjacentElement("beforeend", addEndSlide);
            }
          setCurrentSlide((prev) => Math.min(prev + slidesPerView, slideItems.length-1-slidesPerView));

          const slideWidth = sliderWidth / slidesPerView;
          const newTransform = -currentSlide * slideWidth;
  
          if (sliderRef.current) {
            sliderRef.current.style.transition = 'none';
            sliderRef.current.style.transform = `translateX(0px)`;
            
            // Trigger transition for next set
            setTimeout(() => {
              sliderRef.current!.style.transition = 'transform 0.5s ease';
              sliderRef.current!.style.transform = `translateX(${newTransform}px)`;
            }, 500);
          }
        }
      } else {
        for (let i = 0; i < slidesPerView; i++) {
          console.log(" isn't lastChildCompare")
          const addEndSlide =  slideItems[i];
          sliderRef.current?.insertAdjacentElement("beforeend", addEndSlide);
        }
        setCurrentSlide(slideItems.length-1-slidesPerView);
        const slideWidth = sliderWidth / slidesPerView;
        const newTransform = -currentSlide * slideWidth;

        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none';
          sliderRef.current.style.transform = `translateX(0px)`;
          
          // Trigger transition for next set
          setTimeout(() => {
            sliderRef.current!.style.transition = 'transform 0.5s ease';
            sliderRef.current!.style.transform = `translateX(${newTransform}px)`;
          }, 500);
        }
      }

      const slideWidth = sliderWidth / slidesPerView;
      const newTransform = -currentSlide * slideWidth;

        if (sliderRef.current) {
          sliderRef.current.style.transition = 'none';
          sliderRef.current.style.transform = `translateX(0px)`;
          
          // Trigger transition for next set
          setTimeout(() => {
            sliderRef.current!.style.transition = 'transform 0.5s ease';
            sliderRef.current!.style.transform = `translateX(${newTransform}px)`;
          }, 500);
        }
      // else {
      //   setTimeout(() => {
      //     setCurrentSlide((prev) => Math.min(prev + slidesPerView, slideItems.length - slidesPerView));
      //   }, 10);
      // }
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderWidth / slidesPerView;
      const newTransform = -currentSlide * slideWidth;
      sliderRef.current.style.transition = isTransitioning ? 'transform  0.5s ease' : 'none';
      sliderRef.current.style.transform = `translateX(${newTransform}px)`;
    }
  }, [currentSlide, sliderWidth, slidesPerView, isTransitioning]);

  const renderSlides = slides.map((child, index) => {
    if (!React.isValidElement(child)) return null;
    // console.log(child)
    const shouldHideSlide = filterWatchedVideos && id?.[index] && !hasSavedTime(id[index]);

    return (
      <div
        key={index}
        aria-label={`${index}.slide`}
        onLoad={() => setIsContentLoaded(true)}
        style={{width: shouldHideSlide ? "0px" : `${sliderWidth / slidesPerView}px`}}
      >
        <div
          style={{ width: shouldHideSlide ? "0px" : `${sliderWidth / slidesPerView}px`}}
          className= "px-[0.5vw]"
        >
          {index}
          {child}
        </div>
      </div>
    );
  });
  
  useEffect(() => {
    if (slideItems.length > 0) {
      //console.log("Slides:", totalSlides);
      const timer = setTimeout(() => {
        //console.log("Setting isContentLoaded to true");
        setIsContentLoaded(true);
      }, 100); //delay for DOM settling
      return () => clearTimeout(timer);
    }
  }, [slideItems.length]);

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
                `${sliderButtonSection && styles.sliderButtonSectionSize} `+
                `${sliderButtonSectionTop10 && styles.sliderButtonSectionTop10Size} `+
                `${clickCount<=0 ? "hidden" : "block"}`
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
                `${sliderButtonSection && styles.sliderButtonSectionSize} `+
                `${sliderButtonSectionTop10 && styles.sliderButtonSectionTop10Size} `+
                `${
                  slides.length-1 < slidesPerView ? "hidden" 
                  : continueCard && savedTimeLength-1 < slidesPerView ? "hidden" 
                  : "block"
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
  )}