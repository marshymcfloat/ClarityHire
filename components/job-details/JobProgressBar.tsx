import { ApplicationStatus } from "@prisma/client/edge";
import { Separator } from "../ui/separator";

const JobProgressBar = ({ status }: { status?: ApplicationStatus }) => {
  return (
    <div className="w-[90%] items-center h-[100px] flex font-medium mx-auto">
      <span className="text-xs">Start</span>
      <Separator className="flex-1 " />
      <div className="size-6 rounded-full bg-lime-200 relative">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs">
          Submitted
        </span>
      </div>
      <Separator className="flex-1" />
      <div className="size-6 rounded-full bg-lime-200 relative">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs">
          In Review
        </span>
      </div>
      <Separator className="flex-1" />{" "}
      <div className="size-6 rounded-full bg-lime-200  relative">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs">
          Interview
        </span>
      </div>
      <Separator className="flex-1" />{" "}
      <div className="size-6 rounded-full bg-lime-200 relative">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs">
          Interview Review
        </span>
      </div>
      <Separator className="flex-1" />{" "}
      <div className="size-6 rounded-full bg-lime-200 relative">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-xs">
          Offer
        </span>
      </div>
    </div>
  );
};

export default JobProgressBar;
