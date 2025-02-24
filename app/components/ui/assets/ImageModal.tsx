"use client"
import Image from "next/image"
import { useState } from "react";

interface ImageCard {
  imageString: string
  imageText: string
  imageStyle: string
  onLoad?: () => void 
}

export default function ImageModal({
  imageString,
  imageText,
  imageStyle,
  onLoad
}: ImageCard) {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };
  
  return (
    <>
      {loading && (
        <div 
          className={`${imageStyle} bg-primary-foreground`}
          aria-label={`${imageText} poster`}
        ></div>
      )}
      <Image
        onLoad={handleImageLoad}
        style={loading ? { visibility: 'hidden' } : {}}
        src={imageString}
        alt={imageText}
        className={`object-cover ${imageStyle}`}
        width={0}
        height={0}
        sizes="100%"
      />
    </>
  )
}