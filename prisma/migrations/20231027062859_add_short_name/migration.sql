/*
  Warnings:

  - You are about to drop the column `stop_for_all` on the `division` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "division" DROP COLUMN "stop_for_all",
ADD COLUMN     "short_name" VARCHAR(20);
