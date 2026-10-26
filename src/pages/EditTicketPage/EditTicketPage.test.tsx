import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import EditTicketPage from "./EditTicketPage"
import type { Ticket } from "../../types/Ticket"

vi.mock("../../components/TicketForm/TicketForm", () => ({
    default: ({
        editingTicket,
        onSaveTicket,
        onCancelEdit,
    }: {
        editingTicket: Ticket
        onSaveTicket: (ticket: Ticket) => boolean
        onCancelEdit: () => void
    }) => (
        <div>
            <p>Editing: {editingTicket.title}</p>
            <button
                type="button"
                onClick={() =>
                    onSaveTicket({
                        ...editingTicket,
                        title: "Updated ticket",
                    })
                }
            >
                Save test ticket
            </button>
            <button type="button" onClick={onCancelEdit}>
                Cancel test edit
            </button>
        </div>
    ),
}))

const ticket: Ticket = {
    id: 1,
    title: "Original ticket",
    description: "Original description",
    status: "open",
    priority: "medium",
    category: "technical",
    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

function renderEditPage(path: string, tickets: Ticket[], onSaveTicket = vi.fn(() => true)) {
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route
                    path="/tickets/:id/edit"
                    element={
                        <EditTicketPage
                            tickets={tickets}
                            onSaveTicket={onSaveTicket}
                        />
                    }
                />
                <Route
                    path="/tickets"
                    element={<h1>Tickets page reached</h1>}
                />
            </Routes>
        </MemoryRouter>,
    )

    return onSaveTicket
}

describe("EditTicketPage", () => {
    it("renders the form for an existing ticket", () => {
        renderEditPage("/tickets/1/edit", [ticket])

        expect(
            screen.getByRole("heading", { name: "Edit Ticket" }),
        ).toBeInTheDocument()
        expect(screen.getByText("Editing: Original ticket")).toBeInTheDocument()
    })

    it("shows a not-found message for an unknown ticket ID", () => {
        renderEditPage("/tickets/999/edit", [ticket])

        expect(
            screen.getByRole("heading", { name: "Ticket not found" }),
        ).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Save test ticket" }))
            .not.toBeInTheDocument()
    })

    it("saves the updated ticket and navigates to the tickets page", () => {
        const onSaveTicket = renderEditPage("/tickets/1/edit", [ticket])

        fireEvent.click(
            screen.getByRole("button", { name: "Save test ticket" }),
        )

        expect(onSaveTicket).toHaveBeenCalledWith({
            ...ticket,
            title: "Updated ticket",
        })
        expect(
            screen.getByRole("heading", { name: "Tickets page reached" }),
        ).toBeInTheDocument()
    })

    it("navigates to the tickets page when editing is cancelled", () => {
        renderEditPage("/tickets/1/edit", [ticket])

        fireEvent.click(
            screen.getByRole("button", { name: "Cancel test edit" }),
        )

        expect(
            screen.getByRole("heading", { name: "Tickets page reached" }),
        ).toBeInTheDocument()
    })
    
    it("stays on the edit page when saving fails", () => {
        const onSaveTicket = vi.fn(() => false)
        renderEditPage("/tickets/1/edit", [ticket], onSaveTicket)

        fireEvent.click(
            screen.getByRole("button", { name: "Save test ticket" }),
        )

        expect(onSaveTicket).toHaveBeenCalledExactlyOnceWith({
            ...ticket,
            title: "Updated ticket",
        })
        expect(
            screen.getByRole("heading", { name: "Edit Ticket" }),
        ).toBeInTheDocument()
        expect(screen.getByText("Editing: Original ticket")).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Tickets page reached" }),
        ).not.toBeInTheDocument()
    })
})
