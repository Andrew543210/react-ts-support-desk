import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ToastContext } from "../../contexts/ToastContext"
import styles from "./ToastProvider.module.css"

type ToastProviderProps = {
    children: ReactNode
}

type Toast = {
    id: number
    message: string
}

export default function ToastProvider({
    children,
}: ToastProviderProps) {
    const [toast, setToast] = useState<Toast | null>(null)
    const nextId = useRef(0)

    const showToast = useCallback((message: string) => {
        nextId.current += 1

        setToast({
            id: nextId.current,
            message,
        })
    }, [])

    const contextValue = useMemo(
        () => ({ showToast }),
        [showToast]
    )

    useEffect(() => {
        if (toast === null) return

        const timeoutId = window.setTimeout(() => {
            setToast((currentToast) =>
                currentToast?.id === toast.id
                    ? null
                    : currentToast
            )
        }, 4000)

        return () => window.clearTimeout(timeoutId)
    }, [toast])

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <div
                className={styles.container}
                aria-live="polite"
                aria-atomic="true"
            >
                {toast && (
                    <div className={styles.toast}>
                        <span className={styles.message}>
                            {toast.message}
                        </span>

                        <button
                            type="button"
                            className={styles.closeButton}
                            aria-label="Dismiss notification"
                            onClick={() => setToast(null)}
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    )
}