/*
  Warnings:

  - You are about to alter the column `size` on the `attachment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "attachment" ALTER COLUMN "size" SET DATA TYPE INTEGER;
