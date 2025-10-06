import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Prisma, Question, Resume } from "@prisma/client";
import {
  ConfiguredQuestion,
  ConfiguredResumeType,
} from "./ApplyJobDataContainer";
import JobApplicationForm from "./JobApplicationForm";

const JobApplicationSheet = ({
  jobDescription,
  jobTitle,
  questions,
  resumes,
}: {
  jobTitle: string;
  jobDescription: string | null;
  questions: ConfiguredQuestion[];
  resumes: ConfiguredResumeType[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="min-w-[120px]">
          <Send /> Apply
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{jobTitle}</SheetTitle>
          <SheetDescription>{jobDescription}</SheetDescription>
        </SheetHeader>
        <JobApplicationForm questions={questions} resumes={resumes} />
      </SheetContent>
    </Sheet>
  );
};

export default JobApplicationSheet;
