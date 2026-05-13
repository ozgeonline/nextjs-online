"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { Prisma } from "@prisma/client";

export async function addTowatchlist(formData: FormData) {
  "use server";
  try {
    const movieId = formData.get("movieId");
    const pathname = formData.get("pathname")?.toString();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email;

    if (!userId || !movieId || !pathname) {
      throw new Error("Missing required fields");
    }
    //console.log(`Checking if movie ${movieId} is already in the watchlist for user ${userId}`);

    const existingEntry = await prisma.watchList.findFirst({
      where: {
        userId,
        movieId: Number(movieId),
      },
    });

    if (existingEntry) {
      return { message: "Movie already in watchlist" };
    }

    //console.log("Adding movie to watchlist...");

    await prisma.watchList.create({
      data: {
        userId,
        movieId: Number(movieId),
      },
    });
    revalidatePath(pathname);
    return { message: "Added to watchlist" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { message: "Movie already in watchlist" };
    }
    //console.error("Error adding to watchlist:", error);
    throw error;
  }
}

export async function deleteFromWatchlist(formData: FormData) {
  "use server";

  const watchlistId = formData.get("watchlistId") as string;
  const pathname = formData.get("pathname") as string;

  const existingItem = await prisma.watchList.findUnique({
    where: {
      id: watchlistId,
    },
  });

  if (existingItem) {
    await prisma.watchList.delete({
      where: {
        id: watchlistId,
      },
    });
  }

  revalidatePath(pathname);
}
