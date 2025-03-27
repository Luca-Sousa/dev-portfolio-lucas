/*
  Warnings:

  - Added the required column `description` to the `Technology` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Technology" ADD COLUMN     "description" TEXT NOT NULL;
