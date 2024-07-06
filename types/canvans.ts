export type Color = {
  r: number
  g: number
  b: number
}

export type Point = {
  x: number
  y: number
}

export type Camera = Point

export type XYWH = Point & {
  width: number
  height: number
}

export enum LayerType {
  RECTANGLE,
  ELLIPSE,
  PATH,
  TEXT,
  NOTE,
}

type LayerProps = XYWH & {
  fill: Color
  value?: string
}

export type RectangleLayer = {
  type: LayerType.RECTANGLE
} & LayerProps

export type EllipseLayer = {
  type: LayerType.ELLIPSE
} & LayerProps

export type PathLayer = {
  type: LayerType.PATH
  points: number[][]
} & LayerProps

export type TextLayer = {
  type: LayerType.TEXT
} & LayerProps

export type NoteLayer = {
  type: LayerType.NOTE
} & LayerProps

export enum Side {
  TOP = 1,
  BOTTOM = 2,
  LEFT = 4,
  RIGHT = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.NONE
    }
  | {
      mode: CanvasMode.SELECTION_NET
      origin: Point
      current: Point
    }
  | {
      mode: CanvasMode.TRANSLATING
      current: Point
    }
  | {
      mode: CanvasMode.INSERTING
      layerType:
        | LayerType.ELLIPSE
        | LayerType.RECTANGLE
        | LayerType.TEXT
        | LayerType.NOTE
    }
  | {
      mode: CanvasMode.PENCIL
    }
  | {
      mode: CanvasMode.PRESSING
      origin: Point
    }
  | {
      mode: CanvasMode.RESIZING
      initialBounds: XYWH
      corner: Side
    }

export enum CanvasMode {
  NONE,
  PRESSING,
  SELECTION_NET,
  TRANSLATING,
  INSERTING,
  RESIZING,
  PENCIL,
}

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer
