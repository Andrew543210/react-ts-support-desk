import { useEffect, useState } from "react"
import styles from "./CreateTicketForm.module.css"
import type { FormEvent } from "react"
import type { Ticket, TicketPriority } from "../../types/Ticket"

type CreateTicketFormProps =
    | {
          mode: "create"
          onCreateTicket: (ticket: Ticket) => void
          editingTicket?: never
          onSaveTicket?: never
          onCancelEdit?: never
      }
    | {
          mode: "edit"
          editingTicket: Ticket
          onSaveTicket: (ticket: Ticket) => void
          onCancelEdit: () => void
          onCreateTicket?: never
      }

export default function CreateTicketForm(props: CreateTicketFormProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<TicketPriority>("medium")
    const [error, setError] = useState("")

    const isEditing = props.mode === "edit"
    const editingTicket = isEditing ? props.editingTicket : null

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

        if (props.mode === "edit") {
            const updatedTicket: Ticket = {
                ...props.editingTicket,
                title: title.trim(),
                description: description.trim(),
                priority,
            }

            props.onSaveTicket(updatedTicket)
        } else {
            const newTicket: Ticket = {
                id: Date.now(),
                title: title.trim(),
                description: description.trim(),
                status: "open",
                priority,
            }

            props.onCreateTicket(newTicket)
        }

        setTitle("")
        setDescription("")
        setPriority("medium")
    }

    return (
        <section className={styles.section}>
            <h2 className={styles.title}>{isEditing ? "Edit Ticket" : "Create Ticket"}</h2>

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
                    <button
                        type="submit"
                        className={styles.primaryButton}
                    >
                        {props.mode === "edit" ? "Update Ticket" : "Create Ticket"}
                    </button>

                    {props.mode === "edit" && (
                        <button
                            type="button"
                            onClick={props.onCancelEdit}
                            className={styles.secondaryButton}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}