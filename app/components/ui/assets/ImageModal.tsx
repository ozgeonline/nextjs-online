"use client";
import Image from "next/image";
import { useState, useCallback, memo } from "react";

interface ImageCard {
  imageString: string;
  imageText: string;
  imageStyle: string;
  onLoad?: () => void;
}

const ImageModal = memo(
  ({
    imageString,
    imageText,
    imageStyle,
    onLoad,
  }: ImageCard) => {
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
            aria-label={`${imageText} poster`}
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
    //re-render if props change
    return (
      prevProps.imageString === nextProps.imageString &&
      prevProps.imageText === nextProps.imageText &&
      prevProps.imageStyle === nextProps.imageStyle
    );
  }
);

ImageModal.displayName = "ImageModal";
export default ImageModal;