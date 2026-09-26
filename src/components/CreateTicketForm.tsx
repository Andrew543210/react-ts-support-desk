import { useState } from "react"
import type { FormEvent } from "react"
import type { TicketPriority, Ticket } from "../types/Ticket"

type CreateTicketFormProps = {
    onCreateTicket: (ticket: Ticket) => void
}

export default function CreateTicketForm({ onCreateTicket }: CreateTicketFormProps) {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState<TicketPriority>("medium")
    const [error, setError] = useState("")


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            setError("Title and description are required.")
            return
        }

        setError("")

        const newTicket: Ticket = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            status: "open",
            priority,
        }

        onCreateTicket(newTicket)

        setTitle("")
        setDescription("")
        setPriority("medium")
    }
    return (
        <section>
            <h2>Create Ticket</h2>
            <form
                onSubmit={handleSubmit}
            >
                <label htmlFor="ticket-title">Title</label>
                <input
                    type="text"
                    id="ticket-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="ticket-description">Description</label>
                <textarea
                    id="ticket-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="ticket-priority">Priority</label>
                <select
                    id="ticket-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                {error && <p>{error}</p>}
                <button type="submit">Create Ticket</button>
            </form>
        </section>
    )
}