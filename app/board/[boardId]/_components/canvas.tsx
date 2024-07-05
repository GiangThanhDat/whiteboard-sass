"use client"

import {
  connectionIdToColor,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils"
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  Layer,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvans"
import { LiveObject } from "@liveblocks/client"
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense"
import { nanoid } from "nanoid"
import { useCallback, useMemo, useState } from "react"

import { CursorsPresence } from "./cursors-presence"
import { Info } from "./info"
import { LayerPreview } from "./layer-preview"
import { Participants } from "./participants"
import { SelectionBox } from "./selection-box"
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
    r: 255,
    g: 255,
    b: 255,
  })

  const history = useHistory()
  const canUndo = useCanUndo()
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
      const layer = new LiveObject<Layer>({
        type: layerType,
        x: position.x,
        y: position.y,
        points: [],
        width: 100,
        height: 100,
        fill: lastUsedColor,
      })

      liveLayerIds.push(layerId)
      liveLayers.set(layerId, layer)
      setMyPresence({ selection: [layerId] }, { addToHistory: true })
      setCanvasState({ mode: CanvasMode.NONE })
    },
    [lastUsedColor]
  )

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.TRANSLATING) {
        return
      }

      const offset = {
        x: point.x - (canvasState?.current?.x ?? 0),
        y: point.y - (canvasState?.current?.y ?? 0),
      }

      const liveLayers = storage.get("layers")

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id)

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          })
        }
      }

      setCanvasState({ mode: CanvasMode.TRANSLATING, current: point })
    },
    [canvasState]
  )

  const unselectedLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true })
    }
  }, [])

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.RESIZING) {
        return
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      )

      const liveLayers = storage.get("layers")
      const layer = liveLayers.get(self.presence.selection[0])

      if (layer) {
        layer.update(bounds)
      }
    },
    [canvasState]
  )

  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause()
      setCanvasState({
        mode: CanvasMode.RESIZING,
        initialBounds,
        corner,
      })
    },
    [history]
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

      if (canvasState.mode === CanvasMode.TRANSLATING) {
        translateSelectedLayers(current)
      } else if (canvasState.mode === CanvasMode.RESIZING) {
        resizeSelectedLayer(current)
      }

      setMyPresence({ cursor: current })
    },
    [camera, canvasState, resizeSelectedLayer, translateSelectedLayers]
  )

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.INSERTING) {
        return
      }

      // TODO: add case for drawing
      setCanvasState({ origin: point, mode: CanvasMode.PRESSING })
    },
    [camera, canvasState.mode, setCanvasState]
  )

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (
        canvasState.mode === CanvasMode.NONE ||
        canvasState.mode === CanvasMode.PRESSING
      ) {
        unselectedLayers()
        setCanvasState({
          mode: CanvasMode.NONE,
        })
      } else if (canvasState.mode === CanvasMode.INSERTING) {
        insertLayer(canvasState.layerType, point)
      } else {
        setCanvasState({ mode: CanvasMode.NONE })
      }

      history.resume()
    },
    [camera, canvasState, history, insertLayer, unselectedLayers]
  )

  const selections = useOthersMapped((other) => other.presence.selection)

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.PENCIL ||
        canvasState.mode === CanvasMode.INSERTING
      ) {
        return
      }

      history.pause()
      e.stopPropagation()

      const point = pointerEventToCanvasPoint(e, camera)

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true })
      }

      setCanvasState({ mode: CanvasMode.TRANSLATING, current: point })
    },
    [setCanvasState, camera, history, canvasState.mode]
  )

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {}

    for (const user of selections) {
      const [connectionId, selection] = user

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId)
      }
    }

    return layerIdsToColorSelection
  }, [selections])

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
        canRedo={canRedo}
        canUndo={canUndo}
        redo={history.redo}
        undo={history.undo}
      />
      <svg
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        className="h-[100vh] w-[100vw]"
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          <CursorsPresence />
        </g>
      </svg>
    </main>
  )
}
