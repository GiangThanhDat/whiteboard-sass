import { CanvasMode, CanvasState, LayerType } from "@/types/canvans"
import {
  ArrowLeft,
  ArrowRight,
  Circle,
  Hand,
  MousePointer2,
  Pencil,
  Square,
  StickyNote,
  Type,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { ToolButton } from "./tool-button"

type ToolbarProps = {
  canvasState: CanvasState
  setCanvasState: (state: CanvasState) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function Toolbar({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => {
            setCanvasState({ mode: CanvasMode.NONE })
          }}
          isActive={
            canvasState.mode === CanvasMode.NONE ||
            canvasState.mode === CanvasMode.TRANSLATING ||
            canvasState.mode === CanvasMode.SELECTION_NET ||
            canvasState.mode === CanvasMode.PRESSING ||
            canvasState.mode === CanvasMode.RESIZING
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.INSERTING,
              layerType: LayerType.TEXT,
            })
          }}
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            canvasState.layerType === LayerType.TEXT
          }
        />
        <ToolButton
          label="Sticky note"
          icon={StickyNote}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.INSERTING,
              layerType: LayerType.NOTE,
            })
          }}
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            canvasState.layerType === LayerType.NOTE
          }
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.INSERTING,
              layerType: LayerType.RECTANGLE,
            })
          }}
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            canvasState.layerType === LayerType.RECTANGLE
          }
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.INSERTING,
              layerType: LayerType.ELLIPSE,
            })
          }}
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            canvasState.layerType === LayerType.ELLIPSE
          }
        />
        <ToolButton
          label="Pencil"
          icon={Pencil}
          onClick={() => {
            setCanvasState({ mode: CanvasMode.PENCIL })
          }}
          isActive={canvasState.mode === CanvasMode.PENCIL}
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Drag"
          icon={Hand}
          onClick={() => {
            setCanvasState({ current: null, mode: CanvasMode.PANNING })
          }}
          isActive={canvasState.mode === CanvasMode.PANNING}
        />
        <ToolButton
          label="Undo"
          icon={ArrowLeft}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={ArrowRight}
          onClick={redo}
          isDisabled={!canRedo}
        />
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
