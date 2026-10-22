import styles from "./TicketFilters.module.css"
import type { StatusFilter, PriorityFilter, CategoryFilter, TicketSort } from "../../types/Ticket"

type TicketFiltersProps = {
    searchTerm: string
    statusFilter: StatusFilter
    priorityFilter: PriorityFilter
    categoryFilter: CategoryFilter
    onCategoryChange: (value: CategoryFilter) => void
    onSearchChange: (value: string) => void
    onStatusChange: (value: StatusFilter) => void
    onPriorityChange: (value: PriorityFilter) => void
    sortOrder: TicketSort
    onSortChange: (value: TicketSort) => void
}

export default function TicketFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    priorityFilter,
    onPriorityChange,
    categoryFilter,
    onCategoryChange,
    sortOrder,
    onSortChange,
}: TicketFiltersProps) {
    return (
        <div className={styles.filters}>
            <div className={styles.group}>
                <label htmlFor="search-filter">Search:</label>
                <input
                    type="text"
                    id="search-filter"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className={styles.group}>
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
            <div className={styles.group}>
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
            <div className={styles.group}>
                <label htmlFor="category-filter">Filter by Category:</label>
                <select
                    id="category-filter"
                    value={categoryFilter}
                    onChange={(e) =>onCategoryChange(e.target.value as CategoryFilter)}
                >
                    <option value="all">All Categories</option>
                    <option value="technical">Technical</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="general">General</option>
                </select>
            </div>
            <div className={styles.group}>
                <label htmlFor="sort-order">Sort by:</label>
                <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value as TicketSort)}
                >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="priority-high">Highest priority</option>
                    <option value="priority-low">Lowest priority</option>
                </select>
            </div>
        </div>
    )
}