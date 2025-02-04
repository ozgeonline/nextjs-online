"use client"

import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useState } from "react"
import styles from "../controlsButton.module.css"

interface likeDislikeProps {
  likeBtnStyle: string
}

export default function LikeDislikeButton({ likeBtnStyle } :likeDislikeProps) {
  const [like, setLike] = useState<boolean>(true)
  
  return (
    <div className="flex items-center justify-center">
      {like ? (
        <button 
          onClick={() => setLike(!like)} 
          className={`
            ${likeBtnStyle} 
            ${styles.likeBtnDefaultStyle}
          `}
        >
          <ThumbsUp className={styles.likeBtnIconStyle} />
        </button>
        ) : (
        <button  
          onClick={() => setLike(!like)} 
          className={`
            ${likeBtnStyle}
            ${styles.likeBtnDefaultStyle}
          `}
        >
          <ThumbsDown className={styles.likeBtnIconStyle} />
        </button>
        )
      }
    </div>
  )
}