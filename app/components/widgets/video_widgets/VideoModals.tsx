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
      if (videoModalRef?.current && savedTime[id] ) {
        videoModalRef.current.currentTime = savedTime[id];
        handleVideoTimeUpdate(id, savedTime[id]);
      }
    }, [isDialogOpen]);

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
          className={videoStyle}
          loop={enableLoop}
          autoPlay={enableAutoPlay}
          controls={enableControls}
          onPlay={() => {
           handleVideoClick && handleVideoClick();
          }}
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