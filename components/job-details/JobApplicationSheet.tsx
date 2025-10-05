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
import { Prisma, Question } from "@prisma/client";
import { ConfiguredQuestion } from "./ApplyJobDataContainer";
import JobApplicationForm from "./JobApplicationForm";

const JobApplicationSheet = ({
  jobDescription,
  jobTitle,
  questions,
}: {
  jobTitle: string;
  jobDescription: string | null;
  questions: ConfiguredQuestion[];
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
        <JobApplicationForm questions={questions} />
      </SheetContent>
    </Sheet>
  );
};

export default JobApplicationSheet;
