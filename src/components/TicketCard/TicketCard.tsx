import { Link } from "react-router-dom"
import TicketBadge from "../TicketBadge/TicketBadge"
import styles from "./TicketCard.module.css"
import type { Ticket, TicketStatus } from "../../types/Ticket"

type TicketCardProps = {
    ticket: Ticket,
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
    onEditTicket: (ticket: Ticket) => void
}

export default function TicketCard({ ticket, onStatusChange, onDeleteTicket, onEditTicket }: TicketCardProps) {
    return (
        <li className={styles.card}>
            <h3 className={styles.title}>{ticket.title}</h3>
            <div className={styles.meta}>
                <div className={styles.metaGroup}>
                    <span>Status:</span>
                    <TicketBadge
                        kind="status"
                        value={ticket.status}
                    />
                </div>

                <div className={styles.metaGroup}>
                    <span>Priority:</span>
                    <TicketBadge
                        kind="priority"
                        value={ticket.priority}
                    />
                </div>
            </div>
            <p className={styles.description}>{ticket.description}</p>
            <div className={styles.actions}>
                <Link
                    to={`/tickets/${ticket.id}`}
                    className={styles.detailsLink}
                >
                    View Details
                </Link>
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