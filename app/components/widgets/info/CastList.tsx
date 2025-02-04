interface castProps {
  cast?: string
}

export default function CastList({cast}: castProps) {
  const casts = cast?.split(",")
  return (
    <>
     {casts?.map((item, index) => (
        <div 
          key={index} 
          className='flex items-center text-nowrap ms-2'
        >
          <div className="cursor-pointer hover:underline text-white text-xs sm:text-sm ">
            {item}
          </div>
          {
            index !== casts.length - 1 && <span className='text-white'>,</span>
          }
        </div>
      ))}
    </>
  )
}