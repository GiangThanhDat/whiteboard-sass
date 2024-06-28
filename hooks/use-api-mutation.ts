import { useMutation } from "convex/react"
import { useState } from "react"

export const useApiMutation = (
  mutationFunction: any
): [(payload: any) => Promise<any>, boolean] => {
  const [pending, setPending] = useState(false)
  const apiMutation = useMutation(mutationFunction)

  const mutate = (payload: any) => {
    setPending(true)
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => {
        return result
      })
      .catch((error) => {
        console.error("error:", error)
      })
  }

  return [mutate, pending]
}
