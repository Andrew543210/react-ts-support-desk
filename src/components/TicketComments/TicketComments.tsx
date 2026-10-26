import { useId, useState } from "react"
import type { FormEvent } from "react"
import type { Ticket } from "../../types/Ticket"
import styles from "./TicketComments.module.css"

type TicketCommentsProps = {
    ticket: Ticket
    onAddComment: (ticketId: number, content: string) => boolean
}

export default function TicketComments({
    ticket,
    onAddComment,
}: TicketCommentsProps) {
    const [content, setContent] = useState("")
    const textareaId = useId()

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const trimmedContent = content.trim()

        if (!trimmedContent) return

        if (onAddComment(ticket.id, trimmedContent)) {
            setContent("")
        }
    }

    return (
        <section
            className={styles.section}
            aria-labelledby="ticket-comments-title"
        >
            <h2 id="ticket-comments-title" className={styles.title}>
                Comments ({ticket.comments.length})
            </h2>

            {ticket.comments.length === 0 ? (
                <p className={styles.emptyState}>
                    No comments yet.
                </p>
            ) : (
                <ul className={styles.list}>
                    {ticket.comments.map((comment) => (
                        <li key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                                <strong>{comment.author}</strong>

                                <time dateTime={comment.createdAt}>
                                    {new Intl.DateTimeFormat("en-US", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    }).format(new Date(comment.createdAt))}
                                </time>
                            </div>

                            <p className={styles.commentContent}>
                                {comment.content}
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <label htmlFor={textareaId}>
                    Add a comment
                </label>

                <textarea
                    id={textareaId}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows={4}
                    maxLength={1000}
                    required
                />

                <button
                    type="submit"
                    disabled={!content.trim()}
                >
                    Add comment
                </button>
            </form>
        </section>
    )
}