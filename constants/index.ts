import { ExperienceLevel, JobType } from "@prisma/client";

export const formattedJobTypesForForms = [
  { label: "Full-time", value: JobType.FULL_TIME },
  { label: "Part-time", value: JobType.PART_TIME },
  { label: "Contract", value: JobType.CONTRACT },
  { label: "Internship", value: JobType.INTERNSHIP }, // Fixed typo "Interntship"
];

// This object/map is perfect for displaying labels from a known value
export const formattedJobTypeMap: Record<JobType, string> = {
  [JobType.FULL_TIME]: "Full-time",
  [JobType.PART_TIME]: "Part-time",
  [JobType.CONTRACT]: "Contract",
  [JobType.INTERNSHIP]: "Internship",
};

export const formattedExperienceLevelMap: Record<ExperienceLevel, string> = {
  [ExperienceLevel.INTERNSHIP]: "Internship",
  [ExperienceLevel.ENTRY_LEVEL]: "Entry level",
  [ExperienceLevel.ASSOCIATE]: "Associate",
  [ExperienceLevel.MID_LEVEL]: "Mid level",
  [ExperienceLevel.SENIOR]: "Senior",
  [ExperienceLevel.STAFF]: "Staff",
  [ExperienceLevel.PRINCIPAL]: "Principal",
};
