import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
type MuteButtonProps = {
  videoModalRef: React.RefObject<HTMLVideoElement>;
  buttonStyle:string
  iconStyle?:string
};

const MuteToggleButton: React.FC<MuteButtonProps> = ({ videoModalRef, buttonStyle, iconStyle }) => {

  const [muted, setMuted] = useState<boolean>(true);
  const handleMuteToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
     if (videoModalRef.current) {
       videoModalRef.current.muted = !muted
       setMuted(!muted)
     }
  }

  return (
     <button
        onClick={handleMuteToggle}
        className={buttonStyle}
      >
        {muted ? <VolumeX className={iconStyle}/> : <Volume2 className={iconStyle}/>}
      </button>
  )
}

MuteToggleButton.displayName = 'MuteToggleButton';
export default MuteToggleButton