/*
  Warnings:

  - You are about to drop the column `tileImage` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `xCoord` on the `Map` table. All the data in the column will be lost.
  - You are about to drop the column `yCoord` on the `Map` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "tileImage",
DROP COLUMN "xCoord",
DROP COLUMN "yCoord",
ADD COLUMN     "columns" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "rows" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing maps to have the current timestamp for updatedAt
UPDATE "Map" SET "updatedAt" = CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "MapTile" (
    "id" SERIAL NOT NULL,
    "mapId" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "isWalkable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapTile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "maptile_mapId_idx" ON "MapTile"("mapId");

-- CreateIndex
CREATE UNIQUE INDEX "MapTile_mapId_x_y_key" ON "MapTile"("mapId", "x", "y");

-- AddForeignKey
ALTER TABLE "MapTile" ADD CONSTRAINT "MapTile_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;
