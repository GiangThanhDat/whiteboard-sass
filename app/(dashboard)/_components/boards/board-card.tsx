import { useAuth } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"

import { Actions } from "@/components/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
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

  const [favorite, pendingFavorite] = useApiMutation(api.board.favorite)
  const [unfavorite, pendingUnfavorite] = useApiMutation(api.board.unfavorite)

  const authorLabel = userId === authorId ? "you" : authorName
  const createdAtLabel = formatDistanceToNow(createAt)

  const toggleFavorite = () => {
    if (isFavorite) {
      unfavorite({ id }).catch(() => toast.error("Failed to unfavorite"))
    } else {
      favorite({ id, orgId }).catch(() => toast.error("Failed to favorite"))
    }
  }

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt="Doodle" fill className="object-fit" />
          <Actions id={id} title={title} side="bottom" sideOffset={5}>
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity outline-none z-50">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </Actions>
          <Overlay />
        </div>
        <Footer
          title={title}
          isFavorite={isFavorite}
          authorLabel={authorLabel}
          createAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className=" aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  )
}
