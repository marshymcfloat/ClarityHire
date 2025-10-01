import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/prisma/prisma";
import { notFound } from "next/navigation";
import React from "react";

const CompanyPublicRoutesLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyName: string };
}) => {
  const { companyName } = await params;

  const company = await prisma.company.findFirst({
    where: { slug: companyName },
    include: {
      jobs: {
        where: { isActive: true }, // Only show active jobs!
        orderBy: { createdAt: "desc" }, // Show newest jobs first
      },
    },
  });

  if (!company) {
    return notFound();
  }

  return (
    <>
      {company ? (
        <SidebarProvider>
          <AppSidebar company={company} />
          <main className="overflow-y-hidden w-full">
            <SidebarTrigger className="bg-slate-200 m-2" />
            <section className=" rounded-2xl bg-white w-[95%] ml-auto h-full p-4 space-y-6">
              {children}
            </section>
          </main>
        </SidebarProvider>
      ) : (
        <p>loading</p>
      )}
    </>
  );
};

export default CompanyPublicRoutesLayout;
