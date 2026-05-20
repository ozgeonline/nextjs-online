"use client";
import React, { useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { useVideoContext } from '@/app/components/providers/VideoContext';

type VideoProps = {
  id:number;
  imageString: string;
  source: string;
  alt: string;
  videoStyle: string;
  enableControls:boolean;
  enableAutoPlay:boolean;
  enableLoop:boolean;
  isCurrentMovieVideo: boolean;
  preload?: "none" | "metadata" | "auto";
  children?:React.ReactNode;
  handleVideoClick?:() => void;
};

const VideoModal = forwardRef<HTMLVideoElement, VideoProps>((
  { 
    id,
    imageString, 
    source, 
    alt, 
    videoStyle,
    enableControls,
    enableAutoPlay = false,
    enableLoop,
    isCurrentMovieVideo=true,
    preload = "metadata",
    children,
    handleVideoClick
  }, ref) => {
    
    const {
      markAsWatched,
      handleVideoTimeUpdate,
      handleVideoEnded,
      savedTime,
      isDialogOpen
    } = useVideoContext();

    const videoModalRef =useRef<HTMLVideoElement | null>(null);
    useImperativeHandle(ref, () => videoModalRef.current as HTMLVideoElement);
    
    // console.log("videoModalRef",videoModalRef.current)
    // console.log("currentVideoRef",currentVideoRef.current)
    //console.log("active",isActive)

    useEffect(() => {
      const video = videoModalRef.current;
      const resumeTime = savedTime[id] ?? 0;

      if (!video || resumeTime <= 0) return;

      const seekToSavedTime = () => {
        const safeResumeTime = Number.isFinite(video.duration)
          ? Math.min(resumeTime, Math.max(video.duration - 1, 0))
          : resumeTime;

        video.currentTime = safeResumeTime;
        handleVideoTimeUpdate(id, safeResumeTime);
      };

      if (video.readyState >= video.HAVE_METADATA) {
        seekToSavedTime();
        return;
      }

      video.addEventListener("loadedmetadata", seekToSavedTime, { once: true });

      return () => {
        video.removeEventListener("loadedmetadata", seekToSavedTime);
      };
    }, [handleVideoTimeUpdate, id, savedTime, isDialogOpen]);

    const handleEnded = () => {
      markAsWatched(id, true);
      handleVideoEnded(id);
    };

    const handleTimeUpdate = () => {
      if (videoModalRef?.current && !isCurrentMovieVideo) {
        //console.log(`${id}`,"Time Update Triggered", videoModalRef.current.currentTime);
        const updateTime = videoModalRef.current.currentTime;
        handleVideoTimeUpdate(id, updateTime);
      }
    };

    // console.log(`VideoModals-onPlay triggered for video: ${id}`);
    return (
      <React.Fragment>
        <video
          ref={videoModalRef}
          poster={imageString}
          aria-label={alt}
          muted
          playsInline
          preload={preload}
          className={videoStyle}
          loop={enableLoop}
          autoPlay={enableAutoPlay}
          controls={enableControls}
          onPlay={() => handleVideoClick?.()}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          data-movie-id={String(id)}
        >
          <source src={source} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {children}
      </React.Fragment>
   );
  })

VideoModal.displayName = 'VideoModal';
export default VideoModal;
