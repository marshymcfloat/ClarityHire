import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import prisma from "@/prisma/prisma";
import ApplyForm from "./JobApplicationSheet";

const ApplyJobButton = async ({
  jobId,
  jobTitle,
  jobDescription,
}: {
  jobId: string;
  jobDescription?: string | null;
  jobTitle: string;
}) => {
  const jobQuestions = await prisma.questionOnJob.findMany({
    where: { jobId: jobId },
  });

  console.log(jobQuestions);

  return (
    <>
      <ApplyForm jobTitle={jobTitle} jobDescription={jobDescription} />
    </>
  );
};

export default ApplyJobButton;
