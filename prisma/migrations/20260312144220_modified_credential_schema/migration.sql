-- DropForeignKey
ALTER TABLE "credential" DROP CONSTRAINT "credential_id_fkey";

-- AddForeignKey
ALTER TABLE "credential" ADD CONSTRAINT "credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
