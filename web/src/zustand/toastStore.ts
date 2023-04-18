import { create } from "zustand"

type ToastStore = {
  isToastVisible: boolean
  showToast: () => void
  hideToast: () => void
}

export const useToastStore = create<ToastStore>(set => ({
  isToastVisible: false,
  showToast: () => set({ isToastVisible: true }),
  hideToast: () => set({ isToastVisible: false }),
}))
