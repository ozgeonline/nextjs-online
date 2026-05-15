"use client"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useVideoContext } from '@/app/components/providers/VideoContext';
import VideoModals from '@/app/components/widgets/video_widgets/VideoModals';
import styles from "./card.module.css";
//import MuteToggleButton from '@/app/components/controls/button/action/MuteToggleButton';
//import PlayToggleButton from '@/app/components/controls/button/action/PlayToggleButton';
//import ProgressBar from '@/app/components/controls/button/action/ProgressBar';

const MuteToggleButton = dynamic(() => import('@/app/components/controls/button/action/MuteToggleButton'));
const PlayToggleButton = dynamic(() => import('@/app/components/controls/button/action/PlayToggleButton'));
const ProgressBar = dynamic(() => import('@/app/components/controls/button/action/ProgressBar'));

interface VideoPlayerProps {
  movieId:number;
  imageString: string;
  videoSource: string;
  title:string;
  alt: string;
}

const ContinueWatchingCardModal = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {

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

  const handleVideoClick = useCallback(() => {
    const allVideos = document.querySelectorAll('video.continueVideo') as NodeListOf<HTMLVideoElement>;

    allVideos.forEach((video) => {
      video.dataset.movieId = video.dataset.movieId || String(props.movieId);
      
      if (video instanceof HTMLVideoElement && video.dataset.movieId !== String(props.movieId) && !isDialogOpen) {
        video.pause();
      }
    });
  }, [isDialogOpen, props.movieId]);

  return (
    <div className="z-50 relative">
      {savedTime[props.movieId as number] > 0 && (
        <VideoModals
          ref={localVideoRef  as React.RefObject<HTMLVideoElement>}
          id={props.movieId as number}
          enableLoop={false}
          enableAutoPlay={false}
          enableControls={false}
          isCurrentMovieVideo={false}
          imageString={props.imageString as string}
          source={props.videoSource as string}
          alt={props.title as string}
          videoStyle={`
            ${styles.cardSize + ' ' + styles.continueVideoSyle} 
            continueVideo 
          `}
          handleVideoClick={handleVideoClick}
        >
          <PlayToggleButton 
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            id={props.movieId as number}
            playIconStyle='fill-white '
            playButtonPosition={styles.playButtonPosition}
          />
          <MuteToggleButton 
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            buttonStyle={styles.muteButtonStyle}
          />
          <ProgressBar
            videoModalRef={localVideoRef as React.RefObject<HTMLVideoElement>}
            id={props.movieId as number}
            progressStyle={styles.progressBar}
          />
        </VideoModals>
      )}
    </div>
  );
});

ContinueWatchingCardModal.displayName = "ContinueWatchingCardModal";
export default ContinueWatchingCardModal;

