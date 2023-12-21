-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200),
    "year" INTEGER NOT NULL DEFAULT 2023,
    "month" INTEGER NOT NULL DEFAULT 7,
    "day" INTEGER NOT NULL DEFAULT 23,
    "start" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "color" VARCHAR(6) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locked" (
    "id" SERIAL NOT NULL,
    "note" VARCHAR(200) NOT NULL,
    "begin_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,
    "hall_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,

    CONSTRAINT "locked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locked" ADD CONSTRAINT "locked_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "hall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locked" ADD CONSTRAINT "locked_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
