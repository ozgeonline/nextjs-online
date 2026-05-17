"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { Prisma } from "@prisma/client";
import { authOptions } from "./auth";
import prisma from "./db";

type WatchlistActionResult = {
  ok: boolean;
  watchlistId?: string;
  error?: string;
};

function parseMovieId(movieId: number): number {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new Error("Invalid movie id");
  }

  return movieId;
}

function parseWatchlistId(watchlistId: string): string {
  const normalizedWatchlistId = watchlistId.trim();

  if (!normalizedWatchlistId) {
    throw new Error("Invalid watchlist id");
  }

  return normalizedWatchlistId;
}

function getSafeRevalidationPath(pathname: string): string {
  return pathname.startsWith("/") ? pathname : "/home";
}

async function getCurrentUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

export async function addToWatchlist(
  movieId: number,
  pathname: string,
): Promise<WatchlistActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validMovieId = parseMovieId(movieId);
    const revalidationPath = getSafeRevalidationPath(pathname);

    const existingEntry = await prisma.watchList.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId: validMovieId,
        },
      },
    });

    if (existingEntry) {
      return { ok: true, watchlistId: existingEntry.id };
    }

    const watchlistEntry = await prisma.watchList.create({
      data: {
        userId,
        movieId: validMovieId,
      },
      select: {
        id: true,
      },
    });

    revalidatePath(revalidationPath);
    return { ok: true, watchlistId: watchlistEntry.id };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: true };
    }

    return { ok: false, error: "Unable to update watchlist." };
  }
}

export async function deleteFromWatchlist(
  watchlistId: string,
  pathname: string,
): Promise<WatchlistActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validWatchlistId = parseWatchlistId(watchlistId);
    const revalidationPath = getSafeRevalidationPath(pathname);

    await prisma.watchList.deleteMany({
      where: {
        id: validWatchlistId,
        userId,
      },
    });

    revalidatePath(revalidationPath);
    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to update watchlist." };
  }
}
