import { Prisma, QuestionTypeEnum } from "@prisma/client";
import JobApplicationSheet from "./JobApplicationSheet";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type ConfiguredQuestion = {
  question: {
    id: string; // <-- Add question ID
    question: string;
    type: QuestionTypeEnum;
    options: string[];
  };
  isRequired: boolean;
};

export type ConfiguredResumeType = {
  id: string;
  name: string;
  createdAt: Date;
  url: string;
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
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <p>Please login first</p>;
  }

  const questionsForThisJob = await prisma.questionOnJob.findMany({
    where: {
      jobId,
    },
    select: {
      isRequired: true, // <-- Select isRequired
      question: {
        select: {
          id: true, // <-- Select question ID
          question: true,
          options: true,
          type: true,
        },
      },
    },
    orderBy: {
      order: "asc", // Good practice to order the questions
    },
  });

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      url: true,
    },
  });

  return (
    <>
      <JobApplicationSheet
        jobDescription={jobDescription}
        jobTitle={jobTitle}
        questions={questionsForThisJob}
        resumes={resumes}
      />
    </>
  );
};

export default ApplyJobDataContainer;
