import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import UserJobsList from "./UserJobsList";
import { Prisma } from "@prisma/client/edge";

export type JobWithRelation = Prisma.ApplicationGetPayload<{
  include: {
    job: {
      include: {
        company: true;
      };
    };
  };
}>;

const InitialDashboardDataContainer = async () => {
  const session = await getServerSession(authOptions);

  const jobs = await prisma.application.findMany({
    where: { userId: session?.user.id },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  console.log(jobs);

  return (
    <>
      <UserJobsList data={jobs} />
    </>
  );
};

export default InitialDashboardDataContainer;
