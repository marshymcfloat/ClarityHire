import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { JobWithRelation } from "./InitialDashboardDataContainer";
import { Badge } from "../ui/badge";
import { ApplicationStatus } from "@prisma/client/edge";
import Link from "next/link";

const badgeStyles: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: "bg-blue-100 text-blue-800 border-blue-300",
  [ApplicationStatus.IN_REVIEW]:
    "bg-indigo-100 text-indigo-800 border-indigo-300",
  [ApplicationStatus.INTERVIEWING]:
    "bg-purple-100 text-purple-800 border-purple-300",

  [ApplicationStatus.OFFERED]:
    "bg-yellow-100 text-yellow-800 border-yellow-300",

  [ApplicationStatus.HIRED]: "bg-green-100 text-green-800 border-green-300",

  [ApplicationStatus.REJECTED]: "bg-red-100 text-red-800 border-red-300",
  [ApplicationStatus.WITHDRAWN]: "bg-gray-200 text-gray-800 border-gray-400",
};

const JobApplicationCard = ({ job }: { job: JobWithRelation }) => {
  const statusStyle = badgeStyles[job.status] || badgeStyles.WITHDRAWN;

  return (
    <Link href={`${job.id}`}>
      <Card className="relative h-fit hover:bg-slate-50/50 cursor-pointer duration-150 transition-colors">
        <Badge className={`absolute top-4 right-4 text-[10px] ${statusStyle}`}>
          {job.status}
        </Badge>

        <CardHeader className="">
          <CardTitle className="">{job.job.title}</CardTitle>
          <CardDescription className="font-medium ">
            {job.job.company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className="truncate">
            {job.job.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};

export default JobApplicationCard;
