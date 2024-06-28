import { useOrganization } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { toast } from "sonner"

import { Empty } from "@/components/empty"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { BoardCard } from "./board-card"
import { NewBoardButton } from "./new-board-button"

type BoardsProps = {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

export function Boards({ orgId, query }: BoardsProps) {
  const { organization } = useOrganization()

  const data = useQuery(api.boards.get, { orgId })
  const [create, pending] = useApiMutation(api.board.create)

  const onClick = () => {
    if (!organization) {
      return
    }

    create({
      title: "Untitled",
      orgId: organization.id,
    })
      .then((id) => {
        toast.success("Board created")
        // TODO: redirect to board/{id}
      })
      .catch(() => toast.error("Failed to create board!"))
  }

  if (data === undefined) {
    return <div className="">loading...</div>
  }

  if (!data?.length && query.search) {
    return (
      <Empty
        src="/empty-search.jpg"
        alt="empty-search"
        header="No results found!"
        description="Try searching for something else!"
      />
    )
  }

  if (!data?.length && query.favorites) {
    return (
      <Empty
        src="/empty-favorites.jpg"
        alt="empty-favorites"
        header="No favorites found!"
        description="Try favorite!"
      />
    )
  }

  if (!data?.length) {
    return (
      <Empty
        src="/empty-favorites.jpg"
        alt="empty-boards"
        header="Create your fist board!"
        description="Start creating a board for your organization"
      >
        <div className="mt-6">
          <Button size="lg" onClick={onClick} disabled={pending}>
            Create a board
          </Button>
        </div>
      </Empty>
    )
  }

  return (
    <div className="">
      <h2 className="text-2xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data?.map((board) => {
          return (
            <BoardCard
              key={board._id}
              id={board._id}
              title={board.title}
              imageUrl={board.imageURl}
              authorId={board.authorId}
              authorName={board.authorName}
              createAt={board._creationTime}
              orgId={board.orgId}
              isFavorite={true}
            />
          )
        })}
      </div>
    </div>
  )
}
