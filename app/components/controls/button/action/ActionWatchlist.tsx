"use client"

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addTowatchlist, deleteFromWatchlist } from "@/app/utils/action";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import { Check, Plus, Loader  } from "lucide-react";
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
  
  const { isDialogOpen } = useVideoContext();
  const pathName = usePathname();
  //console.log("pathName: " + pathName);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isWatchListed, setIsWatchListed] = useState<boolean>(watchList);

  const handleSubmit = async (action: 'add' | 'delete') => {
    try {
      if (!pathName) {
        throw new Error('Pathname is missing.');
      }

      setLoading(true);
      setIsWatchListed(action === 'add'); 
      
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
        if(isDialogOpen) {
          router.push(pathName)
        }
        // const result = await deleteFromWatchlist(formData);
        // console.log('API Response for delete:', result);
      }
      //console.log('watchlistId', watchlistId)
  
      //_debugging
      // for (const pair of formData.entries()) {
      //   console.log('FormData entries:',pair[0], pair[1]);
      // }
    } catch (error) {
      console.error('Error handling watchlist:', error);
      setIsWatchListed(action === 'delete');
    }  finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(isWatchListed ? 'delete' : 'add');
        }}
        className="h-full"
      >
        <input
          type="hidden"
          name={isWatchListed ? "watchlistId" : "movieId"}
          value={isWatchListed ? watchlistId : movieId}
        />
        <input type="hidden" name="pathname" value={pathName} />
        <button 
          className={`${actionStyle} ${styles.watchlistBtn} *:text-main-white_100`}
          disabled={loading}
        > 
          {loading 
            ? <Loader className="animate-spin"/>
            : isWatchListed ?  <Check/> : <Plus/>
          }
        </button>
      </form>
    </>
  )
}