import * as Popover from "@radix-ui/react-popover"
import twc from "tailwindcss/colors"
import ReactDOM from "react-dom"
import { useState } from "react"

interface INotification {
  id: string
  action: string
  username: string
}

export function NotificationsPopover({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<INotification[]>([
    {
      id: "hhr8g89h389h",
      action: "deu um lance em seu post",
      username: "vitormarkis",
    },
    {
      id: "ihr9hge8rhg9",
      action: "deu um lance em seu post",
      username: "kauanbarts",
    },
  ])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {ReactDOM.createPortal(
        <Popover.Content align="end">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-lg shadow-black/20 max-h-[75vh] overflow-y-scroll scroll-thin text-sm">
            {notifications.map(({ action, id, username }) => (
              <div
                key={id}
                className="last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-24 py-2 text-zinc-500"
              >
                <span className="text-white">{username}</span>
                {` ${action}`}
              </div>
            ))}
          </div>
          <Popover.Arrow fill={twc.zinc[800]} />
        </Popover.Content>,
        document.querySelector("#portal")!
      )}
    </Popover.Root>
  )
}
