"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface VideoContextType {
  currentVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  continueWatchingVideoElement:  React.RefObject<HTMLVideoElement | null>;


  isActive: boolean;

  isDialogOpen: boolean; 
  setDialogOpen: (isOpen: boolean) => void; 

  isWatched: (id: number) => boolean;
  watchedVideos:number[];
  markAsWatched: (id: number, watched: boolean) => void;

  handleVideoTimeUpdate: (id: number, currentTime: number) => void;
  handleVideoEnded: (id: number) => void;
  resetSavedTime: (id: number) => void;

  hasSavedTime: (id: number) => boolean;
  savedTime: { [id: number]: number };
  //isTime: (id: number) => boolean;

  currentVideoPlay: () => void;
  currentVideoPause: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideoContext = () => {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider')
  }
  return context;
};

export const VideoProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const continueVideoElement = useRef<HTMLVideoElement | null>(null);

  //console.log("videoRef",videoRef)

  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  //console.log("isDialogOpen",isDialogOpen)
 
  //*watched video series
  const [watchedVideos, setWatchedVideos] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const savedVideos = localStorage.getItem('watchedVideos');
      return savedVideos ? JSON.parse(savedVideos) : [];
    }
    return [];
  });

  //*current play time
  const [savedTime, setSavedTime] = useState<{ [id: number]: number }>(() => {
    if (typeof window !== 'undefined') {
      const times = JSON.parse(localStorage.getItem('videoTimes') || '{}');
      return times;
    }
    return {};
  });
  //console.log("savedTime",savedTime)

  useEffect(() => {
    const storedTimes = JSON.parse(localStorage.getItem('videoTimes') || '{}');
    setSavedTime(storedTimes);
  }, []);

  //const hasSavedTime = (id: number) => Boolean(savedTime[id] && (savedTime[id] > 0 && savedTime[id] !== undefined));

  //*Time control of the video that has started to be watching
  const hasSavedTime = (id: number) => {
    const savedTimes = Object.keys(savedTime).map(Number);
    return savedTimes.includes(id);
  };

  //*Array checks the video has been watched or not and lists
  const markAsWatched = (id: number, watched: boolean = true) => {
    setWatchedVideos((prev) => {
      const isAlreadyWatched = prev.includes(id);
  
      const updatedVideos = watched
        ? isAlreadyWatched ? prev : [...prev, id]  //Add if not watched
        : prev.filter(videoId => videoId !== id);  //Remove if watched
  
      if (typeof window !== 'undefined') {
        localStorage.setItem('watchedVideos', JSON.stringify(updatedVideos));
      }
      return updatedVideos;
    });
  };

  //*Control of videos watched
  const isWatched = (id: number) => watchedVideos?.includes(id);

  //*Resetting the watch time when the video is finished watching
  const resetSavedTime = (id: number) => {
    setSavedTime(prev => {
      const updatedTimes = { ...prev, [id]: 0 };
      localStorage.setItem('videoTimes', JSON.stringify(updatedTimes));
      return updatedTimes;
    });
  };
 
  const handleVideoTimeUpdate = (id: number, currentTime:number) => {
    if (continueVideoElement?.current) {
      
      localStorage.setItem(`videoTimes`, currentTime.toString());
      setSavedTime((prev) => {
        const updatedTimes = { ...prev, [id]: currentTime };
        if (typeof window !== 'undefined') {
          localStorage.setItem('videoTimes', JSON.stringify(updatedTimes));
        }
        return updatedTimes;
      });
      //console.log(`${id}`,currentTime)
    }
  };

  //console.log(`Context --, Current : ${videoRef?.current}`);
  // useEffect(() => {
  //   console.log('Exposed video element:', videoRef.current);
  // }, [videoRef]);

  const handleVideoEnded = (id: number) => {
    markAsWatched(id, true); // Mark the video as watched
    setSavedTime(prev => {
      const updatedTimes = { ...prev };
      delete updatedTimes[id]; // Remove saved time for completed video
      localStorage.setItem('videoTimes', JSON.stringify(updatedTimes));
      return updatedTimes;
    });
  };

  const currentVideoPlay = () => {
    //console.log("play");
    setIsActive(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const currentVideoPause = () => {
    //console.log("pause");
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  //console.log("active",isActive)
  //console.log("videoRef",videoRef.current)

  return (
    <VideoContext.Provider 
      value={{ 
        currentVideoRef: videoRef,
        continueWatchingVideoElement: continueVideoElement,
        isActive,
        currentVideoPlay, 
        currentVideoPause, 
        isDialogOpen, 
        setDialogOpen: setIsDialogOpen,
        watchedVideos, 
        markAsWatched,
        isWatched,
        handleVideoTimeUpdate,
        handleVideoEnded,
        resetSavedTime,
        savedTime,
        hasSavedTime,
        // isTime
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

