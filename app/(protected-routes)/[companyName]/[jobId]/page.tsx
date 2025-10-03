import JobDetailsInfo from "@/components/job-details/JobDetailsInfo";
import JobDetailsInfoSkeleton from "@/components/job-details/JobDetailsInfoSkeleton";
import { Suspense } from "react";

type JobDetailsPageProps = {
  params: {
    jobId: string;
  };
};

const JobDetailsPage = ({ params }: JobDetailsPageProps) => {
  return (
    <>
      <Suspense fallback={<JobDetailsInfoSkeleton />}>
        <JobDetailsInfo params={params} />
      </Suspense>
    </>
  );
};

export default JobDetailsPage;
