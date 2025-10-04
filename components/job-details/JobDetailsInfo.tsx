import prisma from "@/prisma/prisma";

import {
  Bookmark,
  Briefcase,
  Calendar,
  MapPin,
  Send,
  TrendingUp,
} from "lucide-react";

import { formattedExperienceLevelMap, formattedJobTypeMap } from "@/constants";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ApplyJobButton from "./ApplyJobButton";
type JobDetailsInfoProps = {
  params: {
    jobId: string;
  };
};

function JobInfo({
  location,
  type,
  level,
}: {
  location: string;
  type: string;
  level: string;
}) {
  return (
    <>
      <Badge variant="secondary" className="flex items-center gap-1">
        <MapPin size={14} /> {location}
      </Badge>

      <Badge variant="secondary" className="flex items-center gap-1">
        <Briefcase size={14} /> {type}
      </Badge>

      <Badge variant="secondary" className="flex items-center gap-1">
        <TrendingUp size={14} /> {level}
      </Badge>
    </>
  );
}

const JobDetailsInfo = async ({ params }: JobDetailsInfoProps) => {
  const { jobId } = await params;

  const jobDetails = await prisma.job.findUnique({ where: { id: jobId } });

  if (!jobDetails) {
    return <div>Job not found.</div>;
  }

  const displayLevel = formattedExperienceLevelMap[jobDetails.experienceLevel];
  const displayType = formattedJobTypeMap[jobDetails.jobType];

  const salaryInfo = jobDetails.salaryMin || jobDetails.salaryMax;

  return (
    <>
      <div className="min-h-[60%] flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-4xl">
            <h1 className="font-medium">{jobDetails.title}</h1>
          </div>

          <div className="flex gap-2 items-center">
            <Calendar size={12} />

            <p>
              Posted at:{" "}
              <span className="font-medium">
                {jobDetails.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>

          <div className="flex   justify-between items-center">
            <div className="flex gap-4 h-fit text-xs">
              <JobInfo
                level={displayLevel}
                location={jobDetails.location}
                type={displayType}
              />
            </div>
            <div className="flex gap-8">
              <Button
                className="min-w-[120px] border-black border-2"
                variant={"outline"}
              >
                <Bookmark />
                Save
              </Button>
              <ApplyJobButton
                jobId={jobDetails.id}
                jobTitle={jobDetails.title}
                jobDescription={jobDetails.description}
              />
            </div>
          </div>
        </div>

        <div className="h-[70vh] font-light bg-muted rounded-2xl p-4 overflow-y-auto space-y-6 ">
          <p className="font-light text-sm">{jobDetails.description}</p>

          <div className="">
            <h1 className="text-xl uppercase font-medium">
              Job Responsibilities
            </h1>

            <ul className="text-sm list-disc list-inside space-y-1">
              {jobDetails.responsibilities.map((responsibility) => (
                <li className="" key={responsibility}>
                  {responsibility}
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <h1 className="text-xl uppercase font-medium">
              Job Qualifications
            </h1>

            <ul className="text-sm list-disc list-inside space-y-1">
              {jobDetails.responsibilities.map((qualification) => (
                <li className="" key={qualification}>
                  {qualification}
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <h1 className="text-xl uppercase font-medium">Benefits</h1>

            <ul className="text-sm list-disc list-inside space-y-1">
              {jobDetails.responsibilities.map((benefit) => (
                <li className="" key={benefit}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailsInfo;
