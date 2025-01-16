"use client"

import { MovieProps } from "@/app/types/props";
import { useEffect, useState } from "react";
import styles from "./card.module.css";
import PreviewCard from './PreviewCard';
import { useCardContext } from '@/app/components/providers/CardContext';

interface top10Props extends MovieProps {
  index:number
}
export default function Top10TVShows({
  index,
  ...movieProps
}: top10Props) {

  const [svgDataArray, setSvgDataArray] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const [svgData] = await Promise.all([
        import("@/app/data/SvgData"),
      ]);

      setSvgDataArray(svgData.default);
      setIsLoading(false);
    };

    fetchData();
    
  }, []);

  // if (isLoading) return null;

  const { setIsHover } = useCardContext();
  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <div 
      className={`${styles.top10cardWrapper} relative flex`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} 
      aria-label={`${movieProps.movieId}.poster`}
    >
      {!isLoading && (
        <svg
          id={svgDataArray[index].id}
          width={svgDataArray[index].width}
          height={svgDataArray[index].height}
          viewBox={svgDataArray[index].viewBox}
          className={`${svgDataArray[index].className}`}
        >
          <path
            stroke={svgDataArray[index].stroke}
            strokeLinejoin={svgDataArray[index].strokeLinejoin}
            strokeWidth={svgDataArray[index].strokeWidth}
            d={svgDataArray[index].pathData}
          ></path>
        </svg>
      )}
      
      <PreviewCard
        {...movieProps}
        imageStyle="rounded-e-sm"
        top10Wrapper={true}
      />
    </div>
  )
}