-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_id" INTEGER;

-- CreateTable
CREATE TABLE "attachment" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),
    "md5" VARCHAR(16) NOT NULL,
    "body" BYTEA NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
