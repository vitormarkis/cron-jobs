import ReactDOM from "react-dom"
import twc from "tailwindcss/colors"
import * as Dialog from "@radix-ui/react-dialog"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { IUserRegisterBody, userRegisterSchema } from "../schemas/users"
import { AxiosError } from "axios"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuthStore } from "../zustand/auth"

export function RegisterModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { register, handleSubmit } = useForm<IUserRegisterBody>()
  const { register: registerUser } = useAuthStore(state => state)

  const submitHandler: SubmitHandler<IUserRegisterBody> = async formData => {
    try {
      const { password, username, name } = userRegisterSchema.parse(formData)

      setErrorMessage("")
      await registerUser({ password, username, name }).then(() =>
        setIsModalOpen(false)
      )
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

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger asChild>
        <button className="hover:bg-zinc-800 p-1.5 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill={twc.white}
            viewBox="0 0 256 256"
          >
            <path d="M144.49,136.49l-40,40a12,12,0,0,1-17-17L107,140H24a12,12,0,0,1,0-24h83L87.51,96.49a12,12,0,0,1,17-17l40,40A12,12,0,0,1,144.49,136.49ZM192,28H136a12,12,0,0,0,0,24h52V204H136a12,12,0,0,0,0,24h56a20,20,0,0,0,20-20V48A20,20,0,0,0,192,28Z"></path>
          </svg>
        </button>
      </Dialog.Trigger>
      {ReactDOM.createPortal(
        <Dialog.Content
          onCloseAutoFocus={() => setErrorMessage("")}
          className="absolute inset-0 grid place-content-center"
        >
          <div className="bg-zinc-900 text-white p-6 rounded-lg relative z-10 border border-zinc-700">
            <form
              className=""
              autoComplete="off"
              onSubmit={handleSubmit(submitHandler)}
            >
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
                Não possui conta?{" "}
                <a className="text-blue-400 underline cursor-pointer">
                  Registre-se
                </a>
              </span>
              <div className="flex justify-end items-center">
                <button className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-2 bg-zinc-800 px-4">
                  Enviar
                </button>
              </div>
            </form>
          </div>
          <Dialog.Close className="absolute cursor-default inset-0 bg-black/20" />
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
