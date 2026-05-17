"use client"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { addToWatchlist, deleteFromWatchlist } from "@/app/utils/watchlist-actions";
import { useVideoContext } from "@/app/components/providers/VideoContext";
import { Check, Loader, Plus } from "lucide-react";
import styles from "../controlsButton.module.css"

interface ActionWatchlistProps {
  watchList: boolean;
  watchlistId: string;
  movieId: number;
  actionStyle: string;
}

export default function ActionWatchlist({
  watchList,
  watchlistId,
  movieId,
  actionStyle
}: ActionWatchlistProps) {
  const { isDialogOpen } = useVideoContext();
  const pathName = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isWatchListed, setIsWatchListed] = useState<boolean>(watchList);
  const [currentWatchlistId, setCurrentWatchlistId] = useState<string>(watchlistId);

  useEffect(() => {
    setIsWatchListed(watchList);
    setCurrentWatchlistId(watchlistId);
  }, [watchList, watchlistId]);

  const handleToggleWatchlist = async () => {
    const nextWatchlistState = !isWatchListed;

    try {
      if (!pathName) throw new Error("Pathname is missing.");
      if (!movieId) throw new Error("movieId is missing.");

      setLoading(true);
      setIsWatchListed(nextWatchlistState);

      const result = nextWatchlistState
        ? await addToWatchlist(movieId, pathName)
        : await deleteFromWatchlist(currentWatchlistId, pathName);

      if (!result.ok) throw new Error(result.error);

      if (nextWatchlistState && result.watchlistId) {
        setCurrentWatchlistId(result.watchlistId);
      }

      if (!nextWatchlistState) {
        setCurrentWatchlistId("");
      }

      if (isDialogOpen) {
        router.push(pathName);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error handling watchlist:", error);
      setIsWatchListed(!nextWatchlistState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleToggleWatchlist();
        }}
        className="h-full"
      >
        <button
          type="submit"
          aria-label={isWatchListed ? "Remove from watchlist" : "Add to watchlist"}
          className={`${actionStyle} ${styles.watchlistBtn} *:text-main-white_100`}
          disabled={loading}
        >
          {loading
            ? <Loader className="animate-spin" />
            : isWatchListed ? <Check /> : <Plus />
          }
        </button>
      </form>
    </>
  )
}
