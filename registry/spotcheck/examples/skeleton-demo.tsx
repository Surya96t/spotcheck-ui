import { Skeleton } from "@/registry/spotcheck/components/spotcheck/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex max-w-80 flex-col gap-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton />
      <Skeleton className="w-3/4" />
    </div>
  )
}
