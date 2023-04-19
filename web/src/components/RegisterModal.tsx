import ReactDOM from "react-dom"
import twc from "tailwindcss/colors"
import * as Dialog from "@radix-ui/react-dialog"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { IUserRegisterBody, userRegisterSchema } from "../schemas/users"
import { AxiosError } from "axios"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuthStore } from "../zustand/auth"
import { SignInModal } from "./SiginInModal"
import { useModalStore } from "../zustand/modal"

export function RegisterModal({
  children,
  modalName,
  keyId,
}: {
  children: React.ReactNode
  modalName: string
  keyId: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    appendModalToHistory,
    closeThisModal,
    getLastModalOpen,
    rootModalOpen,
    setRootModalOpen,
    modalHistory,
    closeRootModal,
  } = useModalStore(s => s)

  const [errorMessage, setErrorMessage] = useState("")
  const { register, handleSubmit, reset } = useForm<IUserRegisterBody>()
  const { register: registerUser } = useAuthStore(state => state)

  useEffect(() => {
    if (modalHistory.length === 1 && !rootModalOpen) {
      setRootModalOpen(setIsModalOpen)
    }
  }, [])

  const submitHandler: SubmitHandler<IUserRegisterBody> = async formData => {
    try {
      const { password, username, name } = userRegisterSchema.parse(formData)

      setErrorMessage("")
      await registerUser({ password, username, name })
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
  const modalId = useMemo(() => `${modalName}-${keyId}`, [])

  const open = isModalOpen && modalHistory.length !== 0

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
            <form autoComplete="off" onSubmit={handleSubmit(submitHandler)}>
              <h1 className="text-2xl font-black mb-2">Criar conta</h1>
              <label className="leading-none mb-1.5 block text-sm text-zinc-400">
                Nome
              </label>
              <input
                className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-800 placeholder:text-zinc-500 px-4"
                type="text"
                placeholder="Seu nome..."
                {...register("name")}
              />
              <label className="leading-none mb-1.5 block text-sm text-zinc-400">
                Username
              </label>
              <input
                className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-800 placeholder:text-zinc-500 px-4"
                type="text"
                placeholder="Seu username..."
                {...register("username")}
              />
              <label className="leading-none mb-1.5 block text-sm text-zinc-400 ">
                Senha
              </label>
              <input
                className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-800 placeholder:text-zinc-500 px-4"
                type="password"
                placeholder="Sua senha aqui..."
                {...register("password")}
              />
              <span className="text-zinc-500 text-sm block mb-2">
                Já possui uma conta?{" "}
                <SignInModal
                  modalName="signin"
                  keyId={Math.random().toString(36).substring(2, 9)}
                >
                  <a className="text-blue-400 underline cursor-pointer">
                    Entrar
                  </a>
                </SignInModal>
              </span>
              <div className="flex justify-end items-center">
                <button className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-2 bg-zinc-800 px-4">
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
