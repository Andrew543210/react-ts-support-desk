import { useState } from "react"
import type { Ticket, TicketStatus, TicketPriority } from "../types/Ticket"
import TicketCard from "./TicketCard"


type TicketListProps = {
    tickets: Ticket[],
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
    onEditTicket: (ticket: Ticket) => void
}

type StatusFilter = TicketStatus | "all"
type PriorityFilter = TicketPriority | "all"

export default function TicketList({ tickets, onStatusChange, onDeleteTicket, onEditTicket }: TicketListProps) {

    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")
    const [searchTerm, setSearchTerm] = useState("")

    const filteredTickets = tickets.filter((ticket) => {
        const matchesStatus =
            statusFilter === "all" || ticket.status === statusFilter

        const matchesPriority =
            priorityFilter === "all" || ticket.priority === priorityFilter

        const normalizedSearch = searchTerm.toLowerCase()

        const matchesSearch =
            ticket.title.toLowerCase().includes(normalizedSearch) ||
            ticket.description.toLowerCase().includes(normalizedSearch)

        return matchesStatus && matchesPriority && matchesSearch
    })

    return (
        <section>
            <h2>Tickets</h2>
            <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <div>
                <label htmlFor="priority-filter">Filter by Priority:</label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            {filteredTickets.length === 0 ?
                (
                    <p>No tickets found matching your filters.</p>
                )
                : (
                    <ul className="ticket-list">
                        {filteredTickets.map((ticket) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                onStatusChange={onStatusChange}
                                onDeleteTicket={onDeleteTicket}
                                onEditTicket={onEditTicket}
                            />
                        ))}
                    </ul>
                )}
            <p>
                Showing {filteredTickets.length} of {tickets.length} tickets
            </p>
            <button
                type="button"
                onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setPriorityFilter("all")
                }}
            >
                Reset filters
            </button>
        </section>
    )
}

