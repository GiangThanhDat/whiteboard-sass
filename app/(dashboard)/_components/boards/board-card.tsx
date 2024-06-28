import { useAuth } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"

import { Footer } from "./footer"
import { Overlay } from "./overlay"

type BoardCardProps = {
  id: string
  title: string
  imageUrl: string
  authorId: string
  authorName: string
  createAt: number
  orgId: string
  isFavorite: boolean
}

export function BoardCard({
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  createAt,
  orgId,
  isFavorite,
}: BoardCardProps) {
  const { userId } = useAuth()

  const authorLabel = userId === authorId ? "you" : authorName
  const createdAtLabel = formatDistanceToNow(createAt)

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt="Doodle" fill className="object-fit" />
          <Overlay />
        </div>
        <Footer
          title={title}
          isFavorite={isFavorite}
          authorLabel={authorLabel}
          createAtLabel={createdAtLabel}
          onClick={() => {}}
          disabled={false}
        />
      </div>
    </Link>
  )
}
