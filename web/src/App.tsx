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
import { Post } from "./components/Post"
import { INotification } from "./schemas/notifications"
const URL = "http://localhost:3939"

export const socket = io(URL as string)

function App() {
  const { token, isAuth, user } = useAuthStore(state => state)
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", user?.username ?? null],
    queryFn: () =>
      axios
        .get(URL + "/posts", { headers })
        .then(r => z.array(postSessionSchema).parse(r.data)),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuth,
  })

  useEffect(() => {
    if (user) socket.emit("join_room", user)
  }, [token])

  return (
    <div className="bg-zinc-800 whitespace-nowrap text-white h-screen flex flex-col [&_*]:transition-colors [&_*]:duration-200">
      <Header />
      <main className="flex grow">
        <section className="mx-auto scroll-thin max-w-2xl w-full h-[calc(100vh_-_54px)] bg-zinc-900 flex flex-col overflow-y-scroll">
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
            posts.map(post => <Post key={post.id} post={post} />)
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
