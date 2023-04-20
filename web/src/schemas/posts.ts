import { z } from "zod"
import { userSchema } from "./users"

export const postSchema = z.object({
  id: z.string(),
  text: z.string(),
  user_id: z.string(),
  announcement_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const postSessionSchema = postSchema.merge(
  z.object({
    user: z.object({
      id: userSchema.shape.id,
      name: userSchema.shape.name.nullable(),
      profile_pic: userSchema.shape.profile_pic.nullable(),
      username: userSchema.shape.username,
    }),
  })
)

export const postBodySchema = z.object({
  text: postSchema.shape.text,
  announcement_date: postSchema.shape.announcement_date,
})

export type IPost = z.infer<typeof postSchema>
export type IPostBody = z.infer<typeof postBodySchema>
export type IPostSession = z.infer<typeof postSessionSchema>
