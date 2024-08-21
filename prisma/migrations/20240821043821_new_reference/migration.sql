/*
  Warnings:

  - You are about to drop the column `authorId` on the `comment` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_id` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_authorId_fkey";

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "authorId",
ADD COLUMN     "author_id" INTEGER NOT NULL,
ADD COLUMN     "card_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
