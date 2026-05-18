"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

interface LogoImageProps {
  logoStyle: string
}

export default function LogoImage({ logoStyle }: LogoImageProps) {
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
          aria-hidden="true"
        ></div>
      )}
      <Link href="/home" className={logoStyle} prefetch={false}>
        <Image
          onLoad={handleImageLoad}
          onError={handleImageError}
          src={imageSrc}
          style={loading ? { visibility: 'hidden' } : {}}
          alt="Online logo"
          sizes="100%"
          fill
          className="z-50"
          priority
        />
      </Link>
    </>
    
  )
}
