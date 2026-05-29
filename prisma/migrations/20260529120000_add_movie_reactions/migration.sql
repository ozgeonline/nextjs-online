-- CreateTable
CREATE TABLE "MovieReaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "isLiked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieReaction_userId_movieId_key" ON "MovieReaction"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "MovieReaction" ADD CONSTRAINT "MovieReaction_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
