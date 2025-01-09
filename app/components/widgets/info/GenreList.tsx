import React from "react"

interface genreProps {
  genres?: string
  genreDialogStyle?:boolean
  genreInfoStyle?:boolean
  genreMargin?:string
  children:React.ReactNode
}

export default function GenreList({
  genres,
  genreDialogStyle,
  genreInfoStyle,
  genreMargin,
  children
}: genreProps) {
  const genre = genres?.split(",")

  return (
    <>
      {genre?.map((item, index) => (
        <div key={index} className={`${genreMargin} flex items-center text-white text-nowrap`}>
          <div 
            className={`
              ${genreDialogStyle && "text-xs sm:text-sm hover:underline"}
              ${genreInfoStyle && "text-[10px]"}
              cursor-pointer text-textColor
            `}
          >
            {item}
          </div>
          {index !== genre.length - 1 && <> {children} </>}
        </div>
      ))}
    </>
  )
}