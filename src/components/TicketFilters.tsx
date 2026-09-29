import type { StatusFilter, PriorityFilter } from "../types/Ticket"

type TicketFiltersProps = {
    searchTerm: string
    statusFilter: StatusFilter
    priorityFilter: PriorityFilter
    onSearchChange: (value: string) => void
    onStatusChange: (value: StatusFilter) => void
    onPriorityChange: (value: PriorityFilter) => void
}

export default function TicketFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange
}: TicketFiltersProps) {
    return (
        <div className="ticket-filters">
        <input 
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
        />
        <div>
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
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
                onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
            >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            </select>
        </div>
        </div>
    )
}