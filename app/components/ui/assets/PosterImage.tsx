"use client";
import Image from "next/image";
import { useState, useCallback, memo } from "react";

interface PosterImageProps {
  imageString: string;
  imageText: string;
  imageStyle: string;
  onLoad?: () => void;
}

const PosterImage = memo(
  ({
    imageString,
    imageText,
    imageStyle,
    onLoad,
  }: PosterImageProps) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = useCallback(() => {
      setLoading(false);
      if (onLoad) onLoad();
    }, [onLoad]);

    return (
      <>
        {loading && (
          <div
            className={`${imageStyle} bg-primary-foreground`}
            aria-hidden="true"
          />
        )}
        <Image
          onLoad={handleImageLoad}
          style={loading ? { visibility: "hidden", position: "absolute" } : {}}
          src={imageString}
          alt={imageText}
          className={`object-cover ${imageStyle}`}
          width={0}
          height={0}
          sizes="100%"
          quality={75}
          placeholder="empty"
        />
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.imageString === nextProps.imageString &&
      prevProps.imageText === nextProps.imageText &&
      prevProps.imageStyle === nextProps.imageStyle &&
      prevProps.onLoad === nextProps.onLoad
    );
  }
);

PosterImage.displayName = "PosterImage";
export default PosterImage;
