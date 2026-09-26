import type { Ticket, TicketStatus } from "../types/Ticket"

type TicketCardProps = {
    ticket: Ticket,
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
    onEditTicket: (ticket: Ticket) => void
}

function formatLabel(value: string) {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket, onEditTicket }: TicketCardProps) {
    return (
        <li className="ticket-item">
            <h3>{ticket.title}</h3>
            <p className={`ticket-status ${ticket.status}`}>
                Status: {formatLabel(ticket.status)}
            </p>

            <p className={`ticket-priority ${ticket.priority}`}>
                Priority: {formatLabel(ticket.priority)}
            </p>
            <p>{ticket.description}</p>
            <select
                value={ticket.status}
                onChange={(e) =>
                    onStatusChange(ticket.id, e.target.value as TicketStatus)
                }
            >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
            </select>
            <button
                type="button"
                onClick={() => onEditTicket(ticket)}
            >
                Edit
            </button>
            <button
                type="button"
                onClick={() => {
                    const isConfirmed = confirm(
                        "Are you sure you want to delete this ticket?"
                    )
                    if (isConfirmed) {
                        onDeleteTicket(ticket.id)
                    }
                }}
            >
                Delete
            </button>
        </li>
    )
}