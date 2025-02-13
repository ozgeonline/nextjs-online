import { CardProvider } from "@/app/components/providers/CardContext";
import { VideoProvider } from "@/app/components/providers/VideoContext";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import { getServerSession } from "next-auth/next";
import dynamic from 'next/dynamic';

const CarouselModal = dynamic(() => import('@/app/components/providers/CarouselModal'));
const PreviewCard = dynamic(() => import('@/app/components/widgets/card_widgets/PreviewCard'));

async function getData(userId: string) {
  const data = await prisma.watchList.findMany({
    where: {
      userId: userId,
    },
    select: {
      Movie: {
        select: {
          title: true,
          age: true,
          duration: true,
          imageString: true,
          overview: true,
          release: true,
          id: true,
          WatchLists: true,
          videoSource: true,
          cast: true,
          genres: true,
          category: true,
        },
      }
    },
  })
  return data
}

export default async function Watchlist() {
  const session = await getServerSession(authOptions);
  const data = await getData(session?.user?.email as string);
  //console.log(data.length)

  return (
    <div className="flex flex-col padding-layout relative">
      <h1 className="sm:text-2xl mt-24 mb-5">
        My List
      </h1>
      { data.length > 0 ? (
        <VideoProvider>
        <CardProvider>
          <CarouselModal 
            sliderButtonSection={true}
            sectionTitle=""
            // id={data.map(movie => movie.Movie?.id).filter(Boolean) as number[]}
            key={data.map(movie => movie.Movie?.id).join('-')}
          >
            
            {data.map((movie) => (
              <div key={movie.Movie?.id} className="relative w-full h-full ">
                <PreviewCard
                  id={movie.Movie?.id as number}
                  imageString={movie.Movie?.imageString as string}
                  videoSource={movie.Movie?.videoSource as string}
                  title={movie.Movie?.title as string}
                  overview={movie.Movie?.overview as string}
                  cast={movie.Movie?.cast as string}
                  genres={movie.Movie?.genres as string}
                  age={movie.Movie?.age as number}
                  release={movie.Movie?.release as number}
                  duration={movie.Movie?.duration as number}
                  watchList={movie.Movie?.WatchLists?.length !== undefined && movie.Movie?.WatchLists?.length > 0 ? true : false}
                  watchlistId={movie.Movie?.WatchLists[0]?.id as string}
                  movieId={movie.Movie?.id as number}
                  imageCardWrapper={true}
                  imageStyle="rounded-sm"    />
              </div>
            ))}
          </CarouselModal>
        </CardProvider>
        </VideoProvider>
      ) : (
            <div 
              className="text-[#666] sm:text-lg select-none fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
            >
              You haven&acute;t added any titles to your list yet.
            </div>
          )
      }
    </div>
  );
}