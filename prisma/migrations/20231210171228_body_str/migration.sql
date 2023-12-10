/*
  Warnings:

  - Added the required column `bodyStr` to the `attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attachment" ADD COLUMN     "bodyStr" VARCHAR(1048576) NOT NULL;
