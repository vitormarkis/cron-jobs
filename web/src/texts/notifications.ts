import {
  INotificationCodes,
  INotificationSession,
} from "../schemas/notifications"

export function createNotification(notification: INotificationSession) {
  function getMessage() {
    const messages: Record<INotificationCodes, string> = {
      MAKE_A_BID_ON_POST: `${notification.subject_author.username} fez um lance no seu post.`,
      POST_HAS_FINISHED: `O post ${notification.subject} foi encerrado.`,
    }

    return { notificationMessage: messages[notification.action] }
  }

  return {
    getMessage,
  }
}
