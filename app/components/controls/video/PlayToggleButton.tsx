"use client";

import { PauseCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";

type PlayToggleButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  id?: number;
  buttonStyle?: string;
  playIconStyle?: string;
  playButtonPosition: string;
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
}: PlayToggleButtonProps) {
  const { setIsPlaying } = useVideoContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoModalRef.current;
    if (!video) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);

    setIsVideoPlaying(!video.paused);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoModalRef]);

  const handlePlayToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const video = videoModalRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsVideoPlaying(true);
          setIsPlaying(true);
        })
        .catch((error) => {
          if (!isAbortPlaybackError(error)) {
            console.error("Error playing video:", error);
          }
        });
      return;
    }

    video.pause();
    setIsPlaying(false);
    setIsVideoPlaying(false);
  };

  return (
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
  );
}
