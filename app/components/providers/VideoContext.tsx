"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

const WATCHED_VIDEOS_STORAGE_KEY = "watchedVideos";
const VIDEO_TIMES_STORAGE_KEY = "videoTimes";
const VIDEO_TIME_SAVE_INTERVAL_SECONDS = 5;

function readNumberArrayFromStorage(key: string) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return [];

    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is number => typeof item === "number")
      : [];
  } catch {
    return [];
  }
}

// Reads and sanitizes saved playback seconds by movie id.
function readVideoTimesFromStorage(key: string) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return {};

    const parsedValue = JSON.parse(value);

    if (!parsedValue || typeof parsedValue !== "object" || Array.isArray(parsedValue)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue)
        .filter(([, value]) => typeof value === "number")
        .map(([id, value]) => [Number(id), value])
        .filter(([id]) => Number.isFinite(id)),
    ) as Record<number, number>;
  } catch {
    return {};
  }
}

function writeStorageValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore client storage failures so playback controls keep working.
  }
}

function isAbortPlaybackError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

interface VideoContextType {
  currentVideoRef: React.MutableRefObject<HTMLVideoElement | null>;

  isActive: boolean;

  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;

  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;

  watchedVideos: number[];
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

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSavedSecondRef = useRef<Record<number, number>>({});

  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlayToggle] = useState<boolean>(false);

  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
  const [savedTime, setSavedTime] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    setWatchedVideos(readNumberArrayFromStorage(WATCHED_VIDEOS_STORAGE_KEY));
    setSavedTime(readVideoTimesFromStorage(VIDEO_TIMES_STORAGE_KEY));
  }, []);

  const hasSavedTime = useCallback((id: number) => (savedTime[id] ?? 0) > 0, [savedTime]);

  const markAsWatched = useCallback((id: number, watched: boolean = true) => {
    setWatchedVideos((prev) => {
      const isAlreadyWatched = prev.includes(id);

      const updatedVideos = watched
        ? isAlreadyWatched ? prev : [...prev, id]
        : prev.filter(videoId => videoId !== id);

      writeStorageValue(WATCHED_VIDEOS_STORAGE_KEY, updatedVideos);
      return updatedVideos;
    });
  }, []);

  const resetSavedTime = useCallback((id: number) => {
    setSavedTime(prev => {
      const updatedTimes = { ...prev };
      delete updatedTimes[id];
      writeStorageValue(VIDEO_TIMES_STORAGE_KEY, updatedTimes);
      return updatedTimes;
    });
  }, []);

  const handleVideoTimeUpdate = useCallback((id: number, currentTime: number) => {
    const roundedTime = Math.floor(currentTime);
    const lastSavedSecond = lastSavedSecondRef.current[id] ?? 0;

    if (
      roundedTime <= 0 ||
      roundedTime === lastSavedSecond ||
      roundedTime - lastSavedSecond < VIDEO_TIME_SAVE_INTERVAL_SECONDS
    ) {
      return;
    }

    lastSavedSecondRef.current[id] = roundedTime;

    setSavedTime((prev) => {
      if (roundedTime <= 0 || prev[id] === roundedTime) return prev;

      const updatedTimes = { ...prev, [id]: roundedTime };
      writeStorageValue(VIDEO_TIMES_STORAGE_KEY, updatedTimes);
      return updatedTimes;
    });
  }, []);

  const handleVideoEnded = useCallback((id: number) => {
    markAsWatched(id, true);
    setSavedTime(prev => {
      const updatedTimes = { ...prev };
      delete updatedTimes[id];
      writeStorageValue(VIDEO_TIMES_STORAGE_KEY, updatedTimes);
      return updatedTimes;
    });
  }, [markAsWatched]);

  const currentVideoPlay = useCallback(() => {
    setIsActive(true);
    const video = videoRef.current;

    if (!video || !video.paused) {
      return;
    }

    video.play().catch((error) => {
      if (!isAbortPlaybackError(error)) {
        console.error("Failed to play video:", error);
      }
    });
  }, []);

  const currentVideoPause = useCallback(() => {
    setIsActive(false);
    const video = videoRef.current;

    if (video && !video.paused) {
      video.pause();
    }
  }, []);

  const value = useMemo<VideoContextType>(() => ({
    currentVideoRef: videoRef,
    isActive,
    currentVideoPlay,
    currentVideoPause,
    isDialogOpen,
    setDialogOpen: setIsDialogOpen,
    isPlaying,
    setIsPlaying: setIsPlayToggle,
    watchedVideos,
    markAsWatched,
    handleVideoTimeUpdate,
    handleVideoEnded,
    resetSavedTime,
    savedTime,
    hasSavedTime
  }), [
    currentVideoPause,
    currentVideoPlay,
    handleVideoEnded,
    handleVideoTimeUpdate,
    hasSavedTime,
    isActive,
    isDialogOpen,
    isPlaying,
    markAsWatched,
    resetSavedTime,
    savedTime,
    watchedVideos,
  ]);

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};
