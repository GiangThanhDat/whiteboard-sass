import { Plus } from "lucide-react"
import { toast } from "sonner"

import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { cn } from "@/lib/utils"

type NewBoardButtonProps = {
  orgId: string
  disabled?: boolean
}

export function NewBoardButton({ orgId, disabled }: NewBoardButtonProps) {
  const [create, pending] = useApiMutation(api.board.create)

  const onClick = () => {
    create({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created")
        // TODO: redirect to /board/{id}
      })
      .catch(() => {
        toast.error("Failed to create board")
      })
  }

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) && "opacity-75"
      )}
    >
      <div className=""></div>
      <Plus className="h-10 w-10 text-white stroke-1" />
      <p className="text-sm text-white font-light">New board</p>
    </button>
  )
}
