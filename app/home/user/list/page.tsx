import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { UIProvider } from "@/app/components/providers/UIContext";
import { VideoProvider } from "@/app/components/providers/VideoContext";
import Footer from "@/app/components/layout/Footer";
import PreviewCard from "@/app/components/widgets/cards/PreviewCard";
import InfiniteCarousel from "@/app/components/widgets/carousel/InfiniteCarousel";
import { authOptions } from "@/app/utils/auth";
import prisma from "@/app/utils/db";

function getWatchlistSelect(userId: string) {
  return {
    id: true,
    Movie: {
      select: {
        id: true,
        title: true,
        age: true,
        duration: true,
        imageString: true,
        overview: true,
        release: true,
        videoSource: true,
        cast: true,
        genres: true,
        category: true,
        Reactions: {
          where: {
            userId,
          },
          select: {
            isLiked: true,
          },
        },
      },
    },
  } as const satisfies Prisma.WatchListSelect;
}

type WatchlistQueryItem = Prisma.WatchListGetPayload<{
  select: ReturnType<typeof getWatchlistSelect>;
}>;

// Prisma marks the Movie relation as nullable, so this type represents items
// after the null relation has been filtered out.
type WatchlistItemWithValidMovie = WatchlistQueryItem & {
  Movie: NonNullable<WatchlistQueryItem["Movie"]>;
};

async function getWatchlistItems(userId: string): Promise<WatchlistQueryItem[]> {
  return prisma.watchList.findMany({
    where: {
      userId,
    },
    select: getWatchlistSelect(userId),
    orderBy: {
      id: "desc",
    },
  });
}

function hasMovie(item: WatchlistQueryItem): item is WatchlistItemWithValidMovie {
  return item.Movie !== null;
}

function getPreviewCardProps(item: WatchlistItemWithValidMovie) {
  return {
    id: item.Movie.id,
    imageString: item.Movie.imageString,
    videoSource: item.Movie.videoSource,
    title: item.Movie.title,
    overview: item.Movie.overview,
    cast: item.Movie.cast,
    genres: item.Movie.genres,
    age: item.Movie.age,
    release: item.Movie.release,
    duration: item.Movie.duration,
    watchList: true,
    watchlistId: item.id,
    movieId: item.Movie.id,
    movieReactionIsLiked: item.Movie.Reactions[0]?.isLiked ?? null,
  };
}

export default async function WatchlistPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;

  if (!userId) {
    redirect("/tr-en");
  }

  const data = await getWatchlistItems(userId);
  const watchlistItems = data.filter(hasMovie);
  const movieIds = watchlistItems.map((item) => item.Movie.id);

  return (
    <div className="flex flex-col relative overflow-hidden">
      {watchlistItems.length > 0 ? (
        <VideoProvider>
          <UIProvider>
            <div className="pb-[55vh] padding-layout">
              <InfiniteCarousel
                sliderButtonSection={true}
                sectionTitle="My List"
                sectionTitleStyle="mt-24 mb-5"
                id={movieIds}
                key={movieIds.join("-")}
              >
                {watchlistItems.map((item) => (
                  <div key={item.Movie.id} className="relative w-full h-full">
                    <PreviewCard
                      {...getPreviewCardProps(item)}
                      imageCardWrapper={true}
                      imageStyle="rounded-sm"
                    />
                  </div>
                ))}
              </InfiniteCarousel>
            </div>

            <Footer />
          </UIProvider>
        </VideoProvider>
      ) : (
        <div className="text-[#666] sm:text-lg select-none fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          {"You haven't added any titles to your list yet."}
        </div>
      )}
    </div>
  );
}
