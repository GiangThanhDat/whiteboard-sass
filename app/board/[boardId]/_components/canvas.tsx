"use client"

import { pointerEventToCanvasPoint } from "@/lib/utils"
import { Camera, CanvasMode, CanvasState } from "@/types/canvans"
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
} from "@liveblocks/react/suspense"
import { useCallback, useState } from "react"
import { CursorsPresence } from "./cursors-presence"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

type CanvasProps = {
  boardId: string
}

export function Canvas({ boardId }: CanvasProps) {
  const { name } = useSelf((me) => me.info)
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.NONE,
  })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })

  const history = useHistory()
  const undo = useCanUndo()
  const canRedo = useCanRedo()

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((camera) => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, [])

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault()
      const current = pointerEventToCanvasPoint(e, camera)
      setMyPresence({ cursor: current })
    },
    []
  )

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null })
  }, [])

  return (
    <main
      id="canvas"
      className="h-full w-full relative bg-neutral-100 touch-none "
    >
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={undo}
        canRedo={canRedo}
        redo={history.undo}
        undo={history.redo}
      />
      <svg
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="h-[100vh] w-[100vw]"
      >
        <g>
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}
