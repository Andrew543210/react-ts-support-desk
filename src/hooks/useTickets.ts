import { useState, useEffect, useRef } from "react"
import { tickets as initialTickets } from "../data/tickets"
import type { Ticket, TicketStatus, TicketCategory, CreateTicketInput, TicketComment } from "../types/Ticket"

const STORAGE_KEY = "supportdesk:tickets"
const NEXT_ID_STORAGE_KEY = "supportdesk:nextTicketId"

function getNextTicketId(tickets: Ticket[]): number {
    const highestId = tickets.reduce(
        (max, ticket) => Math.max(max, ticket.id),
        0
    )

    try {
        const storedValue = localStorage.getItem(NEXT_ID_STORAGE_KEY)
        const storedNextId = storedValue === null ? 0 : Number(storedValue)

        return Math.max(
            highestId + 1,
            Number.isSafeInteger(storedNextId) && storedNextId > 0
                ? storedNextId
                : 1
        )
    } catch {
        return highestId + 1
    }
}

function isTicketCategory(value: unknown): value is TicketCategory {
    return (
        value === "technical" ||
        value === "billing" ||
        value === "account" ||
        value === "general"
    )
}

type StoredTicket = Omit<Ticket, "category" | "createdAt" | "updatedAt" | "comments"> & {
    category?: unknown
    createdAt?: unknown
    updatedAt?: unknown
    comments?: unknown
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

function isStoredComment(value: unknown): value is TicketComment {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        return false
    }

    const comment = value as Record<string, unknown>

    return (
        typeof comment.id === "string" &&
        typeof comment.author === "string" &&
        typeof comment.content === "string" &&
        normalizeStoredDate(comment.createdAt) !== null
    )
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

                const seenIds = new Set<number>()

                const uniqueTickets = validTickets.filter((ticket) => {
                    if (seenIds.has(ticket.id)) {
                        return false
                    }

                    seenIds.add(ticket.id)
                    return true
                })

                return uniqueTickets.map((ticket) => {
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
                        comments: Array.isArray(ticket.comments)
                            ? ticket.comments.filter(isStoredComment)
                            : [],
                    }
                })
            }

            return initialTickets
        } catch {
            return initialTickets
        }
    })

    const ticketsRef = useRef(tickets)
    const nextTicketId = useRef(getNextTicketId(tickets))

    useEffect(() => {
    try {
        localStorage.setItem(
            NEXT_ID_STORAGE_KEY,
            String(nextTicketId.current)
        )

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(ticketsRef.current)
        )
    } catch (error) {
        console.error("Failed to save tickets:", error)
    }
    }, [])

    function persistTickets(
        nextTickets: Ticket[],
        nextId = nextTicketId.current
    ): boolean {
        try {
            localStorage.setItem(
                NEXT_ID_STORAGE_KEY,
                String(nextId)
            )

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(nextTickets)
            )
        } catch (error) {
            console.error("Failed to save tickets:", error)
            return false
        }

        ticketsRef.current = nextTickets
        nextTicketId.current = nextId

        setTickets(nextTickets)

        return true
    }

    function createTicket(input: CreateTicketInput): boolean {
        const now = new Date().toISOString()
        const id = nextTicketId.current

        if (!Number.isSafeInteger(id + 1)) {
            return false
        }

        const newTicket: Ticket = {
            id,
            title: input.title,
            description: input.description,
            priority: input.priority,
            category: input.category,
            status: "open",
            createdAt: now,
            updatedAt: null,
            comments: [],
        }

        return persistTickets(
            [...ticketsRef.current, newTicket],
            id + 1
        )
    }

    function addTicketComment(
        ticketId: number,
        content: string
    ): boolean {
        const trimmedContent = content.trim()

        if (
            !trimmedContent ||
            !ticketsRef.current.some((ticket) => ticket.id === ticketId)
        ) {
            return false
        }

        const newComment: TicketComment = {
            id: crypto.randomUUID(),
            author: "Support Agent",
            content: trimmedContent,
            createdAt: new Date().toISOString(),
        }

        const nextTickets = ticketsRef.current.map((ticket) =>
            ticket.id === ticketId
                ? {
                    ...ticket,
                    comments: [...ticket.comments, newComment],
                    updatedAt: newComment.createdAt,
                }
                : ticket
        )

        return persistTickets(nextTickets)
    }

    function changeTicketStatus(
        id: number,
        newStatus: TicketStatus
    ): boolean {
        const target = ticketsRef.current.find(
            (ticket) => ticket.id === id
        )

        if (!target) {
            return false
        }

        if (target.status === newStatus) {
            return true
        }

        const now = new Date().toISOString()

        const nextTickets = ticketsRef.current.map((ticket) =>
            ticket.id === id
                ? {
                    ...ticket,
                    status: newStatus,
                    updatedAt: now,
                }
                : ticket
        )

        return persistTickets(nextTickets)
    }

    function deleteTicket(id: number): boolean {
        if (!ticketsRef.current.some((ticket) => ticket.id === id)) {
            return false
        }

        const nextTickets = ticketsRef.current.filter(
            (ticket) => ticket.id !== id
        )

        return persistTickets(nextTickets)
    }

    function updateTicket(updatedTicket: Ticket): boolean {
        if (
            !ticketsRef.current.some(
                (ticket) => ticket.id === updatedTicket.id
            )
        ) {
            return false
        }

        const now = new Date().toISOString()

        const nextTickets = ticketsRef.current.map((ticket) =>
            ticket.id === updatedTicket.id
                ? {
                    ...updatedTicket,
                    createdAt: ticket.createdAt ?? null,
                    updatedAt: now,
                }
                : ticket
        )

        return persistTickets(nextTickets)
    }

    return {
        tickets,
        createTicket,
        changeTicketStatus,
        deleteTicket,
        updateTicket,
        addTicketComment,
    }
}