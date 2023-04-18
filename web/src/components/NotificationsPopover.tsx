import * as Popover from "@radix-ui/react-popover"
import twc from "tailwindcss/colors"
import ReactDOM from "react-dom"

export function NotificationsPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="hover:bg-zinc-800 p-1.5 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill={twc.white}
            viewBox="0 0 256 256"
          >
            <path d="M225.29,165.93C216.61,151,212,129.57,212,104a84,84,0,0,0-168,0c0,25.58-4.59,47-13.27,61.93A20.08,20.08,0,0,0,30.66,186,19.77,19.77,0,0,0,48,196H84.18a44,44,0,0,0,87.64,0H208a19.77,19.77,0,0,0,17.31-10A20.08,20.08,0,0,0,225.29,165.93ZM128,212a20,20,0,0,1-19.6-16h39.2A20,20,0,0,1,128,212ZM54.66,172C63.51,154,68,131.14,68,104a60,60,0,0,1,120,0c0,27.13,4.48,50,13.33,68Z"></path>
          </svg>
        </button>
      </Popover.Trigger>
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
        </Popover.Content>,
        document.querySelector("#portal")!
      )}
    </Popover.Root>
  )
}
