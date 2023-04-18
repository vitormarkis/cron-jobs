import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  IUserSession,
  IUserSigninBody,
  userSessionSchema,
} from "../schemas/users"
import axios from "axios"
import { z } from "zod"

interface AuthStore {
  user: IUserSession | null
  isAuth: boolean
  token: string | null
  login: (credentials: IUserSigninBody) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthStore>(
  // @ts-expect-error
  persist(
    set => ({
      user: null,
      isAuth: false,
      token: null,
      login: async credentials => {
        const response = await axios.post(
          "http://localhost:3939/signin",
          credentials
        )
        const { accessToken, user } = z
          .object({ accessToken: z.string(), user: userSessionSchema })
          .parse(await response.data)
        set({ user, token: accessToken, isAuth: true })
      },
      logout: () => {
        set({ user: null, token: null, isAuth: false })
      },
    }),
    { name: "auth-storage" }
  )
)
