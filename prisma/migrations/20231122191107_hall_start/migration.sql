-- CreateTable
CREATE TABLE "hall" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200),
    "short_name" VARCHAR(50),
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "hall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_divisionTohall" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "hall_u_ind" ON "hall"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hall_short_u_ind" ON "hall"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "_divisionTohall_AB_unique" ON "_divisionTohall"("A", "B");

-- CreateIndex
CREATE INDEX "_divisionTohall_B_index" ON "_divisionTohall"("B");

-- AddForeignKey
ALTER TABLE "_divisionTohall" ADD CONSTRAINT "_divisionTohall_A_fkey" FOREIGN KEY ("A") REFERENCES "division"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_divisionTohall" ADD CONSTRAINT "_divisionTohall_B_fkey" FOREIGN KEY ("B") REFERENCES "hall"("id") ON DELETE CASCADE ON UPDATE CASCADE;
