import { colorToCss } from "@/lib/utils"
import { LayerType } from "@/types/canvans"
import { useStorage } from "@liveblocks/react/suspense"
import { Ellipse } from "./ellipse"
import { Note } from "./note"
import { Path } from "./path"
import { Rectangle } from "./rectangle"
import { Text } from "./text"

type LayerPreviewProps = {
  id: string
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void
  selectionColor?: string
}

export function LayerPreview({
  id,
  onLayerPointerDown,
  selectionColor,
}: LayerPreviewProps) {
  const layer = useStorage((root) => root.layers.get(id))

  if (!layer) {
    return null
  }

  switch (layer.type) {
    case LayerType.PATH:
      return (
        <Path
          x={layer.x}
          y={layer.y}
          fill={layer.fill ? colorToCss(layer.fill) : "#000"}
          points={layer.points}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          stroke={selectionColor}
        />
      )
    case LayerType.RECTANGLE:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      )
    case LayerType.ELLIPSE:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      )
    case LayerType.TEXT:
      return (
        <Text
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      )
    case LayerType.NOTE:
      return (
        <Note
          id={id}
          layer={layer}
          onPointerDown={onLayerPointerDown}
          selectionColor={selectionColor}
        />
      )
    default:
      console.warn("Unknown layer type")
      return null
  }
}
