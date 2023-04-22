import ReactDOM from "react-dom"
import twc from "tailwindcss/colors"
import * as Dialog from "@radix-ui/react-dialog"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  IUserSigninBody,
  userSchema,
  userSessionSchema,
  userSigninSchema,
} from "../schemas/users"
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useToastStore } from "../zustand/toastStore"
import { useAuthStore } from "../zustand/auth"
import { RegisterModal } from "./RegisterModal"
import { useModalStore } from "../zustand/modal"
import { IPost, IPostBody, postBodySchema } from "../schemas/posts"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "../services/queryClient"
import { socket } from "../App"

export function NewPostModal({
  children,
  modalName,
  keyId,
}: {
  children: React.ReactNode
  modalName: string
  keyId: string
}) {
  const {
    appendModalToHistory,
    closeThisModal,
    getLastModalOpen,
    modalHistory,
    setRootModalOpen,
    rootModalOpen,
    closeRootModal,
  } = useModalStore(s => s)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { register, handleSubmit, reset } = useForm<IPostBody>()
  const { token, user } = useAuthStore()
  const headers = new AxiosHeaders().setAuthorization(`bearer ${token}`)

  const { mutateAsync, isLoading } = useMutation<AxiosResponse<IPost>, unknown, IPostBody>({
    mutationFn: ({ announcement_date, text }: IPostBody) =>
      axios.post(
        "http://localhost:3939/posts",
        { announcement_date: new Date(announcement_date).toISOString(), text },
        { headers }
      ),
    onSuccess: (post) => {
        socket.emit("join_post", { post_id: post.data.id })
      queryClient.invalidateQueries(["posts", user?.username ?? null])
      closeRootModal()
    },
  })

  const submitHandler: SubmitHandler<IPostBody> = async formData => {
    try {
      const { announcement_date, text } = postBodySchema.parse(formData)
      setErrorMessage("")

      await mutateAsync({ announcement_date, text })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const [actualError] = error.issues
        setErrorMessage(actualError.message)
        return
      }
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data.message)
        return
      }
      console.log({ error })
    }
  }

  const open = isModalOpen && modalHistory.length !== 0

  useEffect(() => {
    if (modalHistory.length === 1 && !rootModalOpen) {
      setRootModalOpen(setIsModalOpen)
    }
  }, [])

  const modalId = useMemo(() => `${modalName}-${keyId}`, [])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={open => {
        setIsModalOpen(open)
        open ? appendModalToHistory(modalId) : closeThisModal()
      }}
    >
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      {ReactDOM.createPortal(
        <Dialog.Content
          className={`absolute inset-0 place-content-center ${
            getLastModalOpen() === modalId ? "grid" : "hidden"
          }`}
        >
          <div className="bg-zinc-900 text-white p-6 rounded-lg relative z-10 border border-zinc-700">
            <form
              className=""
              autoComplete="off"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="text-2xl font-black mb-2">Novo post</h1>
              <label className="leading-none mb-1.5 block text-sm text-zinc-400">
                Texto
              </label>
              <input
                className="grid place-content-center w-full h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-800 placeholder:text-zinc-500 px-4"
                type="text"
                placeholder="Escreva o conteúdo do seu post..."
                {...register("text")}
              />
              <label className="leading-none mb-1.5 block text-sm text-zinc-400 ">
                Data de encerramento
              </label>
              <input
                className="grid place-content-center w-full h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-800 placeholder:text-zinc-500 px-4"
                type="date"
                placeholder="Data de encerramento do post..."
                defaultValue={new Date().toISOString()}
                {...register("announcement_date")}
              />
              <div className="flex justify-end items-center">
                <button
                  disabled={isLoading}
                  className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-2 bg-zinc-800 px-4"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
          <div
            onClick={() => {
              closeRootModal()
              setErrorMessage("")
              reset()
            }}
            className="absolute cursor-default inset-0 bg-black/20"
          />
          <AnimatePresence>
            {errorMessage.length > 0 && (
              <div className="absolute top-12 z-20 grid place-content-center right-0 left-0">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-white relative p-3 rounded-lg bg-red-500 border-red-400 border shadow-lg"
                >
                  <h3>{errorMessage}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill={twc.white}
                    viewBox="0 0 256 256"
                    className="p-0.5 cursor-pointer rounded-full bg-red-500 border border-red-400 absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
                    onClick={() => setErrorMessage("")}
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </Dialog.Content>,
        document.querySelector("#portal")!
      )}
    </Dialog.Root>
  )
}
