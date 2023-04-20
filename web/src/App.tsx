import { useQuery } from "@tanstack/react-query"
import axios, { AxiosHeaders } from "axios"
import { formatDistanceStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import dayjs from "dayjs"
import { io } from "socket.io-client"
import { z } from "zod"
import { Header } from "./components/Header"
import { IPostSession, postSchema, postSessionSchema } from "./schemas/posts"
import { random } from "./utils"
import { useAuthStore } from "./zustand/auth"
import { useModalStore } from "./zustand/modal"
import { useEffect, useState } from "react"
const URL = "http://localhost:3939"

export const socket = io(URL as string)

socket.on("connect", () => console.log("Client connected."))

function App() {
  const { token, isAuth, user } = useAuthStore(state => state)
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)
  
  const [posts, setPosts] = useState<IPostSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios
      .get(URL + "/posts", { headers })
      .then(r => {
        const feedPosts = z.array(postSessionSchema).parse(r.data)
        setPosts(feedPosts)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const { modalHistory } = useModalStore(state => state)

  // const {
  //   data: posts,
  //   isLoading,
  //   isError,
  //   error
  // } = useQuery({
  //   queryKey: ["posts", token],
  //   queryFn: () =>
  //     axios.get(URL + "/posts", { headers }).then(async r => {
  //       console.log(r.data)
  //       return z.array(postSessionSchema).parse(r.data)
  //     }),
  //   staleTime: 1000 * 60 * 1,
  //   retry: false,
  //   refetchOnWindowFocus: false,
  //   enabled: isAuth,
  // })

  return (
    <div className="bg-zinc-800 whitespace-nowrap text-white h-screen flex flex-col [&_*]:transition-colors [&_*]:duration-200">
      <Header />
      <main className="flex grow">
        <section className="mx-auto scroll-thin max-w-lg w-full h-[calc(100vh_-_54px)] bg-zinc-900 flex flex-col overflow-y-scroll">
          {isLoading && !posts && isAuth ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
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
          ) : posts ? (
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
                  className="flex gap-3 items-center last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-6 py-2"
                >
                  <div>
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
                      {post.user.username === user?.username ? (
                        <p className="text-zinc-200 px-1.5 bg-emerald-600 rounded-full text-xs">
                          Você
                        </p>
                      ) : (
                        <p className="text-zinc-200 px-1.5 bg-slate-500 rounded-full text-xs">
                          {post.user.username}
                        </p>
                      )}
                      <p className="text-zinc-500 text-xs">
                        {post.announcement_date.substring(0, 10)} -{" "}
                        <span>
                          {isAnnouncementDateInPast ? `encerrou ` : `encerra `}{" "}
                          {announcementDateString}
                        </span>
                      </p>
                    </div>
                    <p className="whitespace-normal">{post.text}</p>
                  </div>
                  {post.user_id === user?.id ? null : (
                    <button
                      disabled={isAnnouncementDateInPast}
                      className="h-[32px] shrink-0 text-sm w-[97px] ml-auto rounded-full grid place-content-center bg-orange-500 disabled:bg-amber-700 disabled:text-amber-950"
                    >
                      <p
                        className={`${
                          isAnnouncementDateInPast ? "italic" : ""
                        }`}
                      >
                        Fazer bid
                      </p>
                    </button>
                  )}
                </div>
              )
            })
          ) : (
            <div className="mt-12 text-zinc-500">
              <h3 className="text-center">Não há nada para ver aqui :/</h3>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
