import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded market-shimmer",
        className
      )}
    />
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="flex items-stretch gap-4 p-4 bg-surface-primary/80 border border-border-subtle rounded-xl">
      {/* Signal Strength Bar Skeleton */}
      <div className="flex flex-col-reverse gap-0.5 w-1.5 shrink-0">
        <Skeleton className="w-full h-3 rounded-sm" />
        <Skeleton className="w-full h-3 rounded-sm" />
        <Skeleton className="w-full h-3 rounded-sm" />
        <Skeleton className="w-full h-3 rounded-sm" />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {/* Top Row: Ticker + Name + Score */}
        <div className="flex items-center gap-3">
          {/* Ticker Badge */}
          <Skeleton className="w-16 h-5 rounded-md" />

          {/* Company Name */}
          <Skeleton className="w-32 sm:w-48 h-4 rounded" />

          {/* Score */}
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="hidden sm:block w-12 h-3 rounded" />
            <Skeleton className="w-12 h-5 rounded" />
          </div>
        </div>

        {/* Description Lines */}
        <div className="space-y-1.5">
          <Skeleton className="w-full h-3 rounded" />
          <Skeleton className="w-4/5 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ResultsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}
