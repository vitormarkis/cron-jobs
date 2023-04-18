import twc from "tailwindcss/colors"
import { NotificationsPopover } from "./components/NotificationsPopover"
import { io } from "socket.io-client"
import { useQuery } from "@tanstack/react-query"
const URL = "http://localhost:3939"
import axios, { AxiosHeaders } from "axios"
import { z } from "zod"
import { postSchema } from "./schemas/posts"
import { formatDistanceStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import dayjs from "dayjs"
import { random } from "./utils"
import { AnimatePresence } from "framer-motion"
import { SignInModal } from "./components/SiginInModal"
import { useAuthStore } from "./zustand/auth"

export const socket = io(URL as string)

socket.on("connect", () => console.log("Client connected."))

function App() {
  const { token, isAuth, logout } = useAuthStore(state => state)
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)
  console.log(token)

  const { data: posts } = useQuery({
    queryKey: ["posts", token],
    queryFn: () =>
      axios
        .get(URL + "/posts", { headers })
        .then(r => z.array(postSchema).parse(r.data)),
    staleTime: 1000 * 60 * 1,
  })

  const { user } = useAuthStore(state => state)

  return (
    <div className="bg-zinc-800 whitespace-nowrap text-white h-screen flex flex-col [&_*]:transition-colors [&_*]:duration-200">
      <header className="bg-zinc-950">
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
            {user && <p className="p-1.5">{user.username}</p>}
            <NotificationsPopover />

            {isAuth ? (
              <button
                onClick={() => logout()}
                className="hover:bg-zinc-800 p-1.5 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill={twc.white}
                  viewBox="0 0 256 256"
                >
                  <path d="M116,216a12,12,0,0,1-12,12H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28h56a12,12,0,0,1,0,24H52V204h52A12,12,0,0,1,116,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L187,116H104a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,224.49,119.51Z"></path>
                </svg>
              </button>
            ) : (
              <SignInModal />
            )}
          </div>
        </div>
      </header>
      <main className="flex grow">
        <section className="mx-auto scroll-thin max-w-lg w-full h-[calc(100vh_-_54px)] bg-zinc-900 flex flex-col overflow-y-scroll">
          {posts ? (
            posts.map(post => {
              const isAnnouncementDateInPast = dayjs(
                post.announcement_date
              ).isBefore(dayjs())
              const announcementDateString = formatDistanceStrict(
                new Date(post.announcement_date),
                new Date(),
                { locale: ptBR, addSuffix: true }
              )

              return (
                <div
                  key={post.id}
                  className="flex items-center last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-6 py-2"
                >
                  <div>
                    <p className="text-zinc-500 text-xs">
                      {post.announcement_date.substring(0, 10)} -{" "}
                      <span>
                        {isAnnouncementDateInPast ? `encerrou ` : `encerra `}{" "}
                        {announcementDateString}
                      </span>
                    </p>
                    <p>{post.text}</p>
                  </div>
                  <button
                    disabled={isAnnouncementDateInPast}
                    className="h-[32px] text-sm w-[97px] ml-auto rounded-full grid place-content-center bg-orange-500 disabled:bg-amber-700 disabled:text-amber-950"
                  >
                    <p
                      className={`${isAnnouncementDateInPast ? "italic" : ""}`}
                    >
                      Fazer bid
                    </p>
                  </button>
                </div>
              )
            })
          ) : (
            <>
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-6 py-2"
                >
                  <div className="flex flex-col grow gap-1">
                    <p
                      className="bg-zinc-800 animate-pulse h-3.5 mb-1.5 rounded-lg"
                      style={{ width: random(175, 190) }}
                    />
                    <p
                      className="bg-zinc-600 animate-pulse w-full h-[1.125rem] rounded-lg"
                      style={{ width: random(70, 350) }}
                    />
                  </div>
                  <button className="ml-4 rounded-full px-5 py-2 border-b border-zinc-900 animate-pulse text-sm bg-zinc-600 h-[32px] w-[97px]" />
                </div>
              ))}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
