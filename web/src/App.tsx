import twc from "tailwindcss/colors"
import { NotificationsPopover } from "./components/NotificationsPopover"

function App() {
  return (
    <div className="bg-zinc-800 text-white h-screen flex flex-col [&_*]:transition-colors [&_*]:duration-200">
      <div className="bg-zinc-900">
        <div className="mx-auto max-w-7xl w-full px-4 flex justify-between items-center py-2">
          <div className="flex gap-2 items-center leading-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill={twc.white}
              viewBox="0 0 256 256"
            >
              <path d="M190.23,128l24.88-24.89a44,44,0,1,0-62.22-62.22L128,65.77,103.11,40.89a44,44,0,1,0-62.22,62.22L65.77,128,40.89,152.89a44,44,0,1,0,62.22,62.22L128,190.23l24.89,24.88a44,44,0,1,0,62.22-62.22ZM169.86,57.86h0a20,20,0,1,1,28.28,28.28L173.25,111,145,82.75ZM156.28,128,128,156.28,99.72,128,128,99.72ZM57.86,86.14A20,20,0,1,1,86.14,57.86L111,82.75,82.75,111Zm28.28,112a20,20,0,1,1-28.28-28.28L82.75,145,111,173.25Zm112,0a20,20,0,0,1-28.28,0L145,173.25,173.25,145l24.89,24.89a20,20,0,0,1,0,28.28Z"></path>
            </svg>
            <p className="outfit text-2xl font-medium tracking-wide">
              Notifies
            </p>
          </div>
          <div className="flex items-center">
            <NotificationsPopover />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
