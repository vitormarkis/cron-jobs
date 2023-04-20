import * as Popover from "@radix-ui/react-popover"
import twc from "tailwindcss/colors"
import ReactDOM from "react-dom"
import { useEffect, useState } from "react"
import { INotification } from "../schemas/notifications"
import { socket } from "../App"

export function NotificationsPopover({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<INotification[]>([])

  useEffect(() => {
    socket.on("bid_was_made", (notification: INotification) => {
      setNotifications(prev => [...prev, notification])
    })
  }, [socket])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {ReactDOM.createPortal(
        <Popover.Content align="end">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-lg shadow-black/20 max-h-[75vh] overflow-y-scroll scroll-thin text-sm">
            {notifications.length > 0 ? (
              notifications.map(({ action, id, username }) => (
                <div
                  key={id}
                  className="last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-24 py-2 text-zinc-500"
                >
                  <span className="text-white">{username}</span>
                  {` ${action}`}
                </div>
              ))
            ) : (
              <div className="hover:bg-zinc-700/10 px-24 py-2 text-zinc-500">
                Sem notificações
              </div>
            )}
          </div>
          <Popover.Arrow fill={twc.zinc[800]} />
        </Popover.Content>,
        document.querySelector("#portal")!
      )}
    </Popover.Root>
  )
}
