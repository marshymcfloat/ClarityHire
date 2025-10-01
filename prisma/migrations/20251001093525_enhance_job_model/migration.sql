/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `experienceLevel` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "public"."ExperienceLevel" AS ENUM ('INTERNSHIP', 'ENTRY_LEVEL', 'ASSOCIATE', 'MID_LEVEL', 'SENIOR', 'STAFF', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "department" TEXT,
ADD COLUMN     "experienceLevel" "public"."ExperienceLevel" NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jobType" "public"."JobType" NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "public"."Company"("slug");
