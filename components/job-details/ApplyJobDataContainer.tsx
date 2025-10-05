import { Prisma, QuestionTypeEnum } from "@prisma/client";
import JobApplicationSheet from "./JobApplicationSheet";
import prisma from "@/prisma/prisma";

export type ConfiguredQuestion = {
  question: {
    question: string;
    type: QuestionTypeEnum;
    options: string[];
  };
};

const ApplyJobDataContainer = async ({
  jobId,
  jobTitle,
  jobDescription,
}: {
  jobId: string;
  jobTitle: string;
  jobDescription: string | null;
}) => {
  const questionsForThisJob = await prisma.questionOnJob.findMany({
    where: {
      jobId,
    },
    select: {
      question: {
        select: {
          question: true,
          options: true,
          type: true,
        },
      },
    },
  });

  return (
    <>
      <JobApplicationSheet
        jobDescription={jobDescription}
        jobTitle={jobTitle}
        questions={questionsForThisJob}
      />
    </>
  );
};

export default ApplyJobDataContainer;
