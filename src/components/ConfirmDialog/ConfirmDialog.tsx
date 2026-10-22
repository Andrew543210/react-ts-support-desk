import { useEffect, useId, useRef } from "react"
import styles from "./ConfirmDialog.module.css"

type ConfirmDialogProps = {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const messageId = useId()

    useEffect(() => {
        const dialog = dialogRef.current

        if (!dialog) return

        if (isOpen && !dialog.open) {
            dialog.showModal()
        } else if (!isOpen && dialog.open) {
            dialog.close()
        }
    }, [isOpen])

    return (
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-labelledby={titleId}
            aria-describedby={messageId}
            onCancel={(e) => {
                e.preventDefault()
                onCancel()
            }}
        >
            <h2 id={titleId} className={styles.title}>
                {title}
            </h2>

            <p id={messageId} className={styles.message}>
                {message}
            </p>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className={styles.confirmButton}
                    onClick={onConfirm}
                >
                    Delete ticket
                </button>
            </div>
        </dialog>
    )
}