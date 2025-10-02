// Your page file: app/[companyName]/available-jobs/page.tsx
import JobCard from "@/components/jobs/JobCard"; // Import the new component
import prisma from "@/prisma/prisma";
import { notFound } from "next/navigation";

const CompanyAvailableJobsPage = async ({
  params,
}: {
  params: { companyName: string };
}) => {
  const { companyName } = await params;

  const company = await prisma.company.findFirst({
    where: { slug: companyName },
    include: {
      jobs: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl">Careers at {company.name}</h1>
        <p className="text-gray-500">Find your next opportunity with us.</p>
      </div>

      {company.jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {company.jobs.map((job) => (
            <JobCard key={job.id} job={job} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No Open Positions</h2>
          <p className="text-gray-500 mt-2">
            There are currently no available jobs. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyAvailableJobsPage;
