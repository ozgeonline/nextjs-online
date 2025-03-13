"use client";
import React, { useState, useEffect } from "react";
import { useVideoContext } from "@/app/components/providers/VideoContext";

type ProgressBarProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  progressStyle?: string;
  id?: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ videoModalRef, progressStyle, id }) => {
  const { handleVideoTimeUpdate } = useVideoContext();
  const [progress, setProgress] = useState(0);

  //Updates progress as video plays
  useEffect(() => {
    const video = videoModalRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        setProgress(progressPercent);
        if (id !== undefined) {
          handleVideoTimeUpdate(id, video.currentTime);
        }
      }
    };
    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoModalRef, id, handleVideoTimeUpdate]);

  //Click on the progress bar to update the time
  const handleProgress  = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoModalRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const clickX = e.clientX - rect.left;
    const progressPercent = clickX / width;
    const progressTime = progressPercent * video.duration;

    video.currentTime = progressTime; //
    setProgress(progressPercent * 100);
    if (id !== undefined) {
      handleVideoTimeUpdate(id, progressTime);
    }
    //console.log("width",width)
    //console.log("clickX",clickX)
    //console.log("progress",progress)
    //console.log("progressTime",progressTime)
  };

  return (
    <div
      className={`w-full h-1 bg-gray-300 cursor-pointer ${progressStyle || ""}`}
      onClick={handleProgress}
    >
      <div
        className="h-full bg-neutral-700"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
export default ProgressBar;