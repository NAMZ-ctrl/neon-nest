import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function SummaryCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        {/* Icon */}
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

        {/* Information */}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}