import { z } from "zod"

export const bidSchema = z.object({
  id: z.string(),
  post_id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const bidBodySchema = z.object({
  post_id: bidSchema.shape.post_id.nonempty(),
})

export type IBid = z.infer<typeof bidBodySchema>
