"use client"

import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useQuery } from "convex/react"
import { Poppins } from "next/font/google"
import Image from "next/image"
import Link from "next/link"

type InfoProps = {
  boardId: string
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

export function Info({ boardId }: InfoProps) {
  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  })

  return (
    <div
      id="info"
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 shadow-md"
    >
      <Hint label="go to boards" side="bottom" sideOffset={18}>
        <Button asChild className="px-2" variant={"board"}>
          <Link href="/">
            <Image
              src={"/next.svg"}
              alt="Whiteboard logo"
              height={40}
              width={40}
            />
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Whiteboard
            </span>
          </Link>
        </Button>
      </Hint>
    </div>
  )
}

export function InfoSkeleton() {
  return (
    <div
      id="info-skeleton"
      className="absolute top-2 left-2 rounded-md w-[300px]  h-[50px] shadow-md"
    >
      <Skeleton className="h-full w-full bg-neutral-200" />
    </div>
  )
}
