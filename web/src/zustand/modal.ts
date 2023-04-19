import { create } from "zustand"

interface ModalStore {
  getLastModalOpen: () => string | null
  modalHistory: string[]
  appendModalToHistory: (modal: string) => void
  closeThisModal: () => void
  isThisModalOpen: (modalName: string) => boolean
  rootModalOpen: React.Dispatch<React.SetStateAction<boolean>> | null
  setRootModalOpen: (
    stateSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  closeRootModal: () => void
}

export const useModalStore = create<ModalStore>((set, get) => ({
  getLastModalOpen: () => get().modalHistory.at(-1) ?? null,
  modalHistory: [],
  closeThisModal: () =>
    set(({ modalHistory }) => ({
      modalHistory: modalHistory.slice(0, modalHistory.length - 1),
    })),
  appendModalToHistory: modal =>
    set(({ modalHistory }) => ({ modalHistory: [...modalHistory, modal] })),
  isThisModalOpen: modalName => get().modalHistory.includes(modalName),
  rootModalOpen: null,
  setRootModalOpen: stateSetter => set({ rootModalOpen: stateSetter }),
  closeRootModal: () =>
    set(({ rootModalOpen }) => {
      if (rootModalOpen) rootModalOpen(false)
      return { modalHistory: [] }
    }),
}))
