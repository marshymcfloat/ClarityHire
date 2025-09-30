-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'HIRED');

-- AlterTable
ALTER TABLE "public"."Application" ADD COLUMN     "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED';
