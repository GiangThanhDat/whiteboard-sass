"use client"

import { Actions } from "@/components/actions"
import { Hint } from "@/components/hint"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useRenameModal } from "@/store/use-rename-modal"
import { useQuery } from "convex/react"
import { Menu } from "lucide-react"
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

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1.5">|</div>
}

export function Info({ boardId }: InfoProps) {
  const { onOpen } = useRenameModal()

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  })

  if (!data) {
    return <InfoSkeleton />
  }

  return (
    <div
      id="info"
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 py-1 shadow-md flex items-center "
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
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={18}>
        <Button
          variant={"board"}
          className="text-base font-normal px-2"
          onClick={() => {
            onOpen(data._id, data.title)
          }}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions id={data._id} title={data.title} side="bottom" sideOffset={10}>
        <div className="">
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant={"board"}>
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
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
