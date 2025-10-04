-- CreateEnum
CREATE TYPE "public"."QuestionTypEnum" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'NUMBER', 'CHECKBOX', 'TRUE_OR_FALSE');

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "public"."QuestionTypEnum" NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnswerOnQuestion" (
    "id" TEXT NOT NULL,
    "answer" TEXT[],
    "applicantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "AnswerOnQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerOnQuestion" ADD CONSTRAINT "AnswerOnQuestion_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerOnQuestion" ADD CONSTRAINT "AnswerOnQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
