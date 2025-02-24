"use client"
import Image from "next/image"
import { useState } from "react";

export default function Background_Img() {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div 
          className="absolute top-0 left-0 w-screen h-[80vh] sm:h-[95vh] bg-main-dark"
          aria-label="Background Image"
        ></div>
      )}
      <div className="absolute top-0 left-0 w-screen h-[80vh] sm:h-[95vh]">
        <Image
          onLoad={handleImageLoad}
          style={loading ? { visibility: 'hidden' } : {}}
          src="https://utfs.io/f/MzCIEEnlPGFDwrIAQaYqlTOprZ9Ac2Vvs1uHfUgS0GEoeBYX"
          alt="Background Image"
          placeholder="blur"
          blurDataURL="https://utfs.io/f/MzCIEEnlPGFDwrIAQaYqlTOprZ9Ac2Vvs1uHfUgS0GEoeBYX"
          aria-label="Background Image"
          className="-z-10 brightness-75 object-cover"
          sizes="(min-height:640px) 95vh, 80vh, width:100vw"
          fill
          priority
        />
      </div>
    </>
  )
}