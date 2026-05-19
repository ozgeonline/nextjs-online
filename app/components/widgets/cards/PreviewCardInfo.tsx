"use client"

import { ChevronDown, Circle, Play } from "lucide-react"
import dynamic from 'next/dynamic';
import { MovieProps } from "@/app/types/props";
import styles from "./cards.module.css";

const DialogTriggerButton = dynamic(() => import('@/app/components/controls/dialog/DialogTriggerButton'));
const ActionWatchlist = dynamic(() => import('@/app/components/controls/watchlist/WatchlistButton'));
const MovieInfo = dynamic(() => import('@/app/components/widgets/info/MovieInfo'));
const GenreList = dynamic(() => import('@/app/components/widgets/info/GenreList'));

interface PreviewCardInfoProps extends MovieProps {
  infohover: string
}

export function PreviewCardInfo({ ...movieProps }: PreviewCardInfoProps) {
  return (
    <div
      aria-label={`${movieProps.title ?? "Movie"} preview information`}
      className={`
        ${movieProps.infohover} 
        ${styles.infoWrapper} 
        shadow-md shadow-black/90
      `}
    >
      <h3
        className="absolute font-bold text-[1em] line-clamp-1 left-3 -top-[1.5em] [text-shadow:_2px_2px_7px_rgb(0_0_0_/_30%)]"
      >
        {movieProps.title}
      </h3>

      <div className="flex items-center p-1 sm:p-3">
        <DialogTriggerButton
          buttonStyle="size-6 me-2"
          {...movieProps}
        >
          <Play
            className="p-1 text-black bg-white rounded-full fill-inherit hover:brightness-75 hover:ease-in"
            aria-hidden="true"
          />
        </DialogTriggerButton>

        <div className="size-6 me-2">
          <ActionWatchlist
            watchList={movieProps.watchList ?? false}
            watchlistId={movieProps.watchlistId ?? ''}
            movieId={movieProps.movieId ?? 0}
            actionStyle="p-1 h-6 w-6"
          />
        </div>

        <DialogTriggerButton
          buttonStyle="size-6 ml-auto"
          {...movieProps}
        >
          <ChevronDown
            className="p-[2px] border border-main-white_100 bg-[#202020] rounded-full hover:brightness-125 hover:ease-in"
            aria-hidden="true"
          />
        </DialogTriggerButton>
      </div>

      <div className="flex gap-x-2 items-center mx-2 mt-2 text-[10px]">
        <MovieInfo
          age={movieProps.age}
          fontHD="text-[8px]"
        />
      </div>
      <div className='flex flex-wrap items-center space-x-1 pt-3 px-2'>
        <GenreList
          genres={movieProps.genres}
          genreInfoStyle={true}
        >
          <Circle className="fill-gray-500 text-gray-500 size-[3px] ms-1" aria-hidden="true" />
        </GenreList>
      </div>
    </div>
  )
}
