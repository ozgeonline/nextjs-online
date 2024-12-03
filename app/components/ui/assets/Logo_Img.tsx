"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

interface logoProps {
  logoStyle: string
}

export default function Logo_Img({logoStyle}:logoProps) {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(
    "https://utfs.io/f/MzCIEEnlPGFD0FJReyaQFyYUIlefwhZsOdp3tLqKazo6cmbV"
  );

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setImageSrc("/logo.svg");
  };
  
  return (
    <>
      {loading && (
        <div 
          className="absolute top-0 left-0 size-4 mx-[15vw] md:mx-[10vw] my-5 border border-main-red border-y-2"
          aria-label="logo"
        ></div>
      )}
      <Link as="image" href="/" className={logoStyle} >
        <Image
          onLoad={handleImageLoad}
          onError={handleImageError}
          src={imageSrc}
          style={loading ? { visibility: 'hidden' } : {}}
          alt="Logo"
          sizes="100%"
          fill
          aria-label="Logo"
          className="z-50"
          priority={false}
        />
      </Link>
    </>
    
  )
}