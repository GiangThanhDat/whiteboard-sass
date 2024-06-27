type BoardListProps = {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

export function BoardList({ orgId, query }: BoardListProps) {
  const data = [] // TODO: Change to API call

  if (!data?.length && query.search) {
    return <div className="">Try searching for something else</div>
  }

  if (!data?.length && query.favorites) {
    return <div className="">No favorites</div>
  }

  if (!data?.length) {
    return <div className="">No board at all</div>
  }

  return <div className="">board list</div>
}
