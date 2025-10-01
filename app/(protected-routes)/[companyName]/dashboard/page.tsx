import InitialDashboardDataContainer from "@/components/dashboard/InitialDashboardDataContainer";
import UserJobsListSkeleton from "@/components/dashboard/UserJobsListSkeleton";
import { Suspense } from "react";

const Dashboard = () => {
  return (
    <>
      <h1 className="font-medium text-2xl">Your Job Application</h1>
      <Suspense fallback={<UserJobsListSkeleton />}>
        <InitialDashboardDataContainer />
      </Suspense>
    </>
  );
};

export default Dashboard;
