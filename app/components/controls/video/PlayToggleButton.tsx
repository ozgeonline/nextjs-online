"use client";

import { PauseCircle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import RedCircleAnimation from "@/app/components/animation/RedCircleAnimation";

type PlayToggleButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  id?: number;
  buttonStyle?: string;
  playIconStyle?: string;
  playButtonPosition: string;
  pauseOtherVideosSelector?: string;
  onPlayRequest?: () => void;
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
  onPlayRequest,
}: PlayToggleButtonProps) {
  const { setIsPlaying } = useVideoContext();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoOverlayRect, setVideoOverlayRect] = useState<DOMRect | null>(null);
  const [videoOverlayTarget, setVideoOverlayTarget] = useState<HTMLElement | null>(null);

  const setOverlayPosition = (video: HTMLVideoElement) => {
    setVideoOverlayRect(video.getBoundingClientRect());
    setVideoOverlayTarget(video.closest("dialog") ?? document.body);
  };

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
    const handleError = () => {
      setIsVideoPlaying(false);
      setIsVideoLoading(false);
    };

    setIsVideoPlaying(!video.paused);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("stalled", handleWaiting);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("stalled", handleWaiting);
      video.removeEventListener("error", handleError);
    };
  }, [videoModalRef]);

  useEffect(() => {
    if (!isVideoLoading) {
      setVideoOverlayRect(null);
      setVideoOverlayTarget(null);
      return;
    }

    const updateOverlayRect = () => {
      const video = videoModalRef.current;
      if (video) {
        setOverlayPosition(video);
      }
    };

    updateOverlayRect();
    window.addEventListener("resize", updateOverlayRect);
    window.addEventListener("scroll", updateOverlayRect, true);

    return () => {
      window.removeEventListener("resize", updateOverlayRect);
      window.removeEventListener("scroll", updateOverlayRect, true);
    };
  }, [isVideoLoading, videoModalRef]);

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

      setOverlayPosition(video);
      setIsVideoLoading(true);
      onPlayRequest?.();
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
      {isVideoLoading && videoOverlayRect && videoOverlayTarget &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[2147483647]"
            style={{
              top: videoOverlayRect.top,
              left: videoOverlayRect.left,
              width: videoOverlayRect.width,
              height: videoOverlayRect.height,
            }}
          >
            <RedCircleAnimation />
          </div>,
          videoOverlayTarget,
        )
      }
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
