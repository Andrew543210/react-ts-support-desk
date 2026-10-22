import { useState } from "react"
import type {
    Ticket,
    StatusFilter,
    PriorityFilter,
    CategoryFilter
} from "../types/Ticket"

export function useTicketFilters(tickets: Ticket[]) {
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all")

    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>("all")

    const [categoryFilter, setCategoryFilter] =
       useState<CategoryFilter>("all")

    const [searchTerm, setSearchTerm] = useState("")

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

    function resetFilters() {
        setStatusFilter("all")
        setPriorityFilter("all")
        setCategoryFilter("all")
        setSearchTerm("")
    }

    return {
        filteredTickets,
        statusFilter,
        priorityFilter,
        categoryFilter,
        searchTerm,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        setSearchTerm,
        resetFilters,
    }
}