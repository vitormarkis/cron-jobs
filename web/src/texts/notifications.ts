import { INotificationCodes } from "../schemas/notifications"

export function createNotification() {
  function getMessage(notificationCode: INotificationCodes) {
    const messages: Record<INotificationCodes, string> = {
      MAKE_A_BID_ON_POST: "fez um lance no seu post.",
    }

    return { notificationMessage: messages[notificationCode] }
  }

  return {
    getMessage,
  }
}
