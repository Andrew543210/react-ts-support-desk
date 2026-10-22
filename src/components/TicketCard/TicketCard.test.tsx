import { render, screen, fireEvent, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import TicketCard from "./TicketCard"
import type { Ticket } from "../../types/Ticket"

const ticket: Ticket = {
    id: 42,
    title: "Cannot log in",
    description: "The login page rejects my credentials.",
    status: "open",
    priority: "high",
    category: "technical",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

function renderTicketCard() {
    const onStatusChange = vi.fn()
    const onDeleteTicket = vi.fn()
    const onEditTicket = vi.fn()

    render(
        <MemoryRouter>
            <TicketCard
                ticket={ticket}
                onStatusChange={onStatusChange}
                onDeleteTicket={onDeleteTicket}
                onEditTicket={onEditTicket}
            />
        </MemoryRouter>,
    )

    return { onStatusChange, onDeleteTicket, onEditTicket }
}

describe("TicketCard", () => {
    it("displays the ticket title, description, status and priority", () => {
        renderTicketCard()

        expect(
            screen.getByRole("heading", { name: "Cannot log in" }),
        ).toBeInTheDocument()
        expect(
            screen.getByText("The login page rejects my credentials."),
        ).toBeInTheDocument()
        expect(
            screen.getByText("Open", { selector: "span" }),
        ).toBeInTheDocument()
        expect(screen.getByText("High")).toBeInTheDocument()
    })

    it("links to the ticket details page", () => {
        renderTicketCard()

        expect(
            screen.getByRole("link", { name: "View Details" }),
        ).toHaveAttribute("href", "/tickets/42")
    })

    it("shows the current status in the select", () => {
        renderTicketCard()

        expect(screen.getByRole("combobox")).toHaveValue("open")
    })

    it.each([
        ["in-progress", "In Progress"],
        ["resolved", "Resolved"],
        ["open", "Open"],
    ] as const)(
        "calls onStatusChange when the status is changed to %s",
        (status, label) => {
            const { onStatusChange } = renderTicketCard()

            fireEvent.change(screen.getByRole("combobox"), {
                target: { value: status },
            })

            expect(onStatusChange).toHaveBeenCalledExactlyOnceWith(
                ticket.id,
                status,
            )
            expect(
                screen.getByRole("option", { name: label }),
            ).toBeInTheDocument()
        },
    )

    it("calls onEditTicket with the current ticket", () => {
        const { onEditTicket } = renderTicketCard()

        fireEvent.click(screen.getByRole("button", { name: "Edit" }))

        expect(onEditTicket).toHaveBeenCalledExactlyOnceWith(ticket)
    })

    it("does not show the confirmation dialog initially", () => {
        renderTicketCard()

        expect(
            screen.queryByRole("heading", { name: "Delete ticket?" }),
        ).not.toBeInTheDocument()
    })

    it("opens the confirmation dialog when Delete is clicked", () => {
        renderTicketCard()

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        expect(
            screen.getByRole("heading", { name: "Delete ticket?" }),
        ).toBeInTheDocument()
        expect(
            screen.getByText(
                'Are you sure you want to delete "Cannot log in"? This action cannot be undone.',
            ),
        ).toBeInTheDocument()
    })

    it("does not delete the ticket when deletion is cancelled", () => {
        const { onDeleteTicket } = renderTicketCard()

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onDeleteTicket).not.toHaveBeenCalled()
        expect(
            screen.queryByRole("heading", { name: "Delete ticket?" }),
        ).not.toBeInTheDocument()
    })

    it("deletes the ticket when deletion is confirmed", () => {
        const { onDeleteTicket } = renderTicketCard()

        fireEvent.click(screen.getByRole("button", { name: "Delete" }))

        const dialog = screen.getByRole("dialog")
        fireEvent.click(
            within(dialog).getByRole("button", { name: "Delete ticket" }),
        )

        expect(onDeleteTicket).toHaveBeenCalledExactlyOnceWith(ticket.id)
        expect(
            screen.queryByRole("heading", { name: "Delete ticket?" }),
        ).not.toBeInTheDocument()
    })
})
