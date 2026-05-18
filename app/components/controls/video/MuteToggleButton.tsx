"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type MuteToggleButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  buttonStyle: string;
  iconStyle?: string;
};

export default function MuteToggleButton({
  videoModalRef,
  buttonStyle,
  iconStyle,
}: MuteToggleButtonProps) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoModalRef.current;
    if (!video) return;

    const syncMutedState = () => setIsMuted(video.muted);

    syncMutedState();
    video.addEventListener("volumechange", syncMutedState);

    return () => {
      video.removeEventListener("volumechange", syncMutedState);
    };
  }, [videoModalRef]);

  const handleMuteToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const video = videoModalRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <button
      type="button"
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      aria-pressed={!isMuted}
      onClick={handleMuteToggle}
      className={buttonStyle}
    >
      {isMuted
        ? <VolumeX className={iconStyle} />
        : <Volume2 className={iconStyle} />
      }
    </button>
  );
}
