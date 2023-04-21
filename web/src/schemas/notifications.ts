import { z } from "zod"
import { userSessionSchema } from "./users"

export const notificationActionSchema = z.enum(["MAKE_A_BID_ON_POST"])

export const notificationSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  action: notificationActionSchema,
  user_id: z.string(),
  subject_author_id: z.string(),
  subject: z.string(),
  read: z.boolean(),
})

export const notificationSessionSchema = notificationSchema.merge(
  z.object({
    user: userSessionSchema,
  })
)

export const notificationBodySchema = z.object({
  action: notificationSchema.shape.action,
  user_id: notificationSchema.shape.user_id.nonempty(),
  subject: notificationSchema.shape.subject.nonempty(),
})

export type INotification = z.infer<typeof notificationSchema>
export type INotificationSession = z.infer<typeof notificationSessionSchema>
export type INotificationBody = z.infer<typeof notificationBodySchema>
