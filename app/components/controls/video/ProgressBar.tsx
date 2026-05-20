"use client";

import { useEffect, useState } from "react";

type ProgressBarProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  progressStyle?: string;
  id?: number;
};

export default function ProgressBar({ videoModalRef, progressStyle, id }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoModalRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!video.duration) return;

      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
    };

    updateProgress();
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [videoModalRef]);

  const updateVideoProgress = (clientX: number, target: HTMLDivElement) => {
    const video = videoModalRef.current;
    if (!video?.duration) return;

    const rect = target.getBoundingClientRect();
    const clickX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const progressPercent = clickX / rect.width;
    const progressTime = progressPercent * video.duration;

    video.currentTime = progressTime;
    setProgress(progressPercent * 100);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    updateVideoProgress(event.clientX, event.currentTarget);
  };

  return (
    <div
      role="progressbar"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className={`w-full h-1 bg-gray-300 cursor-pointer ${progressStyle ?? ""}`}
      onClick={handleProgressClick}
    >
      <div
        className="h-full bg-sky-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
