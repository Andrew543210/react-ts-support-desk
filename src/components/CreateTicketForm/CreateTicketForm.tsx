import { useEffect, useState } from "react"
import styles from "./CreateTicketForm.module.css"
import type { FormEvent } from "react"
import type { Ticket, TicketPriority } from "../../types/Ticket"

type CreateTicketFormProps = {
    onCreateTicket: (ticket: Ticket) => void
    onSaveTicket: (ticket: Ticket) => void
    editingTicket: Ticket | null
    onCancelEdit: () => void
}

export default function CreateTicketForm({
    onCreateTicket,
    onSaveTicket,
    editingTicket,
    onCancelEdit,
}: CreateTicketFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<TicketPriority>("medium")
    const [error, setError] = useState("")

    const isEditing = editingTicket !== null

    useEffect(() => {
        if (editingTicket) {
            setTitle(editingTicket.title)
            setDescription(editingTicket.description)
            setPriority(editingTicket.priority)
        } else {
            setTitle("")
            setDescription("")
            setPriority("medium")
        }
    }, [editingTicket])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.")
            return
        }

        setError("")

        if (editingTicket) {
            const updatedTicket: Ticket = {
                ...editingTicket,
                title: title.trim(),
                description: description.trim(),
                priority,
            }

            onSaveTicket(updatedTicket)
        } else {
            const newTicket: Ticket = {
                id: Date.now(),
                title: title.trim(),
                description: description.trim(),
                status: "open",
                priority,
            }

            onCreateTicket(newTicket)
        }

        setTitle("")
        setDescription("")
        setPriority("medium")
    }

    return (
        <section>
            <h2>{isEditing ? "Edit Ticket" : "Create Ticket"}</h2>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div className={styles.group}>
                    <label htmlFor="ticket-title">Title</label>
                    <input
                        type="text"
                        id="ticket-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="ticket-description">Description</label>
                    <textarea
                        id="ticket-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="ticket-priority">Priority</label>
                    <select
                        id="ticket-priority"
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value as TicketPriority)
                        }
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <div className={styles.actions}>
                    <button type="submit">
                        {isEditing ? "Update Ticket" : "Create Ticket"}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}