import { useState } from "react"
import type { Ticket, TicketStatus } from "../types/Ticket"

type TicketListProps = {
    tickets: Ticket[]
}

function formatLabel(value: string) {
    return value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

type StatusFilter = TicketStatus | "all"



export default function TicketList({ tickets }: TicketListProps) {

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    const filteredTickets =
        statusFilter === "all"
            ? tickets
            : tickets.filter((ticket) => ticket.status === statusFilter)

    return (
        <section>
            <h2>Tickets</h2>
            <div>
                <label htmlFor="status-filter">Filter by Status:</label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>
            <ul className="ticket-list">
                {filteredTickets.map((ticket) => (
                    <li key={ticket.id} className="ticket-item">
                        <h3>{ticket.title}</h3>
                        <p className={`ticket-status ${ticket.status}`}>
                            Status: {formatLabel(ticket.status)}
                        </p>

                        <p className={`ticket-priority ${ticket.priority}`}>
                            Priority: {formatLabel(ticket.priority)}
                        </p>
                        <p>{ticket.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

