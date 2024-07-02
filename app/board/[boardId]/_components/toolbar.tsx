import { Skeleton } from "@/components/ui/skeleton"
import { MousePointer2 } from "lucide-react"
import { ToolButton } from "./tool-button"

export function Toolbar() {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => {}}
        ></ToolButton>
        <div className="">Pencil</div>
        <div className="">Square</div>
        <div className="">Circle</div>
        <div className="">Ellipsis</div>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <div className="">undo</div>
        <div className="">redo</div>
      </div>
    </div>
  )
}

export function ToolbarSkeleton() {
  return (
    <div
      id="toolbar-skeleton"
      className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 h-[300px] w-[80px] shadow-md"
    >
      <Skeleton className="h-full w-full bg-neutral-200" />
    </div>
  )
}
