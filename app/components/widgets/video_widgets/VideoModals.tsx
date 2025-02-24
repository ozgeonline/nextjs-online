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
  }, ref) => {
    
    const { 
      isActive,
      currentVideoRef,
      currentVideoPause,
      currentVideoPlay,
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

    useEffect(() => {
      const handlePause = () => {
        if (videoModalRef?.current && currentVideoRef?.current  && !isActive) {
          currentVideoRef.current?.pause();
          currentVideoPause();
        }
        //console.log("paused video")
      };

      const playCurrentVideo = () => {
        if (videoModalRef?.current && currentVideoRef?.current && isActive) {
          currentVideoRef.current?.play();
          currentVideoPlay();
        }
        //console.log("Play current video")
      };
  
      handlePause();
      playCurrentVideo();
  
      const videoElement = videoModalRef.current;
      if (videoElement) {
        videoElement.addEventListener('play', playCurrentVideo);
        videoElement.addEventListener('pause', handlePause);
        if(!isCurrentMovieVideo) {
          videoElement.addEventListener('ended', handleEnded);
          videoElement.addEventListener('timeupdate', handleTimeUpdate);
        }
      }

      return () => {
        if (videoElement) {
          videoElement.removeEventListener('play', playCurrentVideo);
          videoElement.removeEventListener('pause', handlePause);
          if(!isCurrentMovieVideo) {
            videoElement.removeEventListener('ended', handleEnded);
            videoElement.removeEventListener('timeupdate', handleTimeUpdate);
          }
        }
      };
    }, [currentVideoPause, currentVideoPlay]);
  
    const handleVideoClick = () => {
      const allVideos = document.querySelectorAll('.continueVideo') as NodeListOf<HTMLVideoElement>;
      //console.log(allVideos);

      allVideos.forEach((video: HTMLVideoElement) => {
        if (video !== videoModalRef.current && !isDialogOpen) {
          video.pause();
          video.currentTime = video.currentTime; //forces ui update
          //console.log("Paused other videos");
        }
      });
    };

    return (
      <>
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
          onPlay={handleVideoClick}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          <source src={source} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </>
   );
  })

VideoModal.displayName = 'VideoModal';
export default VideoModal;