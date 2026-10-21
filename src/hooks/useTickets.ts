import { useState, useEffect } from "react"
import { tickets as initialTickets } from "../data/tickets"
import type { Ticket, TicketStatus } from "../types/Ticket"

const STORAGE_KEY = "supportdesk:tickets"

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
        const storedTickets = localStorage.getItem(STORAGE_KEY)

        if (storedTickets === null) {
            return initialTickets
        }

        const parsedTickets: unknown = JSON.parse(storedTickets)

        if (Array.isArray(parsedTickets)) {
            return parsedTickets as Ticket[]
        }

        return initialTickets
    } catch {
        return initialTickets
    }
})

    useEffect(() => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
    } catch (error) {
        console.error("Failed to save tickets:", error)
    }
    }, [tickets])

    function createTicket(ticket: Ticket) {
        setTickets((currentTickets) => [
            ...currentTickets,
            ticket,
        ])
    }

    function changeTicketStatus(id: number, newStatus: TicketStatus) {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) => ticket.id === id ?
                { ...ticket, status: newStatus }
                : ticket
            ))
    }

    function deleteTicket(id: number) {
        setTickets((currentTickets) =>
            currentTickets.filter((ticket) => ticket.id !== id)
        )
    }

    function updateTicket(updatedTicket: Ticket) {
        setTickets((currentTickets) =>
            currentTickets.map((ticket) => ticket.id === updatedTicket.id ?
                updatedTicket
                : ticket
            ))
    }

    return {
        tickets,
        createTicket,
        changeTicketStatus,
        deleteTicket,
        updateTicket,
    }
}