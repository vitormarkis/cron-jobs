import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./services/queryClient"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
