"use client"

import { usePathname, useSearchParams} from 'next/navigation'
import React, { useRef, useEffect, useState} from 'react'
import { Button } from '@/components/ui/button'
import { PauseCircle, Play, Subtitles, Volume2, VolumeX, X } from 'lucide-react'
import { useVideoContext } from '@/app/components/providers/VideoContext'
import VideoModals from '@/app/components/widgets/video_widgets/VideoModals'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styles from "./dialog.module.css"
import { MovieProps } from '@/app/types/props'

const MovieInfo = dynamic(() => import("@/app/components/widgets/info/MovieInfo"));
const GenreList = dynamic(() => import("@/app/components/widgets/info/GenreList"));
const CastList = dynamic(() => import("@/app/components/widgets/info/CastList"));
const ActionWatchlist = dynamic(() => import("@/app/components/controls/button/action/ActionWatchlist"));
const LikeDislikeButton = dynamic(() => import("@/app/components/controls/button/ui/LikeDislikeButton"));

interface dialogProps extends MovieProps {
  onClose: () => void,
}

const Dialog =(
  {
    onClose,
    ...movieProps
  }:dialogProps) => {

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const showDialog = searchParams.get('showDialog');

  const { 
    continueWatchingVideoElement,
  } = useVideoContext();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(true);

  useEffect(() => {
    const handleDialogOpen = () => {
      if (showDialog === movieProps.title) {
        // console.log("Setting dialog as open");
        dialogRef.current?.showModal();
        openDialog();

        if (continueWatchingVideoElement.current) {
          continueWatchingVideoElement.current.pause();
          setPlaying(false);
        }
      } else {
        // console.log("Setting dialog as closed"); 
        dialogRef.current?.close();
        closeDialog()
      }
    };
    handleDialogOpen();

    return () => {
      if (dialogRef.current) {
        dialogRef?.current?.close();
      };
    };
  }, [showDialog, movieProps.title]);

  const closeDialog = () => {
    // if (continueWatchingVideoElement.current) {
    //   const currentTime = continueWatchingVideoElement.current.currentTime;
    //   handleVideoTimeUpdate(movieProps.movieId, currentTime); // Update context with current time
    // }
    //console.log("closeDialog()")
    dialogRef.current?.close()
    setPlaying(false)
   

    if(dialogRef.current?.close) {
      //console.log("Close Dialog")
      onClose()
      // redirect(pathName)
    }
  }

  const openDialog = () => {
    // console.log("openDialog")
    dialogRef.current?.showModal();
  }
  
  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     dialogRef.current &&
  //     !dialogRef.current.contains(event.target as Node) &&
  //     (event.target as HTMLElement).dataset.dialogTrigger !== title
  //   ) {
  //     // setOpenDialog(false);
  //   }
  // };

  // useEffect(() => {
  //   if (open) {
  //     document.addEventListener('click', handleClickOutside);
  //   } else {
  //     document.removeEventListener('click', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, [open]);

  const handlePlayToggle = () => {
    // playing==false
    if (continueWatchingVideoElement.current) {
      // setPlaying(false)
      
      if (continueWatchingVideoElement.current?.paused) {
        continueWatchingVideoElement.current?.play()
        setPlaying(true)
       
      } else {
        continueWatchingVideoElement.current?.pause()
        setPlaying(false)
      }
    }
  }
  
  const handleMuteToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
   event.stopPropagation();
    if (continueWatchingVideoElement.current) {
      continueWatchingVideoElement.current.muted = !muted
      setMuted(!muted)
    }
  }

  //console.log("isOpen",isOpen)
  const dialog: JSX.Element | null = showDialog === movieProps.title
    ? (
        <dialog
          ref={dialogRef}
          className={
           "z-50 backdrop:bg-black/50 " + 
            styles['overflow-css'] + " " +
            styles['dialog-wrapper']
          }
          aria-label={`Open video dialog for ${movieProps.title}`}
        >
          <div className="flex flex-col relative w-full h-full">
            {/* ***** Dialog Close Button ***** */}
            <div className='absolute right-12'>
              <Link
                href={pathName}
                onClick={closeDialog}
                className={styles['close-btn-style']}
                scroll={false}
              >
                <X className='size-6' />
              </Link>
            </div>

            {/* ***** Logo Img ***** */}
            <div className='absolute left-3 top-3'>
              <Image 
                src="https://gnubvphzxvsihriukkdr.supabase.co/storage/v1/object/public/nextjs/o-logo.png"
                alt="logo"
                width={10}
                height={10}
                loading='lazy'
              />
            </div>

            {/* Top-Dialog Video */}
            <div className='w-auto h-auto'>
              <VideoModals
                ref={continueWatchingVideoElement as React.RefObject<HTMLVideoElement>}
                enableControls={false}
                enableLoop={false}
                enablePlay={true}
                enableAutoPlay={false}
                enableTimeUpdate={true}
                // enableLoadedMetadata={false}
                imageString={movieProps.imageString ?? ''}
                source={movieProps.videoSource ?? ''}
                alt={`${movieProps.title || 'Video'}-video player`}
                videoStyle=" -z-20 absolute w-full h-[55vw] sm:h-[45vw] md:h-[30vw] object-fill brightness-75"
                id={movieProps.movieId ?? 0}
              />
            </div>
            
            <div className='space-y-10 sm:space-y-20'>
              {/* ------------------- Button Controls ------------------- */}
              <div className='flex justify-between items-center mt-[45vw] sm:mt-[35vw] md:mt-[25vw] px-5 sm:px-10'>
                <div className='flex space-x-2'>
                  {/* ***** play-pause button ***** */}
                  <Button
                    onClick={handlePlayToggle}
                    className={styles['dialog-playButton']}
                  >
                     {playing ? <PauseCircle /> :  <Play className="text-black fill-inherit" />}
                     {playing ? "Pause" :  "Play"}
                  </Button>

                  {/* ***** Watchlist Add-Remove ***** */}
                  <>
                    <ActionWatchlist
                      watchList={movieProps.watchList ?? false} 
                      watchlistId={movieProps.watchlistId ?? ''} 
                      movieId={movieProps.movieId ?? 0}
                      actionStyle={styles['dialog-circleButtonSize']}
                    />
                  </>

                  {/***** non-dynamic like button ui *******/}
                  <div onClick={(e) => e.stopPropagation()}>
                    <LikeDislikeButton likeBtnStyle={styles['dialog-circleButtonSize']} />
                  </div>
                </div>

                {/***** sound on/off button *****/}
                <button
                  onClick={handleMuteToggle}
                  className={
                    styles['dialog-circleButtonSize'] + 
                    " *:text-zinc-500 " + 
                    styles['dialog-muteButton']
                  }
                >
                  {muted ? <VolumeX /> : <Volume2 />}
                </button>
              </div>

              {/* ------------------- Info Controls ------------------- */}
              <div className="flex flex-col px-5 sm:px-10">
                <div className='flex items-center space-x-2'>
                  <div className="flex items-center space-x-2 justify-start ">
                    <MovieInfo 
                      age={movieProps.age} 
                      fontAge="leading-5" 
                      fontHD="text-[11px] h-6" 
                    />
                  </div>
                  <div className='relative hidden xl:block'>
                    <Subtitles className={styles.subtitles} />
                    <p>
                      Subtitles for the deaf and hard of hearing are available
                      <span />
                    </p>
                  </div>
                </div>

                <div className="flex items-stretch sm:items-center justify-between space-x-1 mt-1">
                  <div className='flex max-lg:flex-col lg:space-x-3 items-start lg:items-center'>
                    <div 
                      className={`
                        ${styles['durationRelease-wrapper']} 
                        space-x-2 max-[380px]:space-x-0 
                        *:text-main-white_300 *:max-sm:text-xs
                      `}
                    >
                      <div className="flex items-center h-6">
                        {movieProps.duration}h
                      </div>
                      <div className="font-thin">
                        {movieProps.release}
                      </div>
                    </div>
                    <div className='flex items-center max-lg:flex-wrap max-sm:pt-2 text-xs sm:text-sm lowercase'>
                      <GenreList genres={movieProps.genres}>,</GenreList>
                    </div>
                  </div>

                  <div className='flex flex-col items-start max-[380px]:space-y-2 max-[380px]:ms-3'>
                    <div className='flex items-center max-sm:flex-wrap '>
                      <span className="text-xs sm:text-sm text-[#777]">Casts: </span>
                      <CastList cast={movieProps.cast}/>
                    </div>
                    <div className='flex items-center space-x-1 max-sm:flex-wrap'>
                      <span className="text-xs sm:text-sm text-[#777]">Genres: </span>
                      <GenreList 
                        genres={movieProps.genres} 
                        genreDialogStyle={true} 
                        genreMargin="ms-2"
                      >,</GenreList>
                    </div>
                  </div>
                </div>

                <div className={styles['dialog-overview']}>
                  {movieProps.overview}
                </div>
              </div>
              {/****** info-controls /end *****/}
            </div>
          </div>
        </dialog>
    ) : null

    return dialog
}

export default Dialog;