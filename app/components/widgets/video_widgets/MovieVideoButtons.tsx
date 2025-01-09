"use client"

import { InfoIcon, Play } from "lucide-react"
import ShowDialogButton from "../../controls/button/action/ShowDialogButton"
import { MovieProps } from "@/app/types/props"
import styles from "./video.module.css"

export default function MovieButtons({ ...movieProps}: MovieProps) {
  return (
    <div className="flex text-[3vw] sm:text-lg font-semibold">
      <ShowDialogButton
        {...movieProps}
       
        buttonStyle={`
          ${styles.movieButtons}
          text-black bg-white me-3 hover:brightness-90
          w-[15vw] sm:w-[12vw] md:w-[10vw] lg:w-[8vw]
        `}
      >
        <Play 
          className="size-[3vw] sm:size-[2vw] me-[0.75vw] rounded-full fill-inherit" 
          aria-label="more info button"
        />
        Play
      </ShowDialogButton>

      <div
        className={`
          ${styles.movieButtons}
          bg-neutral-500/70 hover:bg-neutral-400/50 
          w-[24vw] sm:w-[17vw] lg:w-[12vw] cursor-not-allowed
        `}
      >
        <InfoIcon
          className="size-[3vw] sm:size-[2vw] me-2"
          aria-label="more info button"
        />
        More Info
      </div>
    </div>
  )
}