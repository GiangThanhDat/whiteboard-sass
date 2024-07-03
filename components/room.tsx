"use client"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"
import React from "react"

export function Room({
  roomId,
  children,
  fallback,
}: {
  roomId: string
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  return (
    <LiveblocksProvider
      // publicApiKey={
      //   "pk_dev_mkMCPYTx2ANjQ6rqt1JvrqXEI9E3p75O7PXHo2XWxyb9pQCeCJcF6PG-_lk9ZY50"
      // }
      throttle={16}
      authEndpoint={"/api/liveblocks-auth"}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
        }}
      >
        <ClientSideSuspense fallback={fallback}>
          {() => children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
