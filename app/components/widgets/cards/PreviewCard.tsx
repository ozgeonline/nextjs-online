"use client"

import { PlayCircle } from 'lucide-react'
import { PreviewCardInfo } from "./PreviewCardInfo"
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { MovieProps } from "@/app/types/props";
import dynamic from 'next/dynamic';
import { useUIContext } from '@/app/components/providers/UIContext';
import styles from "./cards.module.css";

const PosterImage = dynamic(() => import('@/app/components/ui/assets/PosterImage'));
const DialogTriggerButton = dynamic(() => import('@/app/components/controls/dialog/DialogTriggerButton'));

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
  const { setIsHover, isHover } = useUIContext();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const searchParams = useSearchParams();
  const showDialog = searchParams.get('showDialog')

  useEffect(() => {
    setOpenDialog(showDialog === movieProps.title)
  }, [showDialog, movieProps.title]);

  const handleMouseEnter = () => setIsHover(true);
  const handleMouseLeave = () => setIsHover(false);

  return (
    <div
      className="group/card relative "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`${movieProps.title ?? "Movie"} poster card`}
    >
      <div
        className={`
          relative cursor-pointer slide
          ${imageCardWrapper ? styles.cardSize : top10Wrapper ? styles.top10cardSize : undefined}
        `}
      >
        <PosterImage
          imageString={movieProps.imageString ?? ''}
          imageText={`preview card open ${movieProps.title}-movie poster`}
          imageStyle={`${imageStyle} max-lg:brightness-75 h-full w-full `}
          onLoad={() => setImageLoaded(true)}
        />
        {imageLoaded && (
          <DialogTriggerButton
            {...movieProps}
            buttonStyle="absolute z-50 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 outline-none"
          >
            <PlayCircle
              className="invisible max-xl:visible text-zinc-300 size-8 outline-none"
              aria-hidden="true"
            />
          </DialogTriggerButton>
        )}

      </div>

      <div
        className={`
          preview-card-panel
          ${styles.previewCardDefault}
          ${!openDialog
            ? ` xl:group-hover/card:visible xl:group-hover/card:scale-150 xl:group-hover/card:z-50 `
            : "group-hover/card:invisible "
          }
        `}
      >
        <PosterImage
          imageString={movieProps.imageString || ''}
          imageText={`${movieProps.title}-movie big poster`}
          imageStyle="rounded-t-sm w-full h-full "
        />
        <PreviewCardInfo
          {...movieProps}
          infohover={`
            ${isHover ? 'opacity-100 z-50' : 'opacity-45 -z-50'}
          `}
        />
      </div>
    </div>
  )
}
