import prisma from "@/prisma/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import JobProgressBar from "./JobProgressBar";

type JobDetailsInfoProps = {
  params: {
    jobId: string;
  };
};

const JobDetailsInfo = async ({ params }: JobDetailsInfoProps) => {
  const { jobId } = await params;

  const applicationDetails = await prisma.application.findFirst({
    where: { id: jobId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!applicationDetails) {
    return <div>Job not found.</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl">
            {applicationDetails.job.title}
          </CardTitle>
          <CardDescription>
            Applied at:{"  "}
            <span className="font-medium">
              {applicationDetails.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </CardDescription>
          <CardDescription className="text-md">
            {applicationDetails.job.description}
          </CardDescription>
          <CardContent>
            <JobProgressBar />
          </CardContent>
        </CardHeader>
      </Card>
    </>
  );
};

export default JobDetailsInfo;
