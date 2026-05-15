"use client"

import { MovieProps } from "@/app/types/props";
import styles from "./card.module.css";
import PreviewCard from './PreviewCard';
import { useCardContext } from '@/app/components/providers/CardContext';
import svgDataList from "@/app/data/SvgData";

interface top10Props extends MovieProps {
  index:number
}

export default function Top10TVShows({
  index,
  ...movieProps
}: top10Props) {
  const { setIsHover } = useCardContext();
  const svgData = svgDataList[index];

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  if (!svgData) return null;

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
