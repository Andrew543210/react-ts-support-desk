import styles from "./TicketList.module.css"
import type { Ticket, TicketStatus } from "../../types/Ticket"
import TicketCard from "../TicketCard/TicketCard"
import TicketFilters from "../TicketFilters/TicketFilters"
import { useTicketFilters } from "../../hooks/useTicketFilters"

type TicketListProps = {
    tickets: Ticket[]
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
    onEditTicket: (ticket: Ticket) => void
}

export default function TicketList({ tickets, onStatusChange, onDeleteTicket, onEditTicket }: TicketListProps) {

    const {
        filteredTickets,
        statusFilter,
        priorityFilter,
        searchTerm,
        setStatusFilter,
        setPriorityFilter,
        setSearchTerm,
        resetFilters,
    } = useTicketFilters(tickets)


    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tickets</h2>
            </div>
            <TicketFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
            />
            {filteredTickets.length === 0 ?
                (
                    <p>No tickets found matching your filters.</p>
                )
                : (
                    <ul className={styles.list}>
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
            <div className={styles.footer}>
                <p className={styles.count}>
                    Showing {filteredTickets.length} of {tickets.length} tickets
                </p>
                <button
                    type="button"
                    className={styles.resetButton}
                    onClick={resetFilters}
                >
                    Reset filters
                </button>
            </div>
        </section>
    )
}

