/*
  Warnings:

  - You are about to drop the column `can_view` on the `user_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_accounts" DROP COLUMN "can_view",
ADD COLUMN     "can_create" BOOLEAN NOT NULL DEFAULT true;
