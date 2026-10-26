import { useState, useId } from "react"
import styles from "./TicketForm.module.css"
import type { FormEvent } from "react"
import type { Ticket, TicketPriority, TicketCategory, CreateTicketInput } from "../../types/Ticket"

type TicketFormProps =
    | {
          mode: "create"
          onCreateTicket: (input: CreateTicketInput) => boolean
          editingTicket?: never
          onSaveTicket?: never
          onCancelEdit?: never
      }
    | {
          mode: "edit"
          editingTicket: Ticket
          onSaveTicket: (ticket: Ticket) => boolean
          onCancelEdit: () => void
          onCreateTicket?: never
      }

export default function TicketForm(props: TicketFormProps) {
    const [title, setTitle] = useState(
        props.mode === "edit" ? props.editingTicket.title : ""
    )

    const [description, setDescription] = useState(
        props.mode === "edit" ? props.editingTicket.description : ""
    )

    const [priority, setPriority] = useState<TicketPriority>(
        props.mode === "edit" ? props.editingTicket.priority : "medium"
    )

    const [category, setCategory] = useState<TicketCategory>(
        props.mode === "edit" ? props.editingTicket.category : "general"
    )

    const [error, setError] = useState("")
    const validationErrorId = useId()
    const titleInvalid = Boolean(error) && !title.trim()
    const descriptionInvalid = Boolean(error) && !description.trim()

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
                category,
            }

           if (!props.onSaveTicket(updatedTicket)) {
                return
            }
        } else {
            const newTicket: CreateTicketInput = {
                title: title.trim(),
                description: description.trim(),
                priority,
                category,
            }

           if (!props.onCreateTicket(newTicket)) {
                return
            }
        }

        setTitle("")
        setDescription("")
        setPriority("medium")
        setCategory("general")
    }

    return (
        <section className={styles.section}>
            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div className={styles.group}>
                    <label htmlFor="ticket-title">Title</label>
                    <input
                        type="text"
                        id="ticket-title"
                        aria-required="true"
                        aria-invalid={titleInvalid}
                        aria-describedby={
                            titleInvalid ? validationErrorId : undefined
                        }
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className={styles.group}>
                    <label htmlFor="ticket-description">Description</label>
                    <textarea
                        id="ticket-description"
                        aria-required="true"
                        aria-invalid={descriptionInvalid}
                        aria-describedby={
                            descriptionInvalid ? validationErrorId : undefined
                        }
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

                <div className={styles.group}>
                    <label htmlFor="ticket-category">Category</label>
                    <select
                        id="ticket-category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value as TicketCategory)
                        }
                    >
                        <option value="general">General</option>
                        <option value="technical">Technical</option>
                        <option value="billing">Billing</option>
                        <option value="account">Account</option>
                    </select>
                </div>

                {error && (
                    <p
                        id={validationErrorId}
                        className={styles.error}
                        role="alert"
                    >
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