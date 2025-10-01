// components/jobs/JobCard.tsx
import { Briefcase, Building2, Clock, MapPin, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Job } from "@prisma/client"; // Import the generated Job type
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns"; // For "posted 2 days ago"

// We'll pass the full company and job object to this component
interface JobCardProps {
  job: Job;
  company: {
    name: string;
    image: string | null;
  };
}

const JobCard = ({ job, company }: JobCardProps) => {
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min) return null;
    if (!max) return `₱${min.toLocaleString()}`;
    return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
  };

  const formatEnumString = (str: string) => {
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl hover:underline">
              <a href={`/jobs/${job.id}`}>{job.title}</a>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Building2 size={14} /> {company.name}
            </CardDescription>
          </div>
          {company.image && (
            <img
              src={company.image}
              alt={`${company.name} logo`}
              className="w-12 h-12 rounded-lg object-contain"
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin size={14} /> {job.location}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Briefcase size={14} /> {formatEnumString(job.jobType)}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp size={14} /> {formatEnumString(job.experienceLevel)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Posted {formatDistanceToNow(new Date(job.createdAt))} ago</span>
        </div>
        {formatSalary(job.salaryMin, job.salaryMax) && (
          <span className="font-semibold">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
