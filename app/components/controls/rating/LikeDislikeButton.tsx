"use client"

import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import styles from "./like.module.css"

interface LikeDislikeButtonProps {
  likeBtnStyle: string
}

export default function LikeDislikeButton({ likeBtnStyle }: LikeDislikeButtonProps) {
  const [isLiked, setIsLiked] = useState<boolean>(true);
  const Icon = isLiked ? ThumbsUp : ThumbsDown;

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        aria-label={isLiked ? "Dislike" : "Like"}
        aria-pressed={isLiked}
        onClick={() => setIsLiked((current) => !current)}
        className={`${likeBtnStyle} ${styles.likeBtnDefaultStyle}`}
      >
        <Icon className={styles.likeBtnIconStyle} />
      </button>
    </div>
  )
}
