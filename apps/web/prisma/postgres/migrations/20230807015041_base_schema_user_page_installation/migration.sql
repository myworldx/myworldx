/*
  Warnings:

  - You are about to drop the `Installation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `site_content` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "private"."enum_page_types" AS ENUM ('INDEX', 'BLOG', 'PROJECT', 'ROUTE', 'PATH', 'POST');

-- DropTable
DROP TABLE "private"."Installation";

-- DropTable
DROP TABLE "private"."Repository";

-- DropTable
DROP TABLE "private"."User";

-- DropTable
DROP TABLE "private"."site_content";

-- CreateTable
CREATE TABLE "private"."installation" (
    "db_id" SERIAL NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "db_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "db_updated_at" TIMESTAMP(3) NOT NULL,
    "db_deleted_at" TIMESTAMP(3),
    "db_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "installation_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "private"."user" (
    "db_id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "gravatar_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "following_url" TEXT NOT NULL,
    "followers_url" TEXT NOT NULL,
    "gists_url" TEXT NOT NULL,
    "starred_url" TEXT NOT NULL,
    "subscriptions_url" TEXT NOT NULL,
    "organizations_url" TEXT NOT NULL,
    "repos_url" TEXT NOT NULL,
    "events_url" TEXT NOT NULL,
    "received_events_url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "site_admin" TEXT NOT NULL,
    "db_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "db_updated_at" TIMESTAMP(3) NOT NULL,
    "db_deleted_at" TIMESTAMP(3),
    "db_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "private"."page_content" (
    "db_id" SERIAL NOT NULL,
    "db_user_id" INTEGER NOT NULL,
    "db_display_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,
    "node_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "db_blob_name" TEXT NOT NULL,
    "db_blob_url" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,

    CONSTRAINT "page_content_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "private"."page_types" (
    "id" SERIAL NOT NULL,
    "type" "private"."enum_page_types" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "page_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "installation_id_key" ON "private"."installation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "private"."user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "page_types_type_key" ON "private"."page_types"("type");

-- AddForeignKey
ALTER TABLE "private"."installation" ADD CONSTRAINT "installation_user_account" FOREIGN KEY ("account") REFERENCES "private"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."installation" ADD CONSTRAINT "installation_user_sender" FOREIGN KEY ("sender") REFERENCES "private"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."page_content" ADD CONSTRAINT "page_content_db_user_id_fkey" FOREIGN KEY ("db_user_id") REFERENCES "private"."user"("db_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private"."page_content" ADD CONSTRAINT "page_content_type_fkey" FOREIGN KEY ("type") REFERENCES "private"."page_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
