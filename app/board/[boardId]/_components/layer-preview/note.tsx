import {
  calculateFontSize,
  cn,
  colorToCss,
  getContrastingTextColor,
} from "@/lib/utils"
import { NoteLayer } from "@/types/canvans"
import { useMutation } from "@liveblocks/react/suspense"
import { Kalam } from "next/font/google"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
})

type NoteProps = {
  id: string
  layer: NoteLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export function Note({ id, layer, onPointerDown, selectionColor }: NoteProps) {
  const { x, y, width, height, fill, value } = layer

  const handleContentChange = useMutation(
    ({ storage }, e: ContentEditableEvent) => {
      const liveLayers = storage.get("layers")
      liveLayers.get(id)?.set("value", e.target.value)
    },
    []
  )

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: fill ? colorToCss(fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || "Note"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center Note-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height, 0.15),
          color: fill ? getContrastingTextColor(fill) : "#000",
        }}
      />
    </foreignObject>
  )
}
