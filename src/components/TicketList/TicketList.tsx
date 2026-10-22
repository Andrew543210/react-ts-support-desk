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
        sortedTickets,
        statusFilter,
        priorityFilter,
        categoryFilter,
        searchTerm,
        sortOrder,
        setSortOrder,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSearchTerm,
        resetFilters,
    } = useTicketFilters(tickets)


    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Tickets</h2>
            </div>
            <TicketFilters
                categoryFilter={categoryFilter}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
                onCategoryChange={setCategoryFilter}
            />
            {filteredTickets.length === 0 ?
                (
                    <p>No tickets found matching your filters.</p>
                )
                : (
                    <ul className={styles.list}>
                        {sortedTickets.map((ticket) => (
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
                    Showing {sortedTickets.length} of {tickets.length} tickets
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

