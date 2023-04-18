import twc from "tailwindcss/colors"
import { NotificationsPopover } from "./components/NotificationsPopover"
import { io } from "socket.io-client"
import { useQuery } from "@tanstack/react-query"
const URL = "http://localhost:3939"
import axios from "axios"
import { z } from "zod"
import { postSchema } from "./schemas/posts"
import { formatDistanceStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import dayjs from "dayjs"
import { random } from "./utils"

export const socket = io(URL as string)

socket.on("connect", () => console.log("Client connected."))

function App() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.get(URL + "/posts").then(r => z.array(postSchema).parse(r.data)),
    staleTime: 1000 * 60 * 1,
  })

  // const posts = null
  // const isLoading = true

  // const posts = [
  //   {
  //     id: "clglah7jg0001vem0szvhefxr",
  //     text: "New Post",
  //     user_id: "clgl6ftv60000veguusl1n8ol",
  //     announcement_date: "2023-04-18T00:00:00.000Z",
  //     created_at: "2023-04-17T20:29:12.172Z",
  //     updated_at: "2023-04-17T20:29:12.172Z",
  //   },
  //   {
  //     id: "clglaijn50003vem032izsic4",
  //     text: "Another one post to fill up",
  //     user_id: "clgl6ftv60000veguusl1n8ol",
  //     announcement_date: "2023-04-19T00:00:00.000Z",
  //     created_at: "2023-04-17T20:30:14.513Z",
  //     updated_at: "2023-04-17T20:30:14.513Z",
  //   },
  // ]
  // const isLoading = false

  // console.log(posts)

  // posts && !isLoading

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
            <NotificationsPopover />
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
                    <p className="bg-zinc-800 animate-pulse h-3.5 mb-1.5 rounded-lg"
                      style={{ width: random(175, 190) }}
                     />
                    <p
                      className="bg-zinc-600 animate-pulse w-full h-[1.125rem] rounded-lg"
                      style={{ width: random(70, 350) }}
                    />
                  </div>
                  <button className="ml-4 rounded-full px-5 py-2 border-b border-orange-900 animate-pulse text-sm bg-orange-600 h-[32px] w-[97px]" />
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
