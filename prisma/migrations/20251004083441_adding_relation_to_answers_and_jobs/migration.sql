/*
  Warnings:

  - You are about to drop the `AnswerOnQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AnswerOnQuestion" DROP CONSTRAINT "AnswerOnQuestion_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnswerOnQuestion" DROP CONSTRAINT "AnswerOnQuestion_questionId_fkey";

-- DropTable
DROP TABLE "public"."AnswerOnQuestion";

-- CreateTable
CREATE TABLE "public"."QuestionOnJob" (
    "jobId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QuestionOnJob_pkey" PRIMARY KEY ("jobId","questionId")
);

-- CreateTable
CREATE TABLE "public"."ApplicationAnswer" (
    "id" TEXT NOT NULL,
    "answer" TEXT[],
    "applicationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "ApplicationAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationAnswer_applicationId_questionId_key" ON "public"."ApplicationAnswer"("applicationId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."QuestionOnJob" ADD CONSTRAINT "QuestionOnJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionOnJob" ADD CONSTRAINT "QuestionOnJob_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationAnswer" ADD CONSTRAINT "ApplicationAnswer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApplicationAnswer" ADD CONSTRAINT "ApplicationAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
