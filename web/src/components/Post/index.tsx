import axios, { AxiosHeaders } from "axios"
import { formatDistanceStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import dayjs from "dayjs"
import { IPostSession } from "../../schemas/posts"
import { useAuthStore } from "../../zustand/auth"
import { useMutation } from "@tanstack/react-query"

import React from "react"
import { socket } from "../../App"
import { queryClient } from "../../services/queryClient"
import { INotificationBody } from "../../schemas/notifications"

interface Props {
  post: IPostSession
}

export const Post: React.FC<Props> = ({ post }) => {
  const { user, token } = useAuthStore()
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)

  const postBidsIds = post.post_bids.reduce(
    (acc: string[], item) => (acc.push(item.user_id), acc),
    []
  )

  const userHaveMadeBid = user?.id ? postBidsIds.includes(user.id) : false

  const isAnnouncementDateInPast = dayjs(post.announcement_date).isBefore(
    dayjs()
  )
  const announcementDateString = formatDistanceStrict(
    new Date(post.announcement_date),
    new Date(),
    { locale: ptBR, addSuffix: true }
  )

  interface MakeBidRequestBody {
    post_id: string
    post_text: string
  }

  const { mutateAsync: makeBidRequest } = useMutation<
    unknown,
    unknown,
    MakeBidRequestBody
  >({
    mutationFn: ({ post_id }) =>
      axios.post(`http://localhost:3939/bid/${post_id}`, undefined, {
        headers,
      }),
    onSuccess(_, { post_id, post_text }) {
      if (user && user.id) {
        queryClient.invalidateQueries(["posts", token])
        socket.emit("join_post", { post_id })
        socket.emit("make_bid", {
          action: "MAKE_A_BID_ON_POST",
          subject: post_id,
          user_id: user.id,
        } as INotificationBody)
      }
    },
  })

  const handleMakeBid = (post_id: string, post_text: string) => () =>
    makeBidRequest({ post_id, post_text })

  const isPostOwner = user ? post.user_id === user.id : null

  return (
    <div
      key={post.id}
      className="flex flex-col last-of-type:border-none border-b border-b-zinc-800 cursor-pointer hover:bg-zinc-700/10 px-6 py-2"
    >
      <div className="flex gap-3 items-center">
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
          <p className="whitespace-normal my-1">{post.text}</p>
        </div>
        {post.user_id === user?.id ? null : (
          <button
            disabled={isAnnouncementDateInPast || userHaveMadeBid}
            className={`h-[32px] shrink-0 text-sm w-[97px] ml-auto rounded-full grid place-content-center bg-orange-500 
          ${
            userHaveMadeBid
              ? `bg-amber-700 text-amber-950`
              : isAnnouncementDateInPast
              ? `bg-zinc-700 text-zinc-500`
              : ""
          }`}
          >
            <p
              className={`${
                isAnnouncementDateInPast || userHaveMadeBid ? "italic" : ""
              } ${userHaveMadeBid ? "" : ""}`}
              onClick={handleMakeBid(post.id, post.text)}
            >
              {userHaveMadeBid ? "Bid feito" : "Fazer bid"}
            </p>
          </button>
        )}
      </div>
      <div className="flex gap-1 flex-wrap mt-1">
        {isPostOwner
          ? post.post_bids.map(bid => (
              <p
                key={bid.id}
                className="text-[10px] px-2 rounded-full bg-zinc-800 border-t border-t-zinc-700 border-b border-b-zinc-900 text-zinc-400 font-medium self-start"
              >
                {bid.user.name}
              </p>
            ))
          : null}
      </div>
    </div>
  )
}
