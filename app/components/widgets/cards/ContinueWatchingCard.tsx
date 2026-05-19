"use client"
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useVideoContext } from '@/app/components/providers/VideoContext';
import VideoModals from '@/app/components/widgets/video_widgets/VideoModals';
import styles from "./cards.module.css";

const MuteToggleButton = dynamic(() => import('@/app/components/controls/video/MuteToggleButton'));
const PlayToggleButton = dynamic(() => import('@/app/components/controls/video/PlayToggleButton'));
const ProgressBar = dynamic(() => import('@/app/components/controls/video/ProgressBar'));

interface VideoPlayerProps {
  movieId: number;
  imageString: string;
  videoSource: string;
  title: string;
}

const ContinueWatchingCard = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {

  const {
    continueWatchingVideoElement,
    setContinueWatchingVideoElement,
    savedTime,
    isDialogOpen,
    setIsPlaying
  } = useVideoContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(ref, () => localVideoRef.current as HTMLVideoElement);

  useEffect(() => {
    if (isDialogOpen && localVideoRef.current && !localVideoRef.current.paused) {
      localVideoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isDialogOpen, setIsPlaying]);

  useEffect(() => {
    if (localVideoRef.current && continueWatchingVideoElement.current !== localVideoRef.current) {
      setContinueWatchingVideoElement(localVideoRef.current);
    }
  }, [continueWatchingVideoElement, setContinueWatchingVideoElement]);

  return (
    <div className="z-50 relative">
      {savedTime[props.movieId] > 0 && (
        <VideoModals
          ref={localVideoRef as React.RefObject<HTMLVideoElement>}
          id={props.movieId}
          enableLoop={false}
          enableAutoPlay={false}
          enableControls={false}
          isCurrentMovieVideo={false}
          imageString={props.imageString}
          source={props.videoSource}
          alt={`${props.title} continue watching video`}
          videoStyle={`
            ${styles.cardSize + ' ' + styles.continueVideoStyle} 
            continueWatchingVideo 
          `}
        >
          <PlayToggleButton 
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            id={props.movieId}
            playIconStyle='fill-white '
            playButtonPosition={styles.playButtonPosition}
            pauseOtherVideosSelector="video.continueWatchingVideo"
          />
          <MuteToggleButton 
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            buttonStyle={styles.muteButtonStyle}
          />
          <ProgressBar
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            id={props.movieId}
            progressStyle={styles.progressBar}
          />
        </VideoModals>
      )}
    </div>
  );
});

ContinueWatchingCard.displayName = "ContinueWatchingCard";
export default ContinueWatchingCard;

