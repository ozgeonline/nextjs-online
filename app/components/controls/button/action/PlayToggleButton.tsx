"use client"

import { PauseCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";

type PlayButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  id?:number
  buttonStyle?:string
  playIconStyle?:string
  playButtonPosition:string
};

const PlayToggleButton: React.FC<PlayButtonProps> = (props) => {

  const {setIsPlaying} = useVideoContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); //for specific video

  useEffect(() => {
    const video = props.videoModalRef.current;
    if (!video) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    setIsVideoPlaying(!video.paused); //initial state

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [props.videoModalRef]);

  const handlePlayToggle = () => {
    const video = props.videoModalRef.current;
    if (!video) return;
  
    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsVideoPlaying(true);
          setIsPlaying(true);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Error playing video:", error); //non-abort errors
          }
        });
    } else {
      video.pause();
      setIsPlaying(false);
      setIsVideoPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlayToggle}
      className={props.buttonStyle + ' ' + props.playButtonPosition}
      key={props.id}
    >
      {isVideoPlaying 
        ? <PauseCircle /> 
        : <Play className={props.playIconStyle} />
      }
    </button>
  )
}

PlayToggleButton.displayName = 'PlayToggleButton';
export default PlayToggleButton;
