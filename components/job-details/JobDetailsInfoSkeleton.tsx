import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

const JobDetailsInfoSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="w-[300px] h-[50px]" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="w-[200px] h-[30px]" />
        </CardDescription>
        <CardDescription>
          <Skeleton className="w-full h-[100px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-[90%] items-center h-[100px] flex font-medium mx-auto">
          <Separator className="flex-1 " />
          <Skeleton className="size-6 rounded-full  relative"></Skeleton>
          <Separator className="flex-1" />
          <Skeleton className="size-6 rounded-full  relative"></Skeleton>
          <Separator className="flex-1" />{" "}
          <Skeleton className="size-6 rounded-full   relative"></Skeleton>
          <Separator className="flex-1" />{" "}
          <Skeleton className="size-6 rounded-full  relative"></Skeleton>
          <Separator className="flex-1" />{" "}
          <Skeleton className="size-6 rounded-full  relative"></Skeleton>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsInfoSkeleton;
