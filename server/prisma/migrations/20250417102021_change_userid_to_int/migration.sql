/*
  Warnings:

  - The primary key for the `ProductReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `userId` on the `ProductReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ProductReview" DROP CONSTRAINT "ProductReview_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductReview_id_seq";

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
