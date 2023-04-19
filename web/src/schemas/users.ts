import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
  profile_pic: z.string(),
})

export const userSigninSchema = z.object({
  username: userSchema.shape.username.min(
    ...((num: number): [number, string] => {
      return [num, `Usuário precisa ter ao menos ${num} caracteres.`]
    })(5)
  ),
  password: userSchema.shape.password,
})

export const userRegisterSchema = z.object({
  name: userSchema.shape.name.nonempty(),
  username: userSchema.shape.username.nonempty(),
  password: userSchema.shape.password.nonempty(),
  profile_pic: userSchema.shape.profile_pic.optional(),
})

export const userSessionSchema = z.object({
  id: userSchema.shape.id.nonempty(),
  name: userSchema.shape.name.nullable(),
  username: userSchema.shape.username.nonempty(),
  profile_pic: userSchema.shape.profile_pic.nullable(),
})

export type IUser = z.infer<typeof userSchema>
export type IUserSigninBody = z.infer<typeof userSigninSchema>
export type IUserRegisterBody = z.infer<typeof userRegisterSchema>
export type IUserSession = z.infer<typeof userSessionSchema>
