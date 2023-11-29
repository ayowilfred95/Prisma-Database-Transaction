/*
  Warnings:

  - You are about to drop the column `email` on the `Account` table. All the data in the column will be lost.
  - Added the required column `name` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_email_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "email",
ADD COLUMN     "name" TEXT NOT NULL;
