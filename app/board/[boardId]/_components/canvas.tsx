"use client"

import { pointerEventToCanvasPoint } from "@/lib/utils"
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  Point,
} from "@/types/canvans"
import { LiveObject } from "@liveblocks/client"
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense"
import { nanoid } from "nanoid"
import { useCallback, useState } from "react"
import { CursorsPresence } from "./cursors-presence"
import { Info } from "./info"
import { Participants } from "./participants"
import { Toolbar } from "./toolbar"

type CanvasProps = {
  boardId: string
}

const MAX_LAYERS = 100

export function Canvas({ boardId }: CanvasProps) {
  const { name } = useSelf((me) => me.info)

  const layerIds = useStorage((root) => root.layerIds)

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.NONE,
  })
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  })

  const history = useHistory()
  const undo = useCanUndo()
  const canRedo = useCanRedo()

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.ELLIPSE
        | LayerType.RECTANGLE
        | LayerType.TEXT
        | LayerType.NOTE,
      position: Point
    ) => {
      const liveLayers = storage.get("layers")
      if (liveLayers.size >= MAX_LAYERS) {
        return
      }

      const liveLayerIds = storage.get("layerIds")
      const layerId = nanoid()
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      })

      liveLayerIds.push(layerId)
      liveLayers.set(layerId, layer)
      setMyPresence({
        selection: [layerId],
      })
      setCanvasState({ mode: CanvasMode.NONE })
    },
    []
  )

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
        <g
          style={{
            transform: `translateX(${camera.x}) translateY(${camera.y})`,
          }}
        >
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}
