import { useMutation, useSelf } from "@liveblocks/react/suspense"

export function useDeleteLayers() {
  const selection = useSelf((me) => me.presence.selection)

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayer = storage.get("layers")
      const liveLayerIds = storage.get("layerIds")

      for (const id of selection) {
        liveLayer.delete(id)
        const index = liveLayerIds.indexOf(id)

        if (index !== -1) {
          liveLayerIds.delete(index)
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true })
    },
    [selection]
  )
}
