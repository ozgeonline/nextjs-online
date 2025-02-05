import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import { getServerSession } from "next-auth/next";
import MovieVideo from "@/app/components/widgets/video_widgets/MovieVideo";
import dynamic from 'next/dynamic';
import { CardProvider } from "@/app/components/providers/CardContext";
import { VideoProvider } from "@/app/components/providers/VideoContext";
import styles from "../home.module.css"

const CarouselModal = dynamic(() => import('@/app/components/providers/CarouselModal'));
const PreviewCard = dynamic(() => import('@/app/components/widgets/card_widgets/PreviewCard'));
const BrowseBySortClientPage = dynamic(() => import('@/app/components/controls/button/action/BrowseBySortClientPage'));

async function getData(
  category: string, 
  userId: string, 
  sortOrder: 'default' | 'asc' | 'desc', 
  query: string 
) {
  const selectFields = {
    id: true,
    title: true,
    imageString: true,
    videoSource: true,
    overview: true,
    release: true,
    duration: true,
    age: true,
    cast: true,
    genres: true,
    category: true,
    WatchLists: {
      where: { 
        userId: userId
      }
    }
  }
  
  switch (category) {
    case "shows": {
      const data = await prisma.movie.findMany({
        where: { category: "show" },
        select: selectFields,
      })
      return data
    }
    case "movies": {
      const data = await prisma.movie.findMany({
        where: { category: "movie" },
        select: selectFields,
      })
      return data
    }
    case "new": {
      const data = await prisma.movie.findMany({
        where: { release : 2024 },
        select: selectFields,
        take:50,
        orderBy: { createdAt: "asc", },
      })
      return data
    }
    case "audio": {
      const data = await prisma.movie.findMany({
        select: selectFields,
        orderBy: sortOrder === 'asc' || sortOrder === 'desc' ? { title: sortOrder } : undefined
      })
      return data
    }
    case "query": {
      const data = await prisma.movie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive'} },
            { genres: { contains: query, mode: 'insensitive'} } 
          ]
        },
        select: selectFields,
      })
      return data
    }
    case "kids": {
      const data = await prisma.movie.findMany({
        where: { age : {lte:7} },
        select: selectFields,
      })
      return data
    }
    default: {
      throw new Error("Invalid Category");
    }
  }
}

const normalizeTurkishCharacters = (str: string) => {
  return str
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G");
};

interface CategoryPageProps {
  params: Promise<{
    genre: string;
    title?: string;
  }>;
  searchParams: Promise<{
    sortOrder?: 'default' | 'asc' | 'desc';
    query?: string;
  }>
}

export default async function CategoryPage({
    params,
    searchParams
  }: CategoryPageProps) {

    const resolvedSearchParams = await searchParams;
    const resolvedParams = await params;
    const genre = resolvedParams.genre ?? '';
    const title = resolvedParams.title ?? '';
    const session = await getServerSession(authOptions);
    const sortOrder = (resolvedSearchParams.sortOrder as 'default' | 'asc' | 'desc') || 'default';
    const query = resolvedSearchParams.query || '';
    const data = await getData(
      genre, 
      session?.user?.email ?? '', 
      sortOrder,
      query
    );
    const movie = data[0]
        
    data.forEach((movie) => {
      movie.title = normalizeTurkishCharacters(movie.title);
    });

    if(sortOrder !== 'default') {
      data.sort((a, b) => 
        sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      );
      //PreviewCard.propTypes.openDialogCardStyle.prototype === false
    }

    //const openDialogCardStyle = params.genre === "query" || params.genre === "audio";

    const sectionTitle =  
      genre === "new" ? "New on web" : 
      genre === "kids" ? "We Think You’ll Love These" : 
      movie.category === "show" ? "Popular TV Series" :
      movie.category === "movie" ? "Popular Movie Series" : 
      "more Series"
    

  return (
    <VideoProvider>
      <CardProvider>
      <div>
      {
        genre === "audio" ? (
          <>
          <div className="top-14 sm:top-24 relative padding-layout">
            <div className="flex max-sm:flex-col max-sm:space-y-2 sm:justify-between sm:items-center mb-14 sm:mb-24 ">
              <h1 className="text-2xl md:text-3xl">
                Browse by sort
              </h1>
              <BrowseBySortClientPage 
                initialData={data} 
                initialSortOrder={sortOrder} 
                title={title ?? ''}
              />
            </div>

            <div className={styles['genre-grid-layout']}>
              {data.map((movie) => (
                <div key={movie.title} className="relative w-full">
                  <PreviewCard
                    key={movie.id}
                    imageString={movie.imageString}
                    videoSource={movie.videoSource}
                    title={movie.title}
                    overview={movie.overview}
                    age={movie.age}
                    cast={movie.cast}
                    genres={movie.genres}
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
            </div>
        </div>
        </>
        
        ) : genre === "query" && data.length>0 ? (
          <div className="flex flex-col top-14 sm:top-32 relative padding-layout">
            <div className="genre-grid-layout">
              {data.map((movie) => (
                <div key={movie.title} className="relative w-full">
                  <PreviewCard
                    key={movie.id}
                    imageString={movie.imageString}
                    videoSource={movie.videoSource}
                    title={movie.title}
                    overview={movie.overview}
                    age={movie.age}
                    cast={movie.cast}
                    genres={movie.genres}
                    release={movie.release}
                    duration={movie.duration}
                    watchList={movie.WatchLists.length > 0 ? true : false}
                    watchlistId={movie.WatchLists[0]?.id as string}
                    movieId={movie.id}
                    imageCardWrapper={true}
                    imageStyle="rounded-sm max-lg:brightness-75 w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

        ) : genre === "query" && data.length<=0 ? (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs space-y-2">
            <p>{`Your search for "${query}" did not have any matches.`}</p>
            <p>Suggestions:</p>
            <ul className="list-disc ml-10">
              <li>Try different keywords</li>
              <li>Looking for a movie or TV show?</li>
              <li>Try using a movie, TV show title</li>
              <li>Try a genre, like comedy, romantic, sports, or drama</li>
            </ul>
          </div>

        ):(
          <>
            {movie &&  genre !== "new" && (
              <MovieVideo
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
                      movieId={movie.id} id={movie.id}              />
            )}

            <div className={`${genre === "new" ? "top-28" : "top-10"}  relative padding-layout`} >
              {/* <h1 className="relative title sm:text-xl">
                {
                  params.genre === "new" ? "New on web" : 
                  params.genre === "kids" ? "We Think You’ll Love These" : 
                  movie.category === "show" ? "Popular TV Series" :
                  movie.category === "movie" ? "Popular Movie Series" : 
                  "more Series"
                }
              </h1> */}
              <>
                <CarouselModal 
                  sliderButtonSection={true}
                  sectionTitle={sectionTitle}// optional
                  id={data.map(movie => movie.id)}
                  key={data.map(movie => movie.id).join('-')}
                >
                  {data.map((movie) => (
                    <div key={movie.id} className="relative w-full h-full " aria-label={`${movie.id}.Slider-item`}>
                      <PreviewCard 
                        key={movie.id}
                        imageString={movie.imageString}
                        videoSource={movie.videoSource}
                        title={movie.title}
                        overview={movie.overview}
                        age={movie.age}
                        cast={movie.cast}
                        genres={movie.genres}
                        release={movie.release}
                        duration={movie.duration}
                        watchList={movie.WatchLists.length > 0 ? true : false}
                        watchlistId={movie.WatchLists[0]?.id as string}
                        movieId={movie.id}
                        imageCardWrapper={true}
                        imageStyle="rounded-sm max-lg:brightness-75 w-full h-full" />
                    </div>
                  ))}
                </CarouselModal>
              </>
            </div>
          </>
        )}
      </div>
      </CardProvider>
      </VideoProvider>
    )
  }