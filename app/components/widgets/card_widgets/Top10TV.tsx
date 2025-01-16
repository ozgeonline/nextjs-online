"use client"

import { MovieProps } from "@/app/types/props";
import { useEffect, useState } from "react";
import styles from "./card.module.css";
import PreviewCard from './PreviewCard';
import { useCardContext } from '@/app/components/providers/CardContext';
import { SvgData } from "@/app/data/SvgData";

interface top10Props extends MovieProps {
  index:number
}

export default function Top10TVShows({
  index,
  ...movieProps
}: top10Props) {

  const [svgDataArray, setSvgDataArray] = useState<SvgData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setIsHover } = useCardContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const svgDataModule = await import("@/app/data/SvgData");
        setSvgDataArray(svgDataModule.default);
      } catch (error) {
        console.error("Error loading SVG data:", error);
        setSvgDataArray([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !svgDataArray || !svgDataArray[index]) {
    return <div className={styles.top10cardWrapper}>Loading box...</div>;
  }

  const svgData = svgDataArray[index]; 

  // if (isLoading) return null;

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <div 
      className={`${styles.top10cardWrapper} relative flex`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} 
      aria-label={`${movieProps.movieId}.poster`}
    >
      <svg
        id={svgData.id}
        width={svgData.width}
        height={svgData.height}
        viewBox={svgData.viewBox}
        className={svgData.className}
      >
        <path
          stroke={svgData.stroke}
          strokeLinejoin={svgData.strokeLinejoin as "miter" | "round" | "bevel" | "inherit"}
          strokeWidth={svgData.strokeWidth}
          d={svgData.pathData}
        />
      </svg>
      
      <PreviewCard
        {...movieProps}
        imageStyle="rounded-e-sm"
        top10Wrapper={true}
      />
    </div>
  )
}