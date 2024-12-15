"use client"

import React, { forwardRef, useImperativeHandle } from "react";
import MovieButtons from "./MovieVideoButtons"
import VideoModal from "./VideoModals";
import { useVideoContext } from "../../providers/VideoContext";
import { MovieProps } from "@/app/types/props";
import styles from "./video.module.css"

interface videoProps extends MovieProps {
  id:number
}

const MovieVideo = forwardRef<HTMLVideoElement, videoProps>((
  {
  id,
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
    <div className="flex justify-start items-center w-full h-auto">
      <div className="flex relative top-0 left-0 w-full h-[80vw] md:h-[75vh] lg:h-[110vh]">
        <VideoModal
          ref={currentVideoRef}
          id={id}
          imageString={movieProps.imageString ?? ""}
          source={movieProps.videoSource ?? ""}
          alt={`${movieProps.title}-video player home page`}
          videoStyle="w-full h-full absolute top-0 left-0 object-cover -z-20 brightness-[60%]"
          isMovieVideo={true}
          enableControls={false}
          enableAutoPlay={true}
          enableLoop={true}
          enableTimeUpdate={false}
          enablePlay={false}
          enableEnded={false}
          // enableLoadedMetadata={false}
        />
        <div 
          className="w-full absolute left-0 bottom-0 h-20 -z-10 bg-gradient-to-b from-transparent bg-main-dark/95 to-main-dark"
        ></div>
      </div>

      {/* video content info */}
      <div
        className={`
          ${styles['content-info']} space-y-1 lg:space-y-4
        `}
      >
        <p className="text-white text-[5vw] sm:text-[3vw] line-clamp-1 font-bold">
          {movieProps.title}
        </p>
        <p className="hidden lg:line-clamp-2 text-white text-sm sm:text-lg ">
          {movieProps.overview}
        </p>
        <div className="relative">
          <MovieButtons
            {...movieProps}
          />
        </div>
      </div>
    </div>
  )
})

MovieVideo.displayName = 'MovieVideo';
export default MovieVideo;