/*
  Warnings:

  - Changed the type of `account` on the `installation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sender` on the `installation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "private"."installation" DROP CONSTRAINT "installation_user_account";

-- DropForeignKey
ALTER TABLE "private"."installation" DROP CONSTRAINT "installation_user_sender";

-- AlterTable
ALTER TABLE "private"."installation" DROP COLUMN "account",
ADD COLUMN     "account" INTEGER NOT NULL,
DROP COLUMN "sender",
ADD COLUMN     "sender" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "private"."user" DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "private"."user"("id");

-- AddForeignKey
ALTER TABLE "private"."installation" ADD CONSTRAINT "installation_user_account" FOREIGN KEY ("account") REFERENCES "private"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."installation" ADD CONSTRAINT "installation_user_sender" FOREIGN KEY ("sender") REFERENCES "private"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
