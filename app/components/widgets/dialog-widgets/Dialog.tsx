"use client"

import React, { useCallback, useEffect, useRef } from 'react'
import { Subtitles, X } from 'lucide-react'
import { useVideoContext } from '@/app/components/providers/VideoContext'
import VideoModals from '@/app/components/widgets/video-widgets/VideoModals'
import Image from 'next/image'
import { MovieProps } from '@/app/types/props'
import MovieInfo from "@/app/components/widgets/info/MovieInfo";
import GenreList from "@/app/components/widgets/info/GenreList";
import CastList from "@/app/components/widgets/info/CastList";
import ActionWatchlist from "@/app/components/controls/watchlist/WatchlistButton";
import LikeDislikeButton from "@/app/components/controls/rating/LikeDislikeButton";
import PlayToggleButton from "@/app/components/controls/video/PlayToggleButton";
import MuteToggleButton from "@/app/components/controls/video/MuteToggleButton";
import ProgressBar from "@/app/components/controls/video/ProgressBar";
import styles from "./dialog.module.css"

interface dialogProps extends MovieProps {
  onClose: () => void,
}

const Dialog = ({ onClose, ...movieProps }: dialogProps) => {

  const {
    currentVideoPause,
    setIsPlaying,
    setDialogOpen
  } = useVideoContext();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dialogVideoRef = useRef<HTMLVideoElement | null>(null);

  const closeDialog = useCallback(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }

    setIsPlaying(false);
    onClose();
  }, [onClose, setIsPlaying]);

  const openDialog = useCallback(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  useEffect(() => {
    openDialog();
    setDialogOpen(true);
    currentVideoPause();

    // Bulletproof Scroll Lock
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const dialogVideo = dialogVideoRef.current;
    dialogVideo?.load();

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      if (dialogRef.current?.open) {
        dialogRef.current.close();
      }
    };
  }, [currentVideoPause, openDialog, setDialogOpen]);

  // const dialogPositionX = dialogRef.current?.getBoundingClientRect().width;
  // const dialogPositionY = dialogRef.current?.getBoundingClientRect().height;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === dialogRef.current) {
        closeDialog();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeDialog]);

  return (
    <dialog
      ref={dialogRef}
      className={`z-50 flex ${styles['overflow-css']} ${styles['dialog-wrapper']}`}
      aria-label={`Open video dialog for ${movieProps.title}`}
    >
      <div className="flex flex-col relative top-0 w-full h-full ">
        {/* ***** Dialog Close Button ***** */}
        <div className='absolute right-12'>
          <button
            type="button"
            onClick={closeDialog}
            className={styles['close-btn-style']}
            aria-label="Close dialog"
          >
            <X className='size-6' />
          </button>
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
            ref={dialogVideoRef as React.RefObject<HTMLVideoElement>}
            id={movieProps.id as number}
            source={movieProps.videoSource as string}
            imageString={movieProps.imageString as string}
            alt={`${movieProps.title || 'Video'}-video player`}
            videoStyle={styles.videoStyle + ' ' + 'continueVideo'}
            enableLoop={false}
            enableAutoPlay={false}
            enableControls={false}
            isCurrentMovieVideo={false}
            preload="auto"
          />
          <ProgressBar
            videoModalRef={dialogVideoRef as React.RefObject<HTMLVideoElement>}
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
                videoModalRef={dialogVideoRef as React.RefObject<HTMLVideoElement>}
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
                <LikeDislikeButton
                  likeBtnStyle={styles['dialog-circleButtonSize']}
                  movieId={movieProps.movieId ?? 0}
                  initialIsLiked={movieProps.movieReactionIsLiked}
                />
              </div>
            </div>

            {/***** on/off sound button *****/}
            <MuteToggleButton
              videoModalRef={dialogVideoRef as React.RefObject<HTMLVideoElement>}
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
                  <CastList cast={movieProps.cast} />
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
  )
}

export default Dialog;
