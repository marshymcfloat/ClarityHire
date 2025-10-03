import { ExperienceLevel, JobType, WorkArrangement } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const juniorWebDevJob = {
  // --- Core Information ---
  title: "Junior Web Developer",
  description:
    "We are looking for a passionate and motivated Junior Web Developer to join our dynamic engineering team. You will have the opportunity to work on exciting projects, learn from senior developers, and contribute to building amazing web experiences for our users.",

  // --- Structured Lists (String[]) ---
  responsibilities: [
    "Develop and maintain user-facing features using modern web technologies.",
    "Collaborate with designers and back-end developers to implement UI/UX designs.",
    "Write clean, maintainable, and testable code.",
    "Troubleshoot and resolve bugs and performance issues.",
    "Participate in code reviews to learn from peers and improve your skills.",
    "Assist in the full software development lifecycle, from concept to deployment.",
  ],
  qualifications: [
    "Bachelor's Degree in Computer Science or a related field, or equivalent practical experience.",
    "Solid understanding of HTML, CSS, and JavaScript (ES6+).",
    "Familiarity with at least one modern JavaScript framework (e.g., React, Vue, or Svelte).",
    "Basic knowledge of RESTful APIs and how to interact with them.",
    "Experience with Git and version control workflows.",
    "Strong problem-solving skills and a desire to learn and grow.",
  ],
  benefits: [
    "Comprehensive health insurance (HMO)",
    "Paid time off and sick leave",
    "Professional development and training opportunities",
    "Free lunch and snacks in the office",
    "Annual tech and equipment allowance",
  ],

  // --- Filterable Tags & Keywords (String[]) ---
  skills: [
    "JavaScript",
    "React",
    "HTML5",
    "CSS3",
    "Git",
    "REST API",
    "Node.js",
  ],

  // --- Specific Job Details ---
  workArrangement: WorkArrangement.ON_SITE, // Matches the WorkArrangement enum
  workSchedule: "Monday to Friday, 9:00 AM - 6:00 PM",
  location: "Pasig City, Philippines",
  jobType: JobType.FULL_TIME, // Matches the JobType enum
  experienceLevel: ExperienceLevel.ENTRY_LEVEL, // Matches the ExperienceLevel enum
  salaryMin: 25000,
  salaryMax: 40000,
  department: "Engineering",
  isActive: true,

  // --- Relational & Timestamps ---
  companyId: "cmg7smgyb0000enfic5rjx7cz", // A placeholder ID for the related Company
  // 'applications', 'createdAt', 'updatedAt' would be handled by the database.
};

const prisma = new PrismaClient();

async function seeder() {
  try {
    const newJob = await prisma.job.create({ data: juniorWebDevJob });

    if (newJob) {
      console.log("successfully created new job");
    }
  } catch (err) {}
}

seeder()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
