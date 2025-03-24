/*
  Warnings:

  - You are about to drop the column `roomName` on the `Shape` table. All the data in the column will be lost.
  - Added the required column `roomSlug` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_roomName_fkey";

-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "roomName",
ADD COLUMN     "roomSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_roomSlug_fkey" FOREIGN KEY ("roomSlug") REFERENCES "Room"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
