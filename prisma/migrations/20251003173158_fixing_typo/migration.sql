/*
  Warnings:

  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."QuestionTypeEnum" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'NUMBER', 'CHECKBOX', 'TRUE_OR_FALSE');

-- AlterTable
ALTER TABLE "public"."Question" DROP COLUMN "type",
ADD COLUMN     "type" "public"."QuestionTypeEnum" NOT NULL;

-- DropEnum
DROP TYPE "public"."QuestionTypEnum";
