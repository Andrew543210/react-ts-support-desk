import { useState } from "react"
import { tickets as initialTickets } from "../data/tickets"
import type { Ticket, TicketStatus } from "../types/Ticket"

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

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