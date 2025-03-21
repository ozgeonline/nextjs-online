"use client"

import React, { forwardRef, useImperativeHandle } from "react";
import MovieButtons from "./MovieVideoButtons"
import VideoModal from "./VideoModals";
import { useVideoContext } from "../../providers/VideoContext";
import { MovieProps } from "@/app/types/props";
import styles from "./video.module.css"

const MovieVideo = forwardRef<HTMLVideoElement, MovieProps>(({
  ...movieProps
},ref) => {

  const { currentVideoRef} = useVideoContext();
  useImperativeHandle(ref, () => {
    if (currentVideoRef.current) {
      return currentVideoRef.current;
    } else {
      throw new Error("currentVideoRef.current is null");
    }
  });
  //console.log("currentVideoRef",currentVideoRef)

  return (
    <div className="flex justify-start items-center w-full h-auto relative">
      <div className="flex relative top-0 left-0 w-full h-[80vw] md:h-[75vh] lg:h-[110vh]">
        <VideoModal
          ref={currentVideoRef}
          id={movieProps.id as number}
          imageString={movieProps.imageString as string}
          source={movieProps.videoSource as string}
          alt={`${movieProps.title}-video player home page`}
          videoStyle="w-full h-full absolute top-0 left-0 object-cover -z-50 brightness-[60%]"
          isCurrentMovieVideo={true}
          enableLoop={true}
          enableAutoPlay={true}
          enableControls={false}
        />
        <div 
          className="
            w-full absolute left-0 bottom-0 h-14 -z-10 
            bg-gradient-to-b from-transparent via-background/70 via-25% to-background/100"
        ></div>
      </div>

      {/* video content info */}
      <div className={styles['content-info'] + " " + "space-y-1 lg:space-y-4"}>
        <p className="text-white text-[5vw] sm:text-[3vw] line-clamp-1 font-bold">
          {movieProps.title}
        </p>
        <p className="hidden lg:line-clamp-2 text-white text-sm sm:text-lg ">
          {movieProps.overview}
        </p>
        <div className="relative">
          <MovieButtons {...movieProps} />
        </div>
      </div>
    </div>
  )
})

MovieVideo.displayName = 'MovieVideo';
export default MovieVideo;