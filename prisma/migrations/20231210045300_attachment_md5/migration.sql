/*
  Warnings:

  - Added the required column `md5` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "md5" VARCHAR(32) NOT NULL;
