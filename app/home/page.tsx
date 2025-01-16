import prisma from "../utils/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../utils/auth"
import dynamic from 'next/dynamic';
import React  from 'react';
import styles from "./home.module.css"
import { VideoProvider } from "../components/providers/VideoContext";
import { CardProvider } from "../components/providers/CardContext";
import ContinueWatchingCardModal from "../components/widgets/card_widgets/ContinueWatchingCard";
import PreviewCard from "../components/widgets/card_widgets/PreviewCard";
import Top10TV from "../components/widgets/card_widgets/Top10TV";

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

        <CardProvider> {/* //! */}
          <div 
            className={`
              ${styles.sectionsWrapper}
              padding-layout mb-14 relative space-y-1 sm:space-y-4 lg:space-y-8 xl:space-y-12
            `}
          >
            <CarouselModal
              sliderButtonSection={true}
              id={initialData.map((movie) => movie.id)}
              key={initialData.map((movie) => movie.id).join("-")}
              sectionTitle="Continue"
              filterWatchedVideos={true}
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

            {/* //? --- Home Page Sections --- */}
            <>
              <Section 
                sectionTitle="New"
                movies={initialData.filter(movie => movie.release === 2024)}
              />
              <SectionTop10 
                sectionTitle="Top 10 TV Shows Today"
                movies={initialData.filter(movie => movie.category === "show").slice(0, 10)}
              />
              <Section 
                sectionTitle="Family Time TV"
                movies={initialData.filter(movie => movie.age < 13)}
              />
              <Section 
                sectionTitle="Comedy Movies"
                movies={initialData.filter(movie => movie.category === "movie" && movie.genres.toLowerCase().includes("comedy"))}
              />
              <SectionTop10 
                sectionTitle="Top 10 Movies Today"
                movies={initialData.filter(movie => movie.category === "movie").slice(0, 10)}
              />
              <Section 
                sectionTitle="TV Dramas"
                movies={initialData.filter(movie => movie.category === "show" && movie.genres.toLowerCase().includes("dramas"))}
              />
              <Section 
                sectionTitle="Get In On the Action"
                movies={initialData.filter(movie => movie.genres.toLowerCase().includes("action"))}
              />
            </>
          </div>
        </CardProvider> {/*//!-end */}

      </VideoProvider>
    </div>
    </>
  );
}

interface SectionProps {
  sectionTitle: string;
  movies: any[];
}

const Section: React.FC<SectionProps> = ({ sectionTitle, movies }) => (
  
  <CardProvider>
    <CarouselModal
      sliderButtonSection={true}
      sectionTitle={sectionTitle}
      id={movies.map(movie => movie.id)}
      key={movies.map(movie => movie.id).join('-')}
    >
      {movies.map(movie => (
        <div 
          key={movie.id} 
          className="relative w-full h-full"
          aria-label={`Section -- ${movie.id}.Slider-item`}
        >
          <PreviewCard
            key={movie.id}
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
            imageCardWrapper={true}
            imageStyle="rounded-sm"
          />
        </div>
      ))}
    </CarouselModal>
  </CardProvider>
);

const SectionTop10: React.FC<SectionProps> = ({ sectionTitle, movies }) => (
  <CardProvider>
    <CarouselModal
      sliderButtonSectionTop10={true}
      sectionTitle={sectionTitle}
      id={movies.map(movie => movie.id)}
      key={movies.map(movie => movie.id).join('-')}
    >
      {movies.map((movie,index) => (
        <Top10TV
          key={index}
          index={index}
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
          watchlistId={movie.WatchLists[0]?.id  as string}
          movieId={movie.id}
        />
      ))}
    </CarouselModal>
  </CardProvider>
);