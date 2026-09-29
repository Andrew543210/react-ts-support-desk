import styles from "./TicketCard.module.css"
import type { Ticket, TicketPriority, TicketStatus } from "../../types/Ticket"

type TicketCardProps = {
    ticket: Ticket,
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
    onEditTicket: (ticket: Ticket) => void
}

const statusClassMap: Record<TicketStatus, string> = {
    open: styles.open,
    "in-progress": styles.inProgress,
    resolved: styles.resolved,
}

const priorityClassMap: Record<TicketPriority, string> = {
    high: styles.high,
    medium: styles.medium,
    low: styles.low,
}

function formatLabel(value: string) {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket, onEditTicket }: TicketCardProps) {
    return (
        <li className={styles.card}>
            <h3 className={styles.title}>{ticket.title}</h3>
            <div className={styles.meta}>
                <p className={`${styles.status} ${statusClassMap[ticket.status]}`}>
                    Status: {formatLabel(ticket.status)}
                </p>
                <p className={`${styles.priority} ${priorityClassMap[ticket.priority]}`}>
                    Priority: {formatLabel(ticket.priority)}
                </p>
            </div>
            <p className={styles.description}>{ticket.description}</p>
            <div className={styles.actions}>
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
            </div>
        </li>
    )
}