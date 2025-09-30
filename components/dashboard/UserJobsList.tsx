import React from "react";
import JobApplicationCard from "./JobApplicationCard";
import { JobWithRelation } from "./InitialDashboardDataContainer";

const UserJobsList = ({ data }: { data: JobWithRelation[] }) => {
  return (
    <section className="grid grid-cols-4  lg:min-h-[85%] p-4 outline-2 rounded-2xl relative">
      {data.length === 0 ? (
        <p className="absolute text-nowrap lg:w-[300px] text-center  font-medium text-2xl right-1/2 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          No Job Applications Yet
        </p>
      ) : (
        data.map((job) => <JobApplicationCard key={job.id} job={job} />)
      )}
    </section>
  );
};

export default UserJobsList;
