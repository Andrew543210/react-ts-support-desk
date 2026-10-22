import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom"
import ToastProvider from "./components/ToastProvider/ToastProvider"
import { createRoot } from 'react-dom/client'
import "./styles/variables.css"
import "./styles/globals.css"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
