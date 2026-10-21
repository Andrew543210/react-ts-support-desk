import { useState } from "react"
import type {
    Ticket,
    StatusFilter,
    PriorityFilter,
} from "../types/Ticket"

export function useTicketFilters(tickets: Ticket[]) {
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all")

    const [priorityFilter, setPriorityFilter] =
        useState<PriorityFilter>("all")

    const [searchTerm, setSearchTerm] = useState("")

    const normalizedSearch = searchTerm.toLowerCase()

    const filteredTickets = tickets.filter((ticket) => {
        const matchesStatus =
            statusFilter === "all" || ticket.status === statusFilter

        const matchesPriority =
            priorityFilter === "all" || ticket.priority === priorityFilter

        const matchesSearch =
            ticket.title.toLowerCase().includes(normalizedSearch) ||
            ticket.description.toLowerCase().includes(normalizedSearch)

        return matchesStatus && matchesPriority && matchesSearch
    })

    function resetFilters() {
        setStatusFilter("all")
        setPriorityFilter("all")
        setSearchTerm("")
    }

    return {
        filteredTickets,
        statusFilter,
        priorityFilter,
        searchTerm,
        setStatusFilter,
        setPriorityFilter,
        setSearchTerm,
        resetFilters,
    }
}