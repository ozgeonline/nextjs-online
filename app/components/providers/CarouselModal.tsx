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
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState(0)
  // const [isLoading, setIsLoading] = useState(true);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const { isHover } = useCardContext();
  const { hasSavedTime, savedTime } = useVideoContext();
  const { sliderWidth, slidesPerView } = CarouselBreakpointSettings(sliderRef);

  const savedTimeLength = Object.keys(savedTime).length;
  //console.log("savedTimeLength:", savedTimeLength)
    
  const totalSlides = slides.length;
  const handleClick = (direction: "prev" | "next") => {
    setClickCount((prev)=>prev+1)
    //console.log(clickCount)
    if (isTransitioning) return;

    //console.log(totalSlides)
    
    const slideItems = Array.from(sliderRef.current?.children || []);
    //console.log(slideItems)

    setIsTransitioning(true);

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

    } else if (direction === "next") {
      setIsTransitioning(true)
      const maxIndex = slides.length -1- slidesPerView;
      setCurrentSlide((i) => Math.min(i + slidesPerView, maxIndex));
      
      for (let i = 0; i < slidesPerView; i++) {
        const addEndSlide = slideItems[i];
        sliderRef.current?.insertAdjacentElement("beforeend", addEndSlide);
        //console.log("beforeend i+",i)
      }

      setTimeout(() => {
        setCurrentSlide(1);
      }, 500);
      setTimeout(() => setIsTransitioning(false), 500);
      //console.log("addEndSlide",addEndSlide)
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

  // useEffect(()=> {
  //   console.log("isContentLoaded:",isContentLoaded)
  // },[isContentLoaded])

  const renderSlides = slides.map((child, index) => {
    if (!React.isValidElement(child)) return null;
    // console.log(child)
    const shouldHideSlide = filterWatchedVideos && id?.[index] && !hasSavedTime(id[index]);

    return (
      <div
        key={index}
        aria-label={`${id?.[index] && id[index]} : carousel slide`}
        onLoad={() => setIsContentLoaded(true)}
        style={{width: shouldHideSlide ? "0px" : `${sliderWidth / slidesPerView}px`}}
      >
        <div
          style={{ width: shouldHideSlide ? "0px" : `${sliderWidth / slidesPerView}px`}}
          className= "px-[0.5vw]"
        >
          {child}
        </div>
      </div>
    );
  });
  
  useEffect(() => {
    if (totalSlides > 0) {
      //console.log("Slides:", totalSlides);
      const timer = setTimeout(() => {
        //console.log("Setting isContentLoaded to true");
        setIsContentLoaded(true);
      }, 100); //delay for DOM settling
      return () => clearTimeout(timer);
    }
  }, [totalSlides]);

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
        { isContentLoaded &&(
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
  )
}