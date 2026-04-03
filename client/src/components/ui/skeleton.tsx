import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {       
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800/80 animate-pulse",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-4 w-full rounded-md", className)} style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }} />
      ))}
    </div>
  )
}

function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-10 rounded-full shrink-0", className)} />
}

function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-10 w-24 rounded-lg shrink-0", className)} />
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6 space-y-4", className)}>
      <SkeletonAvatar className="h-12 w-12" />
      <SkeletonText lines={2} className="w-3/4" />
      <Skeleton className="h-24 w-full mt-4" />
    </div>
  )
}

function SkeletonGraph({ className }: { className?: string }) {
  return <Skeleton className={cn("h-[300px] w-full rounded-xl", className)} />
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonButton, SkeletonCard, SkeletonGraph }
