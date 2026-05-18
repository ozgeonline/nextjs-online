"use client"
import Image from "next/image"
import { useState } from "react";

export default function AuthBackgroundImage() {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div
          className="absolute top-0 left-0 w-screen h-[80vh] sm:h-[95vh] bg-main-dark"
          aria-hidden="true"
        ></div>
      )}
      <div className="absolute top-0 left-0 w-screen h-[80vh] sm:h-[95vh]">
        <Image
          onLoad={handleImageLoad}
          style={loading ? { visibility: 'hidden' } : {}}
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDISaPU9OdiMVXeQ2BY1cawgflLUqy5TK6m93D"
          alt="Background Image"
          placeholder="blur"
          blurDataURL="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDISaPU9OdiMVXeQ2BY1cawgflLUqy5TK6m93D"
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
