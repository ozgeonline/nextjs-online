"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import prisma from "./db";

type ReactionActionResult = {
  ok: boolean;
  isLiked?: boolean;
  error?: string;
};

function parseMovieId(movieId: number): number {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    throw new Error("Invalid movie id");
  }

  return movieId;
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

export async function setMovieReaction(
  movieId: number,
  isLiked: boolean,
  pathname: string,
): Promise<ReactionActionResult> {
  try {
    const userId = await getCurrentUserId();
    const validMovieId = parseMovieId(movieId);
    const revalidationPath = getSafeRevalidationPath(pathname);

    const reaction = await prisma.movieReaction.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: validMovieId,
        },
      },
      update: {
        isLiked,
      },
      create: {
        userId,
        movieId: validMovieId,
        isLiked,
      },
      select: {
        isLiked: true,
      },
    });

    revalidatePath(revalidationPath);
    return { ok: true, isLiked: reaction.isLiked };
  } catch {
    return { ok: false, error: "Unable to update reaction." };
  }
}
