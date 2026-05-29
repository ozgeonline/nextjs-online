"use client"

import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation";
import { setMovieReaction } from "@/app/utils/reaction-actions";
import styles from "./like.module.css"

interface LikeDislikeButtonProps {
  likeBtnStyle: string
  movieId: number
  initialIsLiked?: boolean | null
}

export default function LikeDislikeButton({
  likeBtnStyle,
  movieId,
  initialIsLiked = null,
}: LikeDislikeButtonProps) {
  const pathname = usePathname();
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const Icon = isLiked ? ThumbsUp : ThumbsDown;

  useEffect(() => {
    setIsLiked(initialIsLiked ?? true);
  }, [initialIsLiked]);

  const handleReactionToggle = async () => {
    const nextIsLiked = !isLiked;

    try {
      setIsSaving(true);
      setIsLiked(nextIsLiked);

      const result = await setMovieReaction(movieId, nextIsLiked, pathname);

      if (!result.ok) {
        throw new Error(result.error);
      }

      if (typeof result.isLiked === "boolean") {
        setIsLiked(result.isLiked);
      }
    } catch (error) {
      console.error("Error handling movie reaction:", error);
      setIsLiked(!nextIsLiked);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label={isLiked ? "Dislike" : "Like"}
        aria-pressed={isLiked}
        onClick={handleReactionToggle}
        className={`${likeBtnStyle} ${styles.likeBtnDefaultStyle}`}
        disabled={isSaving}
      >
        <Icon className={styles.likeBtnIconStyle} />
      </button>
    </div>
  )
}
