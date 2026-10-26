import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"

import ToastProvider from "./components/ToastProvider/ToastProvider"
import ErrorFallback from "./components/ErrorBoundary/ErrorFallback"
import App from "./App.tsx"

import "./styles/variables.css"
import "./styles/globals.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, info) => {
                    console.error(
                        "Unhandled React rendering error:",
                        error,
                        info.componentStack
                    )
                }}
            >
                <ToastProvider>
                    <App />
                </ToastProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>,
)