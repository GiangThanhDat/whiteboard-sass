"use client"

import { useOrganizationList } from "@clerk/nextjs"

export default function List() {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((mem) => {
        return (
          <p className="text-xs" key={mem.id}>
            {mem.organization.name}
          </p>
        )
      })}
    </ul>
  )
}
