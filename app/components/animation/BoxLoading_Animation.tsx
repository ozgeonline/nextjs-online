"use client"
import { CarouselBreakpointSettings } from '../widgets/useCarouselBreakpointSettings';
import {  useRef } from "react";
import styles from "./animation.module.css"

export default function BoxLoading_Animation() {
  const boxRef = useRef<HTMLDivElement>(null);
  const { sliderWidth, slidesPerView } = CarouselBreakpointSettings(boxRef);

  return (
    <div 
      ref={boxRef}
      className='flex justify-start h-[100vh] w-full pt-[20vh]'
    >
      <div className="flex whitespace-nowrap relative h-auto w-auto">
        {[...Array(7)].map((_, index) => (
          <div 
            key={index} 
            className='px-[0.4vw] *:rounded-sm'
            style={{ 
              width: `${sliderWidth / slidesPerView}px`,
              animationDelay: `${index * 0.1}s`,
              transitionDelay: "0.5s"
            }}
          >
            <div
              key={index} 
              className={`
                ${styles['animate-box']} 
                ${styles['boxSize']}
              `} 
              style={{ 
                animationDelay: `${index * 0.1}s`,
                transitionDelay: "0.5s"
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
};