"use client"

import { UserAvatar } from "@/app/board/[boardId]/_components/user-avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { connectionIdToColor } from "@/lib/utils"
import { useOthers, useSelf } from "@liveblocks/react/suspense"

const MAX_SHOWN_USERS = 2

export function Participants() {
  const users = useOthers()
  const currentUser = useSelf()
  const hasMoreUsers = users.length > MAX_SHOWN_USERS

  return (
    <div
      id="participants"
      className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md"
    >
      {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
        <UserAvatar
          key={connectionId}
          name={info.name}
          src={info.picture}
          fallback={info?.name?.[0] || "T"}
          borderColor={connectionIdToColor(connectionId)}
        />
      ))}
      {currentUser && (
        <UserAvatar
          src={currentUser.info.picture}
          name={`${currentUser.info.name} (You)`}
          fallback={currentUser.info.name?.[0]}
          borderColor={connectionIdToColor(currentUser.connectionId)}
        />
      )}
      {hasMoreUsers && (
        <UserAvatar name={`${users.length - MAX_SHOWN_USERS} more`} />
      )}
    </div>
  )
}

export function ParticipantsSkeleton() {
  return (
    <div
      id="participants-skeleton"
      className="absolute h-12 top-2 right-2 rounded-md flex items-center  w-[100px] shadow-md"
    >
      <Skeleton className="h-full w-full bg-neutral-200" />
    </div>
  )
}
