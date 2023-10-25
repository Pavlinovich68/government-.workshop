-- CreateTable
CREATE TABLE "division" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200),
    "parent_id" INTEGER,
    "stop_for_all" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100),
    "begin_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6),
    "password" VARCHAR(255),
    "division_id" INTEGER NOT NULL,
    "roles" JSON,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "division_u_ind" ON "division"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_u_ind" ON "users"("email");

-- AddForeignKey
ALTER TABLE "division" ADD CONSTRAINT "division_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
