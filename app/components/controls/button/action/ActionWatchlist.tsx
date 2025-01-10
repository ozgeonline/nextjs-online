"use client"

import { addTowatchlist, deleteFromWatchlist } from "@/app/utils/action";
import { Check, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "../controlsButton.module.css"

interface actionProps {
  watchList: boolean
  watchlistId: string
  movieId: number
  actionStyle: string
}

export default function ActionWatchlist({
  watchList,
  watchlistId,
  movieId,
  actionStyle
}:actionProps) {

  const pathName = usePathname()
  //console.log("movieId",movieId)
   
  const handleSubmit = (action: 'add' | 'delete') => {
    const formData = new FormData();
    formData.append('pathname', pathName);

    if (action === 'add') {
      formData.append('movieId', movieId.toString());
      return addTowatchlist(formData);
    } else {
      formData.append('watchlistId', watchlistId);
      return deleteFromWatchlist(formData);
    }
  };
  //console.log("movieId",movieId)

  return (
    <>
      { watchList ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('delete');
          }}
          className="h-full"
        >
          <input type="hidden" name="watchlistId" value={watchlistId} />
          <input type="hidden" name="pathname" value={pathName} />
          <button 
            className={`
              ${actionStyle}
              ${styles.watchlistBtn}
            `}
          > 
            <Check className="text-main-white_100"/>
          </button>
        </form>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('add');
          }}
        >
          <input type="hidden" name="movieId" value={movieId} />
          <input type="hidden" name="pathname" value={pathName} />
          <button
            className={`
              ${actionStyle}
              ${styles.watchlistBtn}
            `}
          >
            <Plus className="text-main-white_100"/>
          </button>
        </form>
      )}
    </>
  )
}