interface infoProps {
  age?: number
  fontAge?: string
  fontHD?: string
}

export default function MovieInfo({
  age,
  fontAge,
  fontHD
}: infoProps) {
  return (
    <>
      <div className='font-semibold max-sm:text-sm text-main-match_color'>
        100% Match
      </div>
      <div className='text-main-white_300'>
        Episodes
      </div>
      <div 
        className={`
          ${fontAge}
          flex items-center justify-center px-1 cursor-pointer line-clamp-none
          border border-gray-400 text-main-white_100 text-xs
        `}
      >
        {age}+
      </div>
      <div 
        className={`
          ${fontHD}
          flex items-center rounded-sm px-1 tracking-widest line-clamp-none
          border border-gray-400 text-main-white_100
        `}
      >
        HD
      </div>
    </>
  )
}