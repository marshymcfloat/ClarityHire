// components/SidebarCompanyHeader.tsx
"use client";

import { Company } from "@prisma/client/edge";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

type ResponseDataType = { data: Company };

const SidebarCompanyHeader = () => {
  const [companyData, setCompanyData] = useState<null | ResponseDataType>(null);
  const [isLoading, setIsLoading] = useState(true); // 1. Add loading state
  const { companyName } = useParams();

  const URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`${URL}/company/${companyName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company info");
        }
        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompany();
  }, [companyName, URL]);

  if (isLoading) {
    return <Skeleton className="w-full h-[36px] my-4" />;
  }

  return (
    <div className="p-4 capitalize font-medium">{companyData?.data.name}</div>
  );
};

export default SidebarCompanyHeader;
