import { create } from "zustand"
import { INotification } from "../schemas/notifications"

interface NotificationsStore {
  notifications: INotification[]
  addNewNotification: (notification: INotification) => void
  hasNotification: () => boolean
}

export const useNotificationStore = create<NotificationsStore>((set, get) => ({
  addNewNotification: newNotification =>
    set(({ notifications }) => ({
      notifications: [...notifications, newNotification],
    })),
  notifications: [],
  hasNotification: () => get().notifications.length > 0,
}))
