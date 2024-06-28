"use client"

import { useOrganization } from "@clerk/nextjs"

import { Boards } from "./_components/boards"
import { EmptyOrg } from "./_components/empty-org"

type DashboardPageProps = {
  searchParams: {
    search?: string
    favorites?: string
  }
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const { organization } = useOrganization()

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <Boards orgId={organization.id} query={searchParams} />
      )}
    </div>
  )
}
