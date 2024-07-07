import { calculateFontSize, cn, colorToCss } from "@/lib/utils"
import { TextLayer } from "@/types/canvans"
import { useMutation } from "@liveblocks/react/suspense"
import { Kalam } from "next/font/google"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
})

type TextProps = {
  id: string
  layer: TextLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export function Text({ id, layer, onPointerDown, selectionColor }: TextProps) {
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
      }}
    >
      <ContentEditable
        html={value || "Text"}
        onChange={handleContentChange}
        className={cn(
          "h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height, 0.5),
          color: fill ? colorToCss(fill) : "#000",
        }}
      />
    </foreignObject>
  )
}
