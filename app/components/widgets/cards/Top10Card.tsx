"use client"

import { memo } from "react";
import { MovieProps } from "@/app/types/props";
import styles from "./cards.module.css";
import PreviewCard from './PreviewCard';
import svgDataList from "@/app/data/SvgData";

interface Top10CardProps extends MovieProps {
  index: number
}

function Top10Card({
  index,
  ...movieProps
}: Top10CardProps) {
  const svgData = svgDataList[index];

  if (!svgData) return null;

  return (
    <div 
      className={`${styles.top10cardWrapper} relative flex`}
      aria-label={`${movieProps.title ?? "Movie"} top 10 poster card`}
    >
      <svg
        aria-hidden="true"
        id={svgData.id}
        width={svgData.width}
        height={svgData.height}
        viewBox={svgData.viewBox}
        className={svgData.className}
      >
        <path
          stroke={svgData.stroke}
          strokeLinejoin={svgData.strokeLinejoin}
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

export default memo(Top10Card);
