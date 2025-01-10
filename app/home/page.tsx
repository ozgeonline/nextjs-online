import prisma from "../utils/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../utils/auth"
import dynamic from 'next/dynamic';
import React  from 'react';
import styles from "./home.module.css"
import { VideoProvider } from "../components/providers/VideoContext";
import { CardProvider } from "../components/providers/CardContext";
import ContinueWatchingCardModal from "../components/widgets/card_widgets/ContinueWatchingCard";

const MovieVideo = dynamic(() => import("../components/widgets/video_widgets/MovieVideo"));
const CarouselModal = dynamic(() => import('../components/providers/CarouselModal'));

async function getData(userId:string) {
  const data = await prisma.movie.findMany({
    select: {
      id: true,
      imageString: true,
      videoSource: true,
      title: true,
      overview: true,
      cast:true,
      genres: true,
      age: true,
      release: true,
      duration: true,
      category:true,
      WatchLists: {
        where: {
          userId: userId,
        },
      },
      WatchHistory: {
        where: {
          userId: userId,
        },
      }
    },
    orderBy: {
      createdAt: "desc",
    },
    take:50
  })
  return data
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const initialData = await getData(session?.user?.email as string);
  const movie = initialData[0];

  // if (!initialData || initialData.length === 0) {
  //   return <div>No data available</div>;
  // }

  //console.log(initialData)
  return (
    <>
    <div className="overflow-hidden ">
      <VideoProvider>
        <MovieVideo
          key={movie.id}
          id={movie.id}
          imageString={movie.imageString}
          videoSource={movie.videoSource}
          title={movie.title}
          overview={movie.overview}
          cast={movie.cast}
          genres={movie.genres}
          age={movie.age}
          release={movie.release}
          duration={movie.duration}
          watchList={movie.WatchLists.length > 0 ? true : false}
          watchlistId={movie.WatchLists[0]?.id as string}
          movieId={movie.id} 
        />

          <CardProvider> {/* //! Don't forget to edit for no render afterwards */}
        <div 
          className={`
            ${styles.sectionsWrapper}
            padding-layout mb-14 relative space-y-1 sm:space-y-4 lg:space-y-8 xl:space-y-12
            `}
        >
            <CarouselModal
              sliderButtonSection={true}
              // source={movie.videoSource}
              id={initialData.map((movie) => movie.id)}
              key={initialData.map((movie) => movie.id).join("-")}
              sectionTitle="Continue"
              filterWatchedVideos={true}
              // title={initialData.map((movie) => movie.title).join(", ")}
            >
              {initialData.map((data) => (
                <div
                  key={data.id}
                  className="w-auto h-full"
                  aria-label={`${data.id} : homepage`}
                >
                  <ContinueWatchingCardModal
                    videoSource={data.videoSource}
                    imageString={data.imageString}
                    title={data.title}
                    id={data.id}
                    alt={`${data.id}:Continue Watching Video`}
                  />
                </div>
              ))}
            </CarouselModal>

          
        </div>
          </CardProvider> {/*//!-end */}

      </VideoProvider>
    </div>
  </>
  );
}
