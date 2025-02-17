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
  
  const pathName = usePathname();
  //console.log("pathName: " + pathName);

  const handleSubmit = async (action: 'add' | 'delete') => {
    try {
      if (!pathName) {
        throw new Error('Pathname is missing.');
      }

      const formData = new FormData();
      formData.append('pathname', pathName);
  
      if (action === 'add') {
        if (!movieId) {
          throw new Error('movieId is missing.');
        }
        //console.log("movieId",movieId)
        formData.append('movieId', movieId.toString());
        await addTowatchlist(formData);
        // const result = await addTowatchlist(formData);
        // console.log('API Response for add:', result);
        
      } else if (action === 'delete') {
        if (!watchlistId) {
          throw new Error('watchlistId is missing.');
        }
        formData.append('watchlistId', watchlistId);
        await deleteFromWatchlist(formData);
        // const result = await deleteFromWatchlist(formData);
        // console.log('API Response for delete:', result);
      }
      //console.log('watchlistId', watchlistId)
  
      // Debugging
      // for (const pair of formData.entries()) {
      //   console.log('FormData entries:',pair[0], pair[1]);
      // }
    } catch (error) {
      console.error('Error handling watchlist:', error);
    }
  };

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