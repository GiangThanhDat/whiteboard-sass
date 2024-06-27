"use client"

import { useOrganizationList } from "@clerk/nextjs"
import { Item } from "./item"

export function List() {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })

  return (
    <ul className="space-y-4">
      {userMemberships.data?.map((mem) => {
        return (
          <Item
            key={mem.organization.id}
            id={mem.organization.id}
            name={mem.organization.name}
            imageUrl={mem.organization.imageUrl}
          />
        )
      })}
    </ul>
  )
}
