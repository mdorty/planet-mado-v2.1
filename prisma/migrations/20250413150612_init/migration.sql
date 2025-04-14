/*
  Warnings:

  - You are about to drop the column `moves` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `effect` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_userId_fkey";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "moves";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "alignment" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "basePowerlevel" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "currentPowerlevel" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "deathCount" INTEGER DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "died" TIMESTAMP(3),
ADD COLUMN     "equippedItems" TEXT DEFAULT 'None',
ADD COLUMN     "hiddenPowerlevel" INTEGER DEFAULT 0,
ADD COLUMN     "items" TEXT DEFAULT 'None',
ADD COLUMN     "jobs" TEXT,
ADD COLUMN     "lastDateMeditated" TIMESTAMP(3),
ADD COLUMN     "lastDateTrained" TIMESTAMP(3),
ADD COLUMN     "peopleYouHaveBeenTo" TEXT DEFAULT 'None',
ADD COLUMN     "planet" TEXT,
ADD COLUMN     "race" TEXT NOT NULL DEFAULT 'Unknown';

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "effect",
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "name",
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Move" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "percentDamage" INTEGER,
    "percentCost" INTEGER,
    "chargeable" BOOLEAN DEFAULT false,
    "stunTurns" INTEGER,
    "stunChancePercent" INTEGER,
    "powerlevelMultiplier" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
