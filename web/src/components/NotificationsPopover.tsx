import * as Popover from "@radix-ui/react-popover"
import twc from "tailwindcss/colors"
import ReactDOM from "react-dom"

export function NotificationsPopover({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      {ReactDOM.createPortal(
        <Popover.Content align="end">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 text-white shadow-lg shadow-black/20 max-h-[75vh] overflow-y-scroll scroll-thin text-sm">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-24 py-2"
              >
                {Math.random().toString(36).substring(2, 9)}
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
