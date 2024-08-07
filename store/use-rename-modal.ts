import { create } from "zustand"

const defaultValues = { id: "", title: "" }

type RenameModal = {
  isOpen: boolean
  initialValues: typeof defaultValues
  onOpen: (id: string, title: string) => void
  onClose: () => void
}

export const useRenameModal = create<RenameModal>((set) => ({
  isOpen: false,
  onOpen: (id: string, title: string) =>
    set({
      isOpen: true,
      initialValues: { id, title },
    }),
  onClose: () =>
    set({
      isOpen: false,
      initialValues: defaultValues,
    }),
  initialValues: defaultValues,
}))
