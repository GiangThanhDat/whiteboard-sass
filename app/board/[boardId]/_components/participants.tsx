import { Skeleton } from "@/components/ui/skeleton"

export function Participants() {
  return (
    <div
      id="participants"
      className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
    >
      List of users
    </div>
  )
}

export function ParticipantsSkeleton() {
  return (
    <div
      id="participants-skeleton"
      className="absolute h-12 top-2 right-2 rounded-md flex items-center  w-[100px] shadow-md"
    >
      <Skeleton className="h-full w-full bg-neutral-200" />
    </div>
  )
}
