-- AlterTable
ALTER TABLE "users" ADD COLUMN     "attachment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
