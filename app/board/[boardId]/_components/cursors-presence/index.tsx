"use client"

import { colorToCss } from "@/lib/utils"
import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react/suspense"
import { memo } from "react"
import { Path } from "../layer-preview/path"
import { Cursor } from "./cursor"

function Cursors() {
  const ids = useOthersConnectionIds()

  return ids.map((connectionId) => (
    <Cursor key={connectionId} connectionId={connectionId} />
  ))
}

function Drafts() {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow
  )

  return (
    <>
      {others.map(([key, other]) => {
        if (other.pencilDraft) {
          return (
            <Path
              key={key}
              x={0}
              y={0}
              points={other.pencilDraft}
              fill={other.penColor ? colorToCss(other.penColor) : "#000"}
            />
          )
        }
        return null
      })}
    </>
  )
}

export const CursorsPresence = memo(function () {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  )
})

CursorsPresence.displayName = "CursorsPresence"
