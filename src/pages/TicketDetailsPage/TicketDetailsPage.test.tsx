import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import TicketDetailsPage from "./TicketDetailsPage"
import type { Ticket } from "../../types/Ticket"

const ticket: Ticket = {
    id: 7,
    title: "Cannot access account",
    description: "Login fails after entering credentials.",
    status: "open",
    priority: "high",
    category: "account",
    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

function renderDetails(path: string, tickets: Ticket[]) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route
                    path="/tickets/:id"
                    element={
                        <TicketDetailsPage
                            tickets={tickets}
                            onAddComment={vi.fn(() => true)}
                        />
                    }
                />
                <Route
                    path="/tickets/:id/edit"
                    element={<h1>Edit route reached</h1>}
                />
                <Route
                    path="/tickets"
                    element={<h1>Tickets route reached</h1>}
                />
            </Routes>
        </MemoryRouter>,
    )
}

describe("TicketDetailsPage", () => {
    it("renders the ticket information", () => {
        renderDetails("/tickets/7", [ticket])

        expect(
            screen.getByRole("heading", { name: "Cannot access account" }),
        ).toBeInTheDocument()
        expect(screen.getByText("Ticket #7")).toBeInTheDocument()
        expect(screen.getByText(ticket.description)).toBeInTheDocument()
        expect(screen.getByText("account")).toBeInTheDocument()
        expect(screen.getByText("Not updated yet")).toBeInTheDocument()
    })

    it("shows the fallback when the creation date is unknown", () => {
        renderDetails("/tickets/7", [{ ...ticket, createdAt: null }])

        expect(screen.getByText("Unknown")).toBeInTheDocument()
    })

    it("formats the creation date and last-updated date", () => {
        renderDetails("/tickets/7", [
            {
                ...ticket,
                updatedAt: "2026-10-12T14:30:00.000Z",
            },
        ])

        expect(screen.getByText("Oct 10, 2026, 1:00 PM")).toBeInTheDocument()
        expect(screen.getByText("Oct 12, 2026, 5:30 PM")).toBeInTheDocument()
    })

    it("provides links back to tickets and to editing", () => {
        renderDetails("/tickets/7", [ticket])

        expect(
            screen.getByRole("link", { name: "Back to Tickets" }),
        ).toHaveAttribute("href", "/tickets")

        expect(
            screen.getByRole("link", { name: "Edit Ticket" }),
        ).toHaveAttribute("href", "/tickets/7/edit")
    })

    it("shows a not-found message for an unknown ticket", () => {
        renderDetails("/tickets/999", [ticket])

        expect(
            screen.getByRole("heading", { name: "Ticket not found" }),
        ).toBeInTheDocument()

        expect(
            screen.getByText("The requested ticket does not exist."),
        ).toBeInTheDocument()
    })
})
