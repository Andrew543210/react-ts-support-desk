import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import TicketsPage from "./TicketsPage"
import type { Ticket } from "../../types/Ticket"

const ticket: Ticket = {
    id: 1,
    title: "Login problem",
    description: "Cannot log in",
    status: "open",
    priority: "high",
    category: "technical",
    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

describe("TicketsPage", () => {
    it("renders the page heading and ticket list", () => {
        render(
            <MemoryRouter initialEntries={["/tickets"]}>
                <Routes>
                    <Route
                        path="/tickets"
                        element={
                            <TicketsPage
                                tickets={[ticket]}
                                onStatusChange={vi.fn()}
                                onDeleteTicket={vi.fn()}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.getByRole("heading", {level: 1, name: "Tickets",})).toBeInTheDocument()

        expect(screen.getByText("Login problem")).toBeInTheDocument()
    })

    it("navigates to the edit route when Edit is clicked", () => {
        render(
            <MemoryRouter initialEntries={["/tickets"]}>
                <Routes>
                    <Route
                        path="/tickets"
                        element={
                            <TicketsPage
                                tickets={[ticket]}
                                onStatusChange={vi.fn()}
                                onDeleteTicket={vi.fn()}
                            />
                        }
                    />
                    <Route
                        path="/tickets/:id/edit"
                        element={<p>Ticket edit route</p>}
                    />
                </Routes>
            </MemoryRouter>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Edit" }))

        expect(
            screen.getByText("Ticket edit route"),
        ).toBeInTheDocument()
    })
})
