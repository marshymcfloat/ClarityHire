/*
  Warnings:

  - Added the required column `description` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "location" TEXT NOT NULL;
