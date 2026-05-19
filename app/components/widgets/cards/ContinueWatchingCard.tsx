"use client"

import { memo, useEffect, useRef } from 'react';
import { useVideoContext } from '@/app/components/providers/VideoContext';
import VideoModals from '@/app/components/widgets/video_widgets/VideoModals';
import MuteToggleButton from '@/app/components/controls/video/MuteToggleButton';
import PlayToggleButton from '@/app/components/controls/video/PlayToggleButton';
import ProgressBar from '@/app/components/controls/video/ProgressBar';
import styles from "./cards.module.css";

interface ContinueWatchingCardProps {
  movieId: number;
  imageString: string;
  videoSource: string;
  title: string;
}

function ContinueWatchingCard({
  movieId,
  imageString,
  videoSource,
  title,
}: ContinueWatchingCardProps) {
  const {
    savedTime,
    isDialogOpen,
    setIsPlaying
  } = useVideoContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isDialogOpen && localVideoRef.current && !localVideoRef.current.paused) {
      localVideoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isDialogOpen, setIsPlaying]);

  const hasSavedTime = savedTime[movieId] > 0;

  if (!hasSavedTime) {
    return null;
  }

  return (
    <div className="z-50 relative">
      <VideoModals
        ref={localVideoRef}
        id={movieId}
        enableLoop={false}
        enableAutoPlay={false}
        enableControls={false}
        isCurrentMovieVideo={false}
        imageString={imageString}
        source={videoSource}
        alt={`${title} continue watching video`}
        videoStyle={`
          ${styles.cardSize} ${styles.continueVideoStyle} 
          continueWatchingVideo 
        `}
      >
        <PlayToggleButton
          videoModalRef={localVideoRef}
          id={movieId}
          playIconStyle="fill-white"
          playButtonPosition={styles.playButtonPosition}
          pauseOtherVideosSelector="video.continueWatchingVideo"
        />
        <MuteToggleButton
          videoModalRef={localVideoRef}
          buttonStyle={styles.muteButtonStyle}
        />
        <ProgressBar
          videoModalRef={localVideoRef}
          id={movieId}
          progressStyle={styles.progressBar}
        />
      </VideoModals>
    </div>
  );
}

export default memo(ContinueWatchingCard);
