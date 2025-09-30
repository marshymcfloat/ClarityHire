import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const UserJobsListSkeleton = () => {
  return (
    <section className="grid grid-cols-4  grid-rows-3 gap-4 lg:min-h-[85%] p-4 outline-2 rounded-2xl w-full">
      <Card className="h-fit relative">
        <Skeleton
          className={`absolute w-[60px] h-[20px] top-4 right-4 text-[10px] `}
        />
        <CardHeader>
          <Skeleton className="w-[100px] h-[30px]" />
          <Skeleton className="w-full h-[40px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[50px]" />
        </CardContent>
      </Card>

      <Card className="h-fit relative">
        <Skeleton
          className={`absolute w-[60px] h-[20px] top-4 right-4 text-[10px] `}
        />
        <CardHeader>
          <Skeleton className="w-[100px] h-[30px]" />
          <Skeleton className="w-full h-[40px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[50px]" />
        </CardContent>
      </Card>
      <Card className="h-fit relative">
        <Skeleton
          className={`absolute w-[60px] h-[20px] top-4 right-4 text-[10px] `}
        />
        <CardHeader>
          <Skeleton className="w-[100px] h-[30px]" />
          <Skeleton className="w-full h-[40px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[50px]" />
        </CardContent>
      </Card>
      <Card className="h-fit relative">
        <Skeleton
          className={`absolute w-[60px] h-[20px] top-4 right-4 text-[10px] `}
        />
        <CardHeader>
          <Skeleton className="w-[100px] h-[30px]" />
          <Skeleton className="w-full h-[40px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[50px]" />
        </CardContent>
      </Card>
      <Card className="h-fit relative">
        <Skeleton
          className={`absolute w-[60px] h-[20px] top-4 right-4 text-[10px] `}
        />
        <CardHeader>
          <Skeleton className="w-[100px] h-[30px]" />
          <Skeleton className="w-full h-[40px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[50px]" />
        </CardContent>
      </Card>
    </section>
  );
};

export default UserJobsListSkeleton;
