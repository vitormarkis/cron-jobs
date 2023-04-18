import ReactDOM from "react-dom"
import twc from "tailwindcss/colors"
import * as Dialog from "@radix-ui/react-dialog"
import { z } from "zod"

export function SignInModal() {
  return (
    <Dialog.Root>
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
        <Dialog.Content className="absolute inset-0 grid place-content-center">
          <div className="bg-zinc-900 text-white p-6 rounded-lg relative z-10 border border-zinc-700">
            <form className="">
              <h1 className="text-2xl font-bold mb-2">Login</h1>
              <label className="leading-none mb-1.5 block text-sm text-zinc-400">Username</label>
              <input className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-700 placeholder:text-zinc-500 px-4" type="text" placeholder="Seu username..." />
              <label className="leading-none mb-1.5 block text-sm text-zinc-400 ">Senha</label>
              <input className="grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-4 bg-zinc-700 placeholder:text-zinc-500 px-4" type="password" placeholder="Sua senha aqui..." />
              <span className="text-zinc-500 text-sm block mb-2">Não possui conta? <a className="text-blue-400 underline cursor-pointer">Registre-se</a></span>
              <button className="ml-auto grid place-content-center h-[40px] focus:outline focus:outline-blue-500 focus:outline-offset-2 rounded-lg mb-2 bg-zinc-700 px-4">Enviar</button>
            </form>
          </div>
          <Dialog.Close className="absolute cursor-default inset-0 bg-black/20" />
        </Dialog.Content>,
        document.querySelector("#portal")!
      )}
    </Dialog.Root>
  )
}
