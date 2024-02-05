/*
  Warnings:

  - You are about to drop the column `begin_date` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `post` table. All the data in the column will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `division_id` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_division_id_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_department_id_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "begin_date",
DROP COLUMN "department_id",
DROP COLUMN "end_date",
ADD COLUMN     "division_id" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- DropTable
DROP TABLE "department";

-- CreateTable
CREATE TABLE "employee" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "patronymic" VARCHAR(50) NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
