import { z } from "zod"

export const bidsSchema = z.object({
  post_id: z.string(),
})

export type IBid = z.infer<typeof bidsSchema>
