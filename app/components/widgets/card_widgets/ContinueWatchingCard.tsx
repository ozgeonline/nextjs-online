"use client"

import { useVideoContext } from '../../providers/VideoContext';
import VideoModals from '../video_widgets/VideoModals';
import styles from "./card.module.css"
import { forwardRef, useImperativeHandle } from 'react';

interface VideoPlayerProps {
  movieId:number;
  imageString: string;
  videoSource: string;
  title:string;
  alt: string;
}

const ContinueWatchingCardModal = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {

  const { continueWatchingVideoElement, savedTime } = useVideoContext();
  useImperativeHandle(ref, () => continueWatchingVideoElement.current || ({} as HTMLVideoElement));

  // console.log("continueWatchingVideoElement",continueWatchingVideoElement.current)
  // console.log("savedTime",savedTime)

  return (
    <div className="mt-12 z-50">
      {savedTime[props.movieId as number] > 0 && (
        <VideoModals
          ref={continueWatchingVideoElement  as React.RefObject<HTMLVideoElement>}
          id={props.movieId as number}
          enableLoop={false}
          enableAutoPlay={false}
          enableControls={true}
          isCurrentMovieVideo={false}
          imageString={props.imageString as string}
          source={props.videoSource as string}
          alt={props.title as string}
          videoStyle={`
            ${styles.cardSize} 
            z-50 continueVideo w-full object-cover rounded-sm flex overflow-hidden
          `}
        />
      )}
      {/* for update check */}
      {/* <div>
        {savedTime[props.movieId as number] > 0 && <p>{savedTime[props.movieId as number]}</p>}
      </div> */}
    </div>
  );
});

ContinueWatchingCardModal.displayName = "ContinueWatchingCardModal";
export default ContinueWatchingCardModal;

