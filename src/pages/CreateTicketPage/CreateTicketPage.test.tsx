import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import CreateTicketPage from "./CreateTicketPage"

vi.mock("../../components/TicketForm/TicketForm", () => ({
    default: ({
        onCreateTicket,
    }: {
        onCreateTicket: (ticket: {
            title: string
            description: string
            priority: "high"
            category: "technical"
        }) => void
    }) => (
        <button
            type="button"
            onClick={() =>
                onCreateTicket({
                    title: "Created ticket",
                    description: "Created for testing",
                    priority: "high",
                    category: "technical",
                })
            }
        >
            Submit test ticket
        </button>
    ),
}))

describe("CreateTicketPage", () => {
    it("renders the page heading", () => {
        render(
            <MemoryRouter>
                <CreateTicketPage onCreateTicket={vi.fn()} />
            </MemoryRouter>,
        )

        expect(
            screen.getByRole("heading", { name: "Create Ticket" }),
        ).toBeInTheDocument()
    })

    it("creates a ticket and navigates to the tickets page", () => {
        const onCreateTicket = vi.fn()

        render(
            <MemoryRouter initialEntries={["/tickets/new"]}>
                <Routes>
                    <Route
                        path="/tickets/new"
                        element={
                            <CreateTicketPage
                                onCreateTicket={onCreateTicket}
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

        fireEvent.click(
            screen.getByRole("button", { name: "Submit test ticket" }),
        )

        expect(onCreateTicket).toHaveBeenCalledWith({
            title: "Created ticket",
            description: "Created for testing",
            priority: "high",
            category: "technical",
        })

        expect(
            screen.getByRole("heading", { name: "Tickets page reached" }),
        ).toBeInTheDocument()
    })
})
