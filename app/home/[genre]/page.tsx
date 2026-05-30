import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import BrowseSortSelect from "@/app/components/controls/sort/BrowseSortSelect";
import { UIProvider } from "@/app/components/providers/UIContext";
import { VideoProvider } from "@/app/components/providers/VideoContext";
import Footer from "@/app/components/layout/Footer";
import PreviewCard from "@/app/components/widgets/cards/PreviewCard";
import InfiniteCarousel from "@/app/components/widgets/carousel/InfiniteCarousel";
import MovieVideo from "@/app/components/widgets/video-widgets/MovieVideo";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import styles from "../home.module.css";

type SortOrder = "default" | "asc" | "desc";
type ValidCategory = typeof VALID_CATEGORIES[number];

const SORT_ORDERS: SortOrder[] = ["default", "asc", "desc"];
const VALID_CATEGORIES = ["shows", "movies", "new", "audio", "query", "kids"] as const;

function parseSortOrder(sortOrder?: string): SortOrder {
  return SORT_ORDERS.includes(sortOrder as SortOrder)
    ? sortOrder as SortOrder
    : "default";
}

function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory);
}

function getMovieSelect(userId: string) {
  return {
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
        userId,
      },
      select: {
        id: true,
      },
    },
    Reactions: {
      where: {
        userId,
      },
      select: {
        isLiked: true,
      },
    },
  } as const satisfies Prisma.MovieSelect;
}

type CategoryMovie = Prisma.MovieGetPayload<{
  select: ReturnType<typeof getMovieSelect>
}>;

async function getData(
  category: ValidCategory,
  userId: string,
  sortOrder: SortOrder,
  query: string
): Promise<CategoryMovie[]> {
  const selectFields = getMovieSelect(userId);

  switch (category) {
    case "shows":
      return prisma.movie.findMany({
        where: { category: "show" },
        select: selectFields,
      });

    case "movies":
      return prisma.movie.findMany({
        where: { category: "movie" },
        select: selectFields,
      });

    case "new":
      return prisma.movie.findMany({
        select: selectFields,
        take: 50,
        orderBy: [
          { release: "desc" },
          { createdAt: "desc" },
        ],
      });

    case "audio":
      return prisma.movie.findMany({
        select: selectFields,
        orderBy: sortOrder === "default" ? undefined : { title: sortOrder },
      });

    case "query":
      if (!query) {
        return [];
      }

      return prisma.movie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { genres: { contains: query, mode: "insensitive" } },
          ],
        },
        select: selectFields,
      });

    case "kids":
      return prisma.movie.findMany({
        where: { age: { lte: 7 } },
        select: selectFields,
      });
  }
}

function getPreviewCardProps(movie: CategoryMovie) {
  return {
    id: movie.id,
    imageString: movie.imageString,
    videoSource: movie.videoSource,
    title: movie.title,
    overview: movie.overview,
    age: movie.age,
    cast: movie.cast,
    genres: movie.genres,
    release: movie.release,
    duration: movie.duration,
    watchList: movie.WatchLists.length > 0,
    watchlistId: movie.WatchLists[0]?.id,
    movieId: movie.id,
    movieReactionIsLiked: movie.Reactions[0]?.isLiked ?? null,
  };
}

function getSectionTitle(genre: ValidCategory, movie: CategoryMovie | null) {
  if (genre === "new") return "New on web";
  if (genre === "kids") return "We Think You'll Love These";
  if (movie?.category === "show") return "Popular TV Series";
  if (movie?.category === "movie") return "Popular Movie Series";

  return "More Series";
}

interface CategoryPageProps {
  params: Promise<{
    genre: string;
  }>;
  searchParams: Promise<{
    sortOrder?: string;
    query?: string;
  }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;
  const genre = resolvedParams.genre ?? "";

  if (!isValidCategory(genre)) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const sortOrder = parseSortOrder(resolvedSearchParams.sortOrder);
  const query = resolvedSearchParams.query?.trim() || "";
  const data = await getData(
    genre,
    session?.user?.email ?? "",
    sortOrder,
    query
  );
  const movie = data[0] ?? null;
  const movieIds = data.map((movie) => movie.id);
  const sectionTitle = getSectionTitle(genre, movie);

  return (
    <VideoProvider>
      <UIProvider>
        <div className="overflow-hidden mb-10 h-full">
          {genre === "audio" ? (
            <div className="top-14 sm:top-24 pb-[55vh] relative padding-layout">
              <div className="flex max-sm:flex-col max-sm:space-y-2 sm:justify-between sm:items-center mb-14 sm:mb-24">
                <h1 className="text-2xl md:text-3xl">
                  Browse by sort
                </h1>
                <BrowseSortSelect initialSortOrder={sortOrder} />
              </div>

              <div className={styles["genre-grid-layout"]}>
                {data.map((movie) => (
                  <div key={movie.id} className="relative w-full">
                    <PreviewCard
                      {...getPreviewCardProps(movie)}
                      imageCardWrapper={true}
                      imageStyle="rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : genre === "query" && data.length > 0 ? (
            <div className="flex flex-col top-14 sm:top-32 relative padding-layout pb-[55vh]">
              <div className={styles["genre-grid-layout"]}>
                {data.map((movie) => (
                  <div key={movie.id} className="relative w-full">
                    <PreviewCard
                      {...getPreviewCardProps(movie)}
                      imageCardWrapper={true}
                      imageStyle="rounded-sm max-lg:brightness-75 w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : genre === "query" && data.length === 0 ? (
            <div className="absolute top-[30vh] left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs space-y-2">
              <p>{`Your search for "${query}" did not have any matches.`}</p>
              <p>Suggestions:</p>
              <ul className="list-disc ml-10">
                <li>Try different keywords</li>
                <li>Looking for a movie or TV show?</li>
                <li>Try using a movie, TV show title</li>
                <li>Try a genre, like comedy, romantic, sports, or drama</li>
              </ul>
            </div>
          ) : (
            <>
              {movie && genre !== "new" && (
                <MovieVideo
                  {...getPreviewCardProps(movie)}
                  id={movie.id}
                />
              )}

              <div
                className={`
                  relative padding-layout
                  ${genre === "new" ? styles.newSectionWrapper : styles.sectionsWrapper}
                `}
              >
                <InfiniteCarousel
                  sliderButtonSection={true}
                  sectionTitle={sectionTitle}
                  id={movieIds}
                  key={movieIds.join("-")}
                >
                  {data.map((movie) => (
                    <div
                      key={movie.id}
                      className="relative w-full h-full"
                      aria-label={`${movie.id}.Slider-item`}
                    >
                      <PreviewCard
                        {...getPreviewCardProps(movie)}
                        imageCardWrapper={true}
                        imageStyle="rounded-sm max-lg:brightness-75 w-full h-full"
                      />
                    </div>
                  ))}
                </InfiniteCarousel>
              </div>
            </>
          )}
        </div>

        <div className="-z-10">
          <Footer />
        </div>
      </UIProvider>
    </VideoProvider>
  );
}
