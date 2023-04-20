import axios, { AxiosHeaders } from "axios"
import { formatDistanceStrict } from "date-fns"
import { ptBR } from "date-fns/locale"
import dayjs from "dayjs"
import { IPostSession } from "../../schemas/posts"
import { useAuthStore } from "../../zustand/auth"

import React from "react"

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

  const handleMakeBid = (postId: string) => {
    return async () => {
      await axios.post(
        `http://localhost:3939/bid/${postId}`,
        {},
        {
          headers,
        }
      )
    }
  }

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
            onClick={handleMakeBid(post.id)}
          >
            {userHaveMadeBid ? "Bid feito" : "Fazer bid"}
          </p>
        </button>
      )}
    </div>
  )
}
