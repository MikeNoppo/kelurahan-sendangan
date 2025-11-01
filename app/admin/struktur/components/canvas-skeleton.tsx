"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function CanvasSkeleton() {
  return (
    <div className="w-full h-full bg-slate-50 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200/50 bg-size-[20px_20px]" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <Skeleton className="h-32 w-72 rounded-lg" />
        
        <div className="w-px h-12 bg-slate-200" />
        
        <div className="flex gap-8">
          <Skeleton className="h-28 w-64 rounded-lg" />
          <Skeleton className="h-28 w-64 rounded-lg" />
        </div>
        
        <div className="flex gap-4">
          <div className="w-px h-12 bg-slate-200" />
          <div className="w-px h-12 bg-slate-200" />
        </div>
        
        <div className="flex gap-4">
          <Skeleton className="h-24 w-56 rounded-lg" />
          <Skeleton className="h-24 w-56 rounded-lg" />
          <Skeleton className="h-24 w-56 rounded-lg" />
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Skeleton className="h-10 w-10 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
        <Skeleton className="h-10 w-10 rounded" />
      </div>
    </div>
  )
}
