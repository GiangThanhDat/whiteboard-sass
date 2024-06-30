"use client"

import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { useRenameModal } from "@/store/use-rename-modal"
import { FormEventHandler, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"

export function RenameModal() {
  const [create, pending] = useApiMutation(api.board.update)

  const { isOpen, onClose, initialValues } = useRenameModal()
  const [title, setTitle] = useState(initialValues.title)

  useEffect(() => {
    setTitle(initialValues.title)
  }, [initialValues.title])

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    create({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board renamed")
        onClose()
      })
      .catch(() => {
        toast.error("Failed to rename board")
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
          <DialogDescription>
            Enter a new title for this board
          </DialogDescription>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              disabled={pending}
              required
              maxLength={60}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={pending} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
