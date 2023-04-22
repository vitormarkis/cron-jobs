import React from 'react';
import { INotificationSession } from '../schemas/notifications';
import { createNotification } from '../texts/notifications';

interface Props {
  notification: INotificationSession
}

export const Notification: React.FC<Props> = ({ notification }) => {
  const NotificationClass = createNotification(notification)
  const { notificationMessage } = NotificationClass.getMessage()
  
  return (
    <div
    className="last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-24 py-2 text-zinc-500"
  >
    <span className="text-white">{notificationMessage}</span>
  </div>

  )
}