-- CreateEnum
CREATE TYPE "public"."WorkArrangement" AS ENUM ('ON_SITE', 'HYBRID', 'REMOTE');

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "qualifications" TEXT[],
ADD COLUMN     "responsibilities" TEXT[],
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "workArrangement" "public"."WorkArrangement" NOT NULL DEFAULT 'ON_SITE',
ADD COLUMN     "workSchedule" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
