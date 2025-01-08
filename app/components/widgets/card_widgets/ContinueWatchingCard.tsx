"use client"

// import { MovieProps } from '@/app/src/types/props';
import { useVideoContext } from '../../providers/VideoContext';
import VideoModals from '../video_widgets/VideoModals';
import styles from "./card.module.css"
// import { ModalRef } from '../../movie__modal/VideoModal';
import { forwardRef, useImperativeHandle } from 'react';

type VideoPlayerProps = {
  id:number;
  imageString: string;
  videoSource: string;
  title:string;
  alt: string;
}

const ContinueWatchingCardModal = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, ref) => {
    //console.log("ref",ref)

  const {
    // currentVideoRef,
    continueWatchingVideoElement,
    savedTime,
    // handleVideoTimeUpdate,
  } = useVideoContext();
    
  useImperativeHandle(ref, () => {
     if (continueWatchingVideoElement?.current ) {
       return continueWatchingVideoElement.current ;
     } else {
         throw new Error("continueWatchingVideoElement.current is null");
       }
   },[]);



  return (
    <div className="mt-12">
      { savedTime[props.id] > 0 &&
       ( <VideoModals
          //onUpdateTime={handleTimeUpdate}
          //onUpdateTime={handleTimeUpdate}
          ref={ref}
          enableControls={true}
          enableAutoPlay={false}
          enableLoop={false}
          enableTimeUpdate={true}
          // enableEnded={true}
          enablePlay={true}
          // enableLoadedMetadata={true}
          imageString={props.imageString}
          source={props.videoSource}
          alt={props.alt}
          videoStyle={`${styles.cardSize} z-50 continueVideo w-full object-cover rounded-sm flex overflow-hidden`}
          id={props.id}  
        />)
      }
      <div>
      {savedTime[props.id] > 0 && <p>{savedTime[props.id]}</p>}
      </div>
    
    </div>
  );
}
)

ContinueWatchingCardModal.displayName = "ContinueWatchingCardModal";
export default ContinueWatchingCardModal;
// function useImperativeHandle(ref: ForwardedRef<HTMLVideoElement>, arg1: () => HTMLVideoElement) {
//   throw new Error('Function not implemented.');
// }

