"use client"

import { PlayCircle } from 'lucide-react'
import { PreviewCard_Info } from "./PreviewCard_Info"
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { MovieProps } from "@/app/types/props";
import dynamic from 'next/dynamic';
import { useCardContext } from '@/app/components/providers/CardContext';
import styles from "./card.module.css";

const ImageModal = dynamic(() => import('@/app/components/ui/assets/ImageModal'));
const ShowDialogButton = dynamic(() => import('@/app/components/controls/button/action/ShowDialogButton'));

interface PreviewModalProps extends MovieProps {
  imageCardWrapper?: boolean
  top10Wrapper?: boolean
  imageStyle?: string
}
export default function PreviewCard({
  imageCardWrapper,
  top10Wrapper,
  imageStyle,
  ...movieProps
}: PreviewModalProps) {
  const {setIsHover, isHover } = useCardContext();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const searchParams = useSearchParams();
  const showDialog = searchParams.get('showDialog')

  useEffect(() => {
    if (showDialog === movieProps.title) {
      setOpenDialog(true)
    } else {
      setOpenDialog(false)
    }
  }, [showDialog, openDialog, movieProps.title]);

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);
  //console.log(isHover)

  return (
    <div 
      className="group/card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} 
      aria-label={`${movieProps.movieId}.poster`}
    >
      <div
        className={`
          relative cursor-pointer slide
          ${imageCardWrapper ? styles.cardSize : top10Wrapper ? styles.top10cardSize : undefined}
        `}
      >
        <ImageModal
          imageString={movieProps.imageString ?? ''}
          imageText={`preview card open ${movieProps.title}-movie poster`}
          imageStyle={`${imageStyle} max-lg:brightness-75 h-full w-full `}
          onLoad={() => setImageLoaded(true)} 
        />
        {imageLoaded && (
          <ShowDialogButton
            {...movieProps}
            buttonStyle="absolute z-50 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 outline-none"
          >
            <PlayCircle className="invisible max-xl:visible text-zinc-300 size-8 outline-none" aria-label={movieProps.title} />
          </ShowDialogButton>
        )}

      </div>

      <div
        className={`
          ${styles.previewCardDefault}
          ${!openDialog 
              ? ` xl:group-hover/card:visible xl:group-hover/card:scale-150 xl:group-hover/card:z-50 `
              : "group-hover/card:invisible "
          }
        `}
      >
        <ImageModal
          imageString={movieProps.imageString || ''}
          imageText={`${movieProps.title}-movie big poster`}
          imageStyle="rounded-t-sm w-full h-full "
        />
        <PreviewCard_Info
          {...movieProps}
          infohover={`
            ${isHover ? 'opacity-100 z-50' : 'opacity-45 -z-50'}
          `}
        />
      </div>
    </div>
  )
}