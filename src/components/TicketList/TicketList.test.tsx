
import { MemoryRouter } from "react-router-dom"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import TicketList from "./TicketList"
import type { Ticket } from "../../types/Ticket"

const makeTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
    id: 1,
    title: "Login problem",
    description: "Cannot log in",
    status: "open",
    priority: "medium",
    category: "technical",
    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: null,
    comments: [],
    ...overrides,
})

const tickets: Ticket[] = [
    makeTicket({
        id: 1,
        title: "Login problem",
        status: "open",
        priority: "high",
        category: "technical",
        createdAt: "2026-10-10T10:00:00.000Z",
    }),
    makeTicket({
        id: 2,
        title: "Payment issue",
        status: "in-progress",
        priority: "medium",
        category: "billing",
        createdAt: "2026-10-12T10:00:00.000Z",
    }),
    makeTicket({
        id: 3,
        title: "Account access",
        status: "resolved",
        priority: "low",
        category: "account",
        createdAt: "2026-10-11T10:00:00.000Z",
    }),
]

function renderTicketList(items: Ticket[] = tickets) {
    const onStatusChange = vi.fn()
    const onDeleteTicket = vi.fn()
    const onEditTicket = vi.fn()

    render(
        <MemoryRouter>
            <TicketList
                tickets={items}
                onStatusChange={onStatusChange}
                onDeleteTicket={onDeleteTicket}
                onEditTicket={onEditTicket}
            />
        </MemoryRouter>,
    )

    return { onStatusChange, onDeleteTicket, onEditTicket }
}

describe("TicketList", () => {
    it("renders the heading and all tickets", () => {
        renderTicketList()

        expect(
            screen.getByRole("heading", { name: "Tickets" }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole("heading", { name: "Login problem" }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole("heading", { name: "Payment issue" }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole("heading", { name: "Account access" }),
        ).toBeInTheDocument()
    })

    it("shows the correct ticket count", () => {
        renderTicketList()

        expect(screen.getByText("Showing 3 of 3 tickets")).toBeInTheDocument()
    })

    it("shows an empty-state message when there are no tickets", () => {
        renderTicketList([])

        expect(
            screen.getByText("No tickets found matching your filters."),
        ).toBeInTheDocument()
        expect(screen.getByText("Showing 0 of 0 tickets")).toBeInTheDocument()
        expect(screen.queryByRole("list")).not.toBeInTheDocument()
    })

    it("filters tickets by search term", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("textbox", { name: "Search:" }), {
            target: { value: "payment" },
        })

        expect(
            screen.getByRole("heading", { name: "Payment issue" }),
        ).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Login problem" }),
        ).not.toBeInTheDocument()
        expect(screen.getByText("Showing 1 of 3 tickets")).toBeInTheDocument()
    })

    it("shows the empty state when filters match no tickets", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("textbox", { name: "Search:" }), {
            target: { value: "nonexistent ticket" },
        })

        expect(
            screen.getByText("No tickets found matching your filters."),
        ).toBeInTheDocument()
        expect(screen.getByText("Showing 0 of 3 tickets")).toBeInTheDocument()
    })

    it("filters tickets by status", () => {
        renderTicketList()

        fireEvent.change(
            screen.getByRole("combobox", { name: "Filter by Status:" }),
            { target: { value: "in-progress" } },
        )

        expect(
            screen.getByRole("heading", { name: "Payment issue" }),
        ).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Login problem" }),
        ).not.toBeInTheDocument()
        expect(screen.getByText("Showing 1 of 3 tickets")).toBeInTheDocument()
    })

    it("filters tickets by priority", () => {
        renderTicketList()

        fireEvent.change(
            screen.getByRole("combobox", { name: "Filter by Priority:" }),
            { target: { value: "high" } },
        )

        expect(
            screen.getByRole("heading", { name: "Login problem" }),
        ).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Payment issue" }),
        ).not.toBeInTheDocument()
        expect(screen.getByText("Showing 1 of 3 tickets")).toBeInTheDocument()
    })

    it("filters tickets by category", () => {
        renderTicketList()

        fireEvent.change(
            screen.getByRole("combobox", { name: "Filter by Category:" }),
            { target: { value: "billing" } },
        )

        expect(
            screen.getByRole("heading", { name: "Payment issue" }),
        ).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Account access" }),
        ).not.toBeInTheDocument()
    })

    it("sorts tickets by newest first by default", () => {
        renderTicketList()

        const headings = within(screen.getByRole("list"))
            .getAllByRole("heading", { level: 3 })

        expect(headings.map((heading) => heading.textContent)).toEqual([
            "Payment issue",
            "Account access",
            "Login problem",
        ])
    })

    it("sorts tickets by oldest first", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("combobox", { name: "Sort by:" }), {
            target: { value: "oldest" },
        })

        const headings = within(screen.getByRole("list"))
            .getAllByRole("heading", { level: 3 })

        expect(headings.map((heading) => heading.textContent)).toEqual([
            "Login problem",
            "Account access",
            "Payment issue",
        ])
    })

    it("sorts tickets by highest priority", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("combobox", { name: "Sort by:" }), {
            target: { value: "priority-high" },
        })

        const headings = within(screen.getByRole("list"))
            .getAllByRole("heading", { level: 3 })

        expect(headings.map((heading) => heading.textContent)).toEqual([
            "Login problem",
            "Payment issue",
            "Account access",
        ])
    })

    it("sorts tickets by lowest priority", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("combobox", { name: "Sort by:" }), {
            target: { value: "priority-low" },
        })

        const headings = within(screen.getByRole("list"))
            .getAllByRole("heading", { level: 3 })

        expect(headings.map((heading) => heading.textContent)).toEqual([
            "Account access",
            "Payment issue",
            "Login problem",
        ])
    })

    it("resets search and filters when Reset filters is clicked", () => {
        renderTicketList()

        fireEvent.change(screen.getByRole("textbox", { name: "Search:" }), {
            target: { value: "payment" },
        })
        fireEvent.change(
            screen.getByRole("combobox", { name: "Filter by Status:" }),
            { target: { value: "in-progress" } },
        )

        fireEvent.click(screen.getByRole("button", { name: "Reset filters" }))

        expect(screen.getByRole("textbox", { name: "Search:" })).toHaveValue("")
        expect(
            screen.getByRole("combobox", { name: "Filter by Status:" }),
        ).toHaveValue("all")
        expect(
            screen.getByRole("combobox", { name: "Filter by Priority:" }),
        ).toHaveValue("all")
        expect(
            screen.getByRole("combobox", { name: "Filter by Category:" }),
        ).toHaveValue("all")
        expect(screen.getByRole("combobox", { name: "Sort by:" })).toHaveValue(
            "newest",
        )
        expect(screen.getByText("Showing 3 of 3 tickets")).toBeInTheDocument()
    })

    it("passes status changes from a ticket card to the parent callback", () => {
        const { onStatusChange } = renderTicketList()

        const card = screen
            .getByRole("heading", { name: "Login problem" })
            .closest("li")

        expect(card).not.toBeNull()

        fireEvent.change(within(card as HTMLElement).getByRole("combobox"), {
            target: { value: "resolved" },
        })

        expect(onStatusChange).toHaveBeenCalledExactlyOnceWith(1, "resolved")
    })

    it("passes edit actions from a ticket card to the parent callback", () => {
        const { onEditTicket } = renderTicketList()

        const card = screen
            .getByRole("heading", { name: "Payment issue" })
            .closest("li")

        expect(card).not.toBeNull()

        fireEvent.click(
            within(card as HTMLElement).getByRole("button", { name: "Edit" }),
        )

        expect(onEditTicket).toHaveBeenCalledExactlyOnceWith(tickets[1])
    })

    it("passes confirmed delete actions from a ticket card to the parent callback", () => {
        const { onDeleteTicket } = renderTicketList()

        const card = screen
            .getByRole("heading", { name: "Account access" })
            .closest("li")

        expect(card).not.toBeNull()

        fireEvent.click(
            within(card as HTMLElement).getByRole("button", { name: "Delete" }),
        )

        const dialog = screen.getByRole("dialog")

        fireEvent.click(
            within(dialog).getByRole("button", { name: "Delete ticket" }),
        )

        expect(onDeleteTicket).toHaveBeenCalledExactlyOnceWith(3)
    })
})
