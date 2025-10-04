import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import JobApplicationForm from "./JobApplicationForm";
const JobApplicationSheet = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription?: string | null;
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
          <SheetTitle className="text-2xl">{jobTitle}</SheetTitle>
          <SheetDescription>{jobDescription}</SheetDescription>
        </SheetHeader>
        <JobApplicationForm />
      </SheetContent>
    </Sheet>
  );
};

export default JobApplicationSheet;
