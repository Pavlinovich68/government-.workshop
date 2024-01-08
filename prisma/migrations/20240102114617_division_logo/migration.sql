-- AlterTable
ALTER TABLE "division" ADD COLUMN     "attachment_id" INTEGER;

-- AddForeignKey
ALTER TABLE "division" ADD CONSTRAINT "division_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
