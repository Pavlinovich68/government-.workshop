/*
  Warnings:

  - You are about to drop the column `avatar_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_id";
