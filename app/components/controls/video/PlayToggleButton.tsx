"use client";

import { PauseCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import RedCircle_Animation from "@/app/components/animation/RedCircle_Animation";

type PlayToggleButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  id?: number;
  buttonStyle?: string;
  playIconStyle?: string;
  playButtonPosition: string;
  pauseOtherVideosSelector?: string;
};

function isAbortPlaybackError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function PlayToggleButton({
  videoModalRef,
  id,
  buttonStyle,
  playIconStyle,
  playButtonPosition,
  pauseOtherVideosSelector,
}: PlayToggleButtonProps) {
  const { setIsPlaying } = useVideoContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    const video = videoModalRef.current;
    if (!video) return;

    const handlePlaying = () => {
      setIsVideoPlaying(true);
      setIsVideoLoading(false);
    };
    const handlePause = () => {
      setIsVideoPlaying(false);
      setIsVideoLoading(false);
    };
    const handleWaiting = () => {
      if (!video.paused) {
        setIsVideoPlaying(false);
        setIsVideoLoading(true);
      }
    };
    const handleCanPlay = () => setIsVideoLoading(false);
    const handleError = () => {
      setIsVideoPlaying(false);
      setIsVideoLoading(false);
    };

    setIsVideoPlaying(!video.paused);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleWaiting);
    video.addEventListener("loadeddata", handleCanPlay);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleWaiting);
      video.removeEventListener("loadeddata", handleCanPlay);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoModalRef]);

  const handlePlayToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const video = videoModalRef.current;
    if (!video) return;

    if (video.paused) {
      if (pauseOtherVideosSelector) {
        document.querySelectorAll<HTMLVideoElement>(pauseOtherVideosSelector).forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });
      }

      setIsVideoLoading(true);
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          setIsVideoLoading(false);
          if (!isAbortPlaybackError(error)) {
            console.error("Error playing video:", error);
          }
        });
      return;
    }

    video.pause();
    setIsPlaying(false);
    setIsVideoPlaying(false);
    setIsVideoLoading(false);
  };

  return (
    <>
      {isVideoLoading && <RedCircle_Animation />}
      <button
        type="button"
        aria-label={isVideoPlaying ? "Pause video" : "Play video"}
        aria-pressed={isVideoPlaying}
        onClick={handlePlayToggle}
        className={`${buttonStyle ?? ""} ${playButtonPosition}`}
        data-video-id={id}
      >
        {isVideoPlaying
          ? <PauseCircle />
          : <Play className={playIconStyle} />
        }
      </button>
    </>
  );
}
