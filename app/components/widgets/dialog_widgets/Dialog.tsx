"use client"

import React, { useRef, useEffect} from 'react'
import { usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Subtitles, X } from 'lucide-react'
import { useVideoContext } from '@/app/components/providers/VideoContext'
import VideoModals from '@/app/components/widgets/video_widgets/VideoModals'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MovieProps } from '@/app/types/props'
//import PlayToggleButton from '@/app/components/controls/button/action/PlayToggleButton'
//import MuteToggleButton from '@/app/components/controls/button/action/MuteToggleButton'
//import ProgressBar from '@/app/components/controls/button/action/ProgressBar'
import styles from "./dialog.module.css"

const MovieInfo = dynamic(() => import("@/app/components/widgets/info/MovieInfo"));
const GenreList = dynamic(() => import("@/app/components/widgets/info/GenreList"));
const CastList = dynamic(() => import("@/app/components/widgets/info/CastList"));
const ActionWatchlist = dynamic(() => import("@/app/components/controls/button/action/ActionWatchlist"));
const LikeDislikeButton = dynamic(() => import("@/app/components/controls/button/ui/LikeDislikeButton"));
const PlayToggleButton = dynamic(() => import("@/app/components/controls/button/action/PlayToggleButton"));
const MuteToggleButton = dynamic(() => import("@/app/components/controls/button/action/MuteToggleButton"));
const ProgressBar = dynamic(() => import("@/app/components/controls/button/action/ProgressBar"));

interface dialogProps extends MovieProps {
  onClose: () => void,
}

const Dialog =({ onClose, ...movieProps }:dialogProps) => {

  const {
    continueWatchingVideoElement,
    setIsPlaying,
    setDialogOpen
  } = useVideoContext();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const showDialog = searchParams.get('showDialog');
  //console.log("pathName Dialog: " + pathName)

  useEffect(() => {
    const handleDialogOpen = () => {
      if (showDialog === movieProps.title) {
        // console.log("Setting dialog as open");
        dialogRef.current?.showModal();
        openDialog();
        setDialogOpen(true);

        if (continueWatchingVideoElement.current) {
          const video = continueWatchingVideoElement.current;
          //check if the video is playing or if there is a pending playback req
          setTimeout(() => {
            if (!video.paused) {
              video.pause();
            }
            setIsPlaying(false);
          }, 100); //delay to avoid interrupting play()
        }
      } else {
        // console.log("Setting dialog as closed"); 
        dialogRef.current?.close();
        closeDialog()
        setDialogOpen(false);
      }
    };
    handleDialogOpen();

    return () => {
      if (dialogRef.current) {
        dialogRef?.current?.close();
      };
    };
  }, [showDialog, movieProps.title,continueWatchingVideoElement, setIsPlaying,setDialogOpen]);

  const closeDialog = () => {
    //console.log("closeDialog")
    dialogRef.current?.close()
    setIsPlaying(false)

    if(dialogRef.current?.close) {
      //console.log("Close Dialog")
      onClose()
    }
  };

  const openDialog = () => {
    // console.log("openDialog")
    dialogRef.current?.showModal();
  };
 
  // const dialogPositionX = dialogRef.current?.getBoundingClientRect().width;
  // const dialogPositionY = dialogRef.current?.getBoundingClientRect().height;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === dialogRef.current) {
        closeDialog();
        router.push(pathName)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dialogRef]);

  const dialog: JSX.Element | null = showDialog === movieProps.title ? (
    <dialog
      ref={dialogRef}
      className={
       "z-50 backdrop:bg-black/60 " + 
        styles['overflow-css'] + ' ' +
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
        <div className='relative'>
          <VideoModals
            ref={continueWatchingVideoElement as React.RefObject<HTMLVideoElement>}
            id={movieProps.id as number}
            source={movieProps.videoSource as string}
            imageString={movieProps.imageString as string}
            alt={`${movieProps.title || 'Video'}-video player`}
            videoStyle={styles.videoStyle + ' ' + 'continueVideo'}
            enableLoop={false}
            enableAutoPlay={false}
            enableControls={false}
            isCurrentMovieVideo={false}
          />
          <ProgressBar
            videoModalRef={continueWatchingVideoElement as React.RefObject<HTMLVideoElement>}
            id={movieProps.movieId as number}
            progressStyle={styles.progressStyle}
          />
        </div>
            
        <div className='space-y-10 sm:space-y-20 '>
          {/*________________________________________________Button Controls________________________________________________*/}
          <div className={styles.buttonControlsWrapper}>
            <div className='flex space-x-2'>
              {/****** play-pause button ******/}
              <PlayToggleButton 
                videoModalRef={continueWatchingVideoElement as React.RefObject<HTMLVideoElement>} 
                id={movieProps.movieId as number}
                buttonStyle={`
                  ${styles['dialog-playButton']} 
                  flex z-50 relative p-1 sm:p-0
                `}
                playIconStyle='fill-black'
                playButtonPosition='flex justify-center items-center'
              />

              {/****** Watchlist Add-Remove ******/}
              <ActionWatchlist
                watchList={movieProps.watchList ?? false} 
                watchlistId={movieProps.watchlistId ?? ''} 
                movieId={movieProps.movieId ?? 0}
                actionStyle={styles['dialog-circleButtonSize']}
              />
              
              {/***** non-dynamic like button-ui *******/}
              <div onClick={(e) => e.stopPropagation()}>
                <LikeDislikeButton likeBtnStyle={styles['dialog-circleButtonSize']} />
              </div>
            </div>

            {/***** on/off sound button *****/}
            <MuteToggleButton
              videoModalRef={continueWatchingVideoElement as React.RefObject<HTMLVideoElement>}
              buttonStyle={styles['dialog-circleButtonSize'] + ' ' + styles['dialog-muteButton']}
              iconStyle='text-zinc-500'
            />
          </div>
          {/* ---button controls /ends--- */}

          {/*________________________________________________ Info Controls  ________________________________________________*/}
          <div className="flex flex-col px-5 sm:px-10">
            {/**************************** Top Icons Info ****************************/}
            <div className='flex items-center space-x-2'>
              <div className="flex items-center justify-start space-x-2">
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

            {/**************************** middle info area ****************************/}
            <div className="flex items-stretch sm:items-center justify-between space-x-1 mt-1">
              {/*________________________ left area ________________________*/}
              <div className='flex max-lg:flex-col items-start lg:items-center lg:space-x-3'>
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
                <div className={styles.leftGenreWrapper}>
                  <GenreList genres={movieProps.genres}>,</GenreList>
                </div>
              </div>

              {/*________________________ right area ________________________*/}
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
            
            {/****************** bottom info area ******************/}
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