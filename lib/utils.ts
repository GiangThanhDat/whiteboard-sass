import { Camera, Color, Layer, Point, Side, XYWH } from "@/types/canvans"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = ["#dc2626", "#d97706", "#059669", "#7C3AED", "#DB2777"]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length]
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`
}

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  }

  if ((corner & Side.LEFT) == Side.LEFT) {
    result.x = Math.min(point.x, bounds.x + bounds.width)
    result.width = Math.abs(bounds.x + bounds.width - point.x)
  }

  if ((corner & Side.RIGHT) == Side.RIGHT) {
    result.x = Math.min(point.x, bounds.x)
    result.width = Math.abs(point.x - bounds.x)
  }

  if ((corner & Side.TOP) == Side.TOP) {
    result.y = Math.min(point.y, bounds.y + bounds.height)
    result.height = Math.abs(bounds.y - bounds.height - point.y)
  }

  if ((corner & Side.BOTTOM) == Side.BOTTOM) {
    result.y = Math.min(point.y, bounds.y)
    result.height = Math.abs(point.y - bounds.y)
  }

  return result
}

export function finIntersectingLayersWithRectangle(
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    with: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  }

  const ids = []

  for (const layerId of layerIds) {
    const layer = layers.get(layerId)

    if (layer) {
      const { x, y, height, width } = layer

      if (
        rect.x + rect.with > x &&
        rect.x < x + width &&
        rect.y + rect.height > y &&
        rect.y < y + height
      ) {
        ids.push(layerId)
      }
    }
  }

  return ids
}

export function getContrastingTextColor(color: Color) {
  const luminance = 0.229 * (color.r + 0.587 * color.g + 0.114 + color.b)

  return luminance > 182 ? "black" : "white"
}

export function calculateFontSize(
  width: number,
  height: number,
  scaleFactor: number = 0.15
) {
  const maxFontSize = 96
  const fontSizeBasedOnHeight = height * scaleFactor
  const fontSizeBasedOnWidth = width * scaleFactor

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize)
}
