import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { useDeleteLayers } from "@/hooks/use-delete-layers"
import { useSelectionBounds } from "@/hooks/use-selection-bounds"
import { Camera, Color, Layer } from "@/types/canvans"
import { LiveList, LiveMap, LiveObject, User } from "@liveblocks/client"
import { useMutation } from "@liveblocks/react/suspense"
import { BringToFront, SendToBack, Trash2 } from "lucide-react"
import { ColorPicker } from "./color-picker"

type SelectionToolsProps = {
  camera: Camera
  setLastUsedColor: (color: Color) => void
}

const getIndicesForSelection = (
  storage: LiveObject<{
    layers: LiveMap<string, LiveObject<Layer>>
    layerIds: LiveList<string>
  }>,
  self: User
) => {
  const selection = self.presence.selection
  const liveLayerIds = storage.get("layerIds")
  const indices: number[] = []

  const ids = liveLayerIds.toImmutable()

  for (let i = 0; i < ids.length; i++) {
    if (selection.includes(ids[i])) {
      indices.push(i)
    }
  }

  return { indices, liveLayerIds }
}

export function SelectionTools({
  camera,
  setLastUsedColor,
}: SelectionToolsProps) {
  const moveToBack = useMutation(({ storage, self }) => {
    const { indices, liveLayerIds } = getIndicesForSelection(storage, self)
    for (let i = 0; i < indices.length; i++) {
      liveLayerIds.move(indices[i], i)
    }
  }, [])

  const moveToFront = useMutation(({ storage, self }) => {
    const { indices, liveLayerIds } = getIndicesForSelection(storage, self)
    const numberOfLayer = liveLayerIds.length
    for (let i = indices.length - 1; i >= 0; i--) {
      liveLayerIds.move(
        indices[i],
        numberOfLayer - 1 - (indices.length - 1 - i)
      )
    }
  }, [])

  const setFill = useMutation(
    ({ storage, self }, fill: Color) => {
      const liveLayers = storage.get("layers")
      const selection = self.presence.selection
      setLastUsedColor(fill)

      selection.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill)
      })
    },
    [setLastUsedColor]
  )

  const deleteLayer = useDeleteLayers()
  const selectionBounds = useSelectionBounds()

  if (!selectionBounds) {
    return null
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x
  const y = selectionBounds.y + camera.y

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      <ColorPicker onChange={setFill} />
      <div className="flex flex-col gap-y-0.5">
        <Hint label="bring to front">
          <Button variant={"board"} size="icon" onClick={moveToFront}>
            <BringToFront />
          </Button>
        </Hint>
        <Hint label="Send to back" side="bottom">
          <Button variant={"board"} size="icon" onClick={moveToBack}>
            <SendToBack />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Hint label="Delete">
          <Button variant={"board"} size="icon" onClick={deleteLayer}>
            <Trash2 />
          </Button>
        </Hint>
      </div>
    </div>
  )
}
