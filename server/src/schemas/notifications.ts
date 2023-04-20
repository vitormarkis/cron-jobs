import { z } from "zod"
import { userSchema } from "./users"

export const notificationSchema = z.object({
  id: z.string().nonempty(),
  action: z.string().nonempty(),
  username: userSchema.shape.username.nonempty(),
})

export type INotification = z.infer<typeof notificationSchema>
