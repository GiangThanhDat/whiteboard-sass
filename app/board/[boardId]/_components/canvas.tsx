"use client"

import { useSelf } from "@liveblocks/react/suspense"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

type CanvasProps = {
  boardId: string
}

export function Canvas({ boardId }: CanvasProps) {
  const { name } = useSelf((me) => me.info)

  return (
    <main
      id="canvas"
      className="h-full w-full relative bg-neutral-100 touch-none "
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar />
    </main>
  )
}
