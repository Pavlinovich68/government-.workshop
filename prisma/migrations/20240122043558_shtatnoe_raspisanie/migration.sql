-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "division_id" INTEGER NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "begin_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6),
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
