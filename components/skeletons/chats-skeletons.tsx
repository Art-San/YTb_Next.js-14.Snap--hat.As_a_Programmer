import { Skeleton } from '@/components/ui/skeleton'
import { type } from 'os'

interface IChatsSkeletonProps {
  quantity: number
}

export function ChatsSkeleton({ quantity }: IChatsSkeletonProps) {
  return (
    <div className="flex flex-col px-3 gap-3">
      {Array.from({ length: quantity }).map((_, i) => (
        <div className="flex items-center space-x-4" key={i}>
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
