import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useTicketFilters } from "./useTicketFilters"
import type { Ticket } from "../types/Ticket"

const tickets: Ticket[] = [
    {
        id: 1,
        title: "Login error",
        description: "Cannot log in",
        status: "open",
        priority: "high",
        category: "technical",
        createdAt: "2026-09-26T09:00:00.000Z",
        updatedAt: null,
        comments: [],
    },
    {
        id: 2,
        title: "Billing issue",
        description: "Payment failed",
        status: "resolved",
        priority: "low",
        category: "billing",
        createdAt: "2026-10-21T09:00:00.000Z",
        updatedAt: null,
        comments: [],
    },
    {
        id: 3,
        title: "Email change",
        description: "Update account",
        status: "open",
        priority: "medium",
        category: "account",
        createdAt: null,
        updatedAt: null,
        comments: [],
    },
]

describe("useTicketFilters", () => {
    it("combines filters and resets them", () => {
        const { result } = renderHook(() =>
            useTicketFilters(tickets)
        )

        act(() => {
            result.current.setStatusFilter("open")
            result.current.setPriorityFilter("high")
            result.current.setCategoryFilter("technical")
            result.current.setSearchTerm("login")
        })

        expect(
            result.current.filteredTickets.map((ticket) => ticket.id)
        ).toEqual([1])

        act(() => {
            result.current.resetFilters()
        })

        expect(result.current.filteredTickets).toHaveLength(3)
        expect(result.current.sortOrder).toBe("newest")
    })

    it("sorts by date and priority", () => {
        const { result } = renderHook(() =>
            useTicketFilters(tickets)
        )

        expect(
            result.current.sortedTickets.map((ticket) => ticket.id)
        ).toEqual([2, 1, 3])

        act(() => {
            result.current.setSortOrder("oldest")
        })

        expect(
            result.current.sortedTickets.map((ticket) => ticket.id)
        ).toEqual([1, 2, 3])

        act(() => {
            result.current.setSortOrder("priority-high")
        })

        expect(
            result.current.sortedTickets.map((ticket) => ticket.id)
        ).toEqual([1, 3, 2])
    })
})