/*
  Warnings:

  - You are about to drop the column `md5` on the `attachment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `attachment` table. All the data in the column will be lost.
  - Added the required column `date` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" DROP COLUMN "md5",
DROP COLUMN "name",
ADD COLUMN     "date" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "size" BIGINT NOT NULL,
ADD COLUMN     "type" VARCHAR(50) NOT NULL;
