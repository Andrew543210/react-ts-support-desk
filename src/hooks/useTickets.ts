import { useState, useEffect } from "react"
import { tickets as initialTickets } from "../data/tickets"
import type { Ticket, TicketStatus, TicketCategory, CreateTicketInput } from "../types/Ticket"

const STORAGE_KEY = "supportdesk:tickets"

function isTicketCategory(value: unknown): value is TicketCategory {
    return (
        value === "technical" ||
        value === "billing" ||
        value === "account" ||
        value === "general"
    )
}

type StoredTicket = Omit<Ticket, "category" | "createdAt" | "updatedAt"> & {
    category?: unknown
    createdAt?: unknown
    updatedAt?: unknown
}

function normalizeStoredDate(value: unknown): string | null {
    if (typeof value !== "string") {
        return null
    }

    const timestamp = Date.parse(value)

    if (Number.isNaN(timestamp)) {
        return null
    }

    return new Date(timestamp).toISOString()
}

function isStoredTicket(value: unknown): value is StoredTicket {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false
    }

    const ticket = value as Record<string, unknown>

    return (
        typeof ticket.id === "number" &&
        Number.isSafeInteger(ticket.id) &&
        ticket.id > 0 &&
        typeof ticket.title === "string" &&
        typeof ticket.description === "string" &&
        (
            ticket.status === "open" ||
            ticket.status === "in-progress" ||
            ticket.status === "resolved"
        ) &&
        (
            ticket.priority === "low" ||
            ticket.priority === "medium" ||
            ticket.priority === "high"
        )
    )
}

export function useTickets() {
    const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
        const storedTickets = localStorage.getItem(STORAGE_KEY)

        if (storedTickets === null) {
            return initialTickets
        }

        const parsedTickets: unknown = JSON.parse(storedTickets)

       if (Array.isArray(parsedTickets)) {
        const validTickets = parsedTickets.filter(isStoredTicket)

        return validTickets.map((ticket) => {
            const demoTicket = initialTickets.find(
            (initialTicket) => initialTicket.id === ticket.id
            )

            return {
                ...ticket,
                category: isTicketCategory(ticket.category)
                    ? ticket.category
                    : "general",
                createdAt:
                    normalizeStoredDate(ticket.createdAt) ??
                    demoTicket?.createdAt ??
                    null,
                updatedAt: normalizeStoredDate(ticket.updatedAt),
            }
        })
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

    function createTicket(input: CreateTicketInput) {
        const now = new Date().toISOString()

        setTickets((currentTickets) => {
            const nextId =
                Math.max(0, ...currentTickets.map((ticket) => ticket.id)) + 1

            const newTicket: Ticket = {
                id: nextId,
                title: input.title,
                description: input.description,
                priority: input.priority,
                category: input.category,
                status: "open",
                createdAt: now,
                updatedAt: null,
            }

            return [...currentTickets, newTicket]
        })
    }

    function changeTicketStatus(id: number, newStatus: TicketStatus) {
        const now = new Date().toISOString()

        setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === id && ticket.status !== newStatus
                    ? {
                        ...ticket,
                        status: newStatus,
                        updatedAt: now,
                    }
                : ticket
            )
        )
    }

    function deleteTicket(id: number) {
        setTickets((currentTickets) =>
            currentTickets.filter((ticket) => ticket.id !== id)
        )
    }

    function updateTicket(updatedTicket: Ticket) {
        const now = new Date().toISOString()

        setTickets((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === updatedTicket.id
                    ? {
                        ...updatedTicket,
                        createdAt: ticket.createdAt ?? null,
                        updatedAt: now,
                    }
                : ticket
            )
        )
    }

    return {
        tickets,
        createTicket,
        changeTicketStatus,
        deleteTicket,
        updateTicket,
    }
}