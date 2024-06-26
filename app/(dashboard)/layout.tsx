import React from "react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="">
      <div className="">{children}</div>
    </main>
  )
}
