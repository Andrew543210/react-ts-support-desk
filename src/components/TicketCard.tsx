import type { Ticket } from "../types/Ticket"

type TicketCardProps = {
    ticket: Ticket
}

function formatLabel(value: string) {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export default function TicketCard({ ticket }: TicketCardProps) {
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
        </li>
    )
}