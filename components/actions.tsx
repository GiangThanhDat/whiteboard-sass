"use client"

import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu"
import { Link2, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmModal } from "./confirm-modal"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useRenameModal } from "@/store/use-rename-modal"

type ActionsProps = {
  children: React.ReactNode
  side?: DropdownMenuContentProps["side"]
  sideOffset?: DropdownMenuContentProps["sideOffset"]
  id: string
  title: string
}

export function Actions({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionsProps) {
  const [remove, pending] = useApiMutation(api.board.remove)

  const { onOpen } = useRenameModal()

  const onDelete = () => {
    remove({ id })
      .then(() => {
        toast.success("Board deleted")
      })
      .catch(() => {
        toast.error("Failed to delete board")
      })
  }

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copies"))
      .catch(() => toast.error("Failure to copy link"))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w=60"
      >
        <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy board Link
        </DropdownMenuItem>
        <DropdownMenuItem
          className="p-3 cursor-pointer"
          onClick={() => onOpen(id, title)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all of its contents"
          disabled={pending}
          onConfirm={onDelete}
        >
          <Button
            variant={"ghost"}
            className="p-3 cursor-pointer w-full text-sm justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
