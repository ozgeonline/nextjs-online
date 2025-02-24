"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface VideoContextType {
  currentVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  continueWatchingVideoElement:  React.RefObject<HTMLVideoElement | null>;

  isActive: boolean;

  isDialogOpen: boolean; 
  setDialogOpen: (isOpen: boolean) => void; 

  watchedVideos:number[];
  markAsWatched: (id: number, watched: boolean) => void;

  handleVideoTimeUpdate: (id: number, currentTime: number) => void;
  handleVideoEnded: (id: number) => void;
  resetSavedTime: (id: number) => void;

  hasSavedTime: (id: number) => boolean;
  savedTime: { [id: number]: number };

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
  // useEffect(() => {
  //   console.log("video element: ", videoRef.current);
  // }, [videoRef]);
  
  const continueVideoElement = useRef<HTMLVideoElement | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  //console.log("active",isActive)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  //console.log("isDialogOpen",isDialogOpen)

  //********* watched video series
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);

  //********* current play time
  const [savedTime, setSavedTime] = useState<{ [id: number]: number }>({});
  // useEffect(() => {
  //   console.log("savedTime: ", savedTime);
  // }, [savedTime]);

  //! ********* After the component is connected, localStorage data is loaded to eliminate client-server incompatibilities.
  useEffect(() => {
    const savedVideos = localStorage.getItem('watchedVideos');
    if (savedVideos) {
      setWatchedVideos(JSON.parse(savedVideos));
    }

    //* Times recorded in localStorage will be saved.
    const times = localStorage.getItem('videoTimes');
    if (times) {
      setSavedTime(JSON.parse(times));
    }
  }, []);

  //! ********* Time control of the video that has started to be watching
  const hasSavedTime = (id: number) => {
    const savedTimes = Object.keys(savedTime).map(Number);
    //console.log("savedTimes", savedTimes)
    return savedTimes.includes(id);
  };

  //! ********* Array checks the video has been watched or not and lists
  const markAsWatched = (id: number, watched: boolean = true) => {
    setWatchedVideos((prev) => {
      const isAlreadyWatched = prev.includes(id);
  
      const updatedVideos = watched
        ? isAlreadyWatched ? prev : [...prev, id]  //Add if not watched
        : prev.filter(videoId => videoId !== id);  //Remove if watched
  
      localStorage.setItem('watchedVideos', JSON.stringify(updatedVideos));
      return updatedVideos;
    });
  };

  //********* Control of videos watched
  // const isWatched = (id: number) => watchedVideos?.includes(id);

  //! ********* Resetting the watch time when the video is finished watching
  const resetSavedTime = (id: number) => {
    setSavedTime(prev => {
      const updatedTimes = { ...prev, [id]: 0 };
      localStorage.setItem('videoTimes', JSON.stringify(updatedTimes));
      return updatedTimes;
    });
  };
 
  const handleVideoTimeUpdate = (id: number, currentTime: number) => {
    setSavedTime((prev) => {
      if (prev[id] === currentTime) return prev;
      const updatedTimes = { ...prev, [id]: currentTime };
      localStorage.setItem('videoTimes', JSON.stringify(updatedTimes));
      return updatedTimes;
    });
  };

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
    setIsActive(true);
    if (videoRef.current) {
      try {
         videoRef.current.play();
        //console.log("Video is playing");
      } catch (error) {
        console.error("Failed to play video:", error);
      }
    }
  };

  const currentVideoPause = () => {
    setIsActive(false);
    videoRef?.current?.pause();
  };

  

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
        handleVideoTimeUpdate,
        handleVideoEnded,
        resetSavedTime,
        savedTime,
        hasSavedTime
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};