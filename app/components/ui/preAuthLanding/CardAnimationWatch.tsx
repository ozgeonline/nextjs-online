import Image from "next/image"
import cardData from "@/app/data/card"

export default function CardAnimationWatch() {
  return (
    <div className="bg-black">
      {cardData.map((card) => (
        <div 
          key={card.id} 
          className={`
            flex flex-col items-center justify-center border-t-8 py-16 md:py-20 lg:flex-row lg:px-5 xl:px-36 
            ${card.id % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"}
          `}
        >
          <div className="mx-10 lg:w-[450px] 2xl:w-[585px]">
            <h1 className="text-3xl lg:text-5xl text-center lg:text-start font-extrabold">
              {card.cardTitle}
            </h1>
            <div className="text-center lg:text-start sm:text-sm md:text-lg lg:text-2xl mt-4">
              {card.cardComment}
            </div>
          </div>
          <div className="relative flex-shrink">
            <Image 
              src={card.cardImg}
              className="brightness-75 w-full h-full"
              quality={50}
              alt={`Watch List Img-${card.id}`}
              width="0"
              height="0"
              sizes="100vw"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  )
}