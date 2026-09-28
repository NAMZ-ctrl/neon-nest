"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableLoadingSkeletonProps {
  columnCount: number;
  rowCount?: number;
  /** Optional: vary cell widths so it doesn't look like one flat block */
  cellWidths?: string[];
}

export function DataTableLoadingSkeleton({
  columnCount,
  rowCount = 10,
  cellWidths,
}: DataTableLoadingSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    className={cellWidths?.[colIndex] ?? "h-4 w-full"}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}