import SummaryCardSkeleton from "@/components/shared/summary-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableLoadingSkeleton } from "@/components/shared/data-table-skeleton";

export default function IncomePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </section>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-28" /> {/* stands in for IncomeForm's trigger button */}
        </div>
        <DataTableLoadingSkeleton columnCount={5} rowCount={8} />
      </div>
    </div>
  );
}