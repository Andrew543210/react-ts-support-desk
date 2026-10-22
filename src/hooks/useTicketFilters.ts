import { useState } from "react"
import type {
    Ticket,
    StatusFilter,
    PriorityFilter,
    CategoryFilter,
    TicketSort
} from "../types/Ticket"

export function useTicketFilters(tickets: Ticket[]) {
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all")

    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>("all")

    const [categoryFilter, setCategoryFilter] =
       useState<CategoryFilter>("all")

    const [searchTerm, setSearchTerm] = useState("")

    const [sortOrder, setSortOrder] = useState<TicketSort>("newest")

    const normalizedSearch = searchTerm.toLowerCase()

    const filteredTickets = tickets.filter((ticket) => {
        const matchesStatus =
            statusFilter === "all" || ticket.status === statusFilter

        const matchesPriority =
            priorityFilter === "all" || ticket.priority === priorityFilter

        const matchesCategory =
            categoryFilter === "all" ||
            ticket.category === categoryFilter
            
        const matchesSearch =
            ticket.title.toLowerCase().includes(normalizedSearch) ||
            ticket.description.toLowerCase().includes(normalizedSearch)

        return matchesStatus && matchesPriority && matchesCategory && matchesSearch
    })

    const sortedTickets = [...filteredTickets].sort((a, b) => {
        if (a.createdAt === null && b.createdAt === null) return 0
        if (a.createdAt === null) return 1
        if (b.createdAt === null) return -1

        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()

        return sortOrder === "newest"
            ? dateB - dateA
            : dateA - dateB
    })

    function resetFilters() {
        setStatusFilter("all")
        setPriorityFilter("all")
        setCategoryFilter("all")
        setSearchTerm("")
        setSortOrder("newest")
    }

    return {
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
    }
}