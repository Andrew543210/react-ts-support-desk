import type { FallbackProps } from "react-error-boundary"
import styles from "./ErrorFallback.module.css"

export default function ErrorFallback({
    resetErrorBoundary,
}: FallbackProps) {
    return (
        <main className={styles.page}>
            <section className={styles.card} role="alert">
                <h1 className={styles.title}>
                    Something went wrong
                </h1>

                <p className={styles.description}>
                    An unexpected error occurred.
                    Please try again.
                </p>

                <button
                    type="button"
                    className={styles.button}
                    onClick={() => resetErrorBoundary()}
                >
                    Try again
                </button>
            </section>
        </main>
    )
}