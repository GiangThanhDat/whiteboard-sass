import { Loader } from "lucide-react"
import { InfoSkeleton } from "./info"
import { ParticipantsSkeleton } from "./participants"
import { ToolbarSkeleton } from "./toolbar"

export function Loading() {
  return (
    <main
      id="loading"
      className="h-full w-full flex relative bg-neutral-100 items-center justify-center touch-none "
    >
      <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
    </main>
  )
}
