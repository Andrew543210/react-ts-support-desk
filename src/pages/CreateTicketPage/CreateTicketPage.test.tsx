import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import CreateTicketPage from "./CreateTicketPage"
import type { CreateTicketInput } from "../../types/Ticket"

vi.mock("../../components/TicketForm/TicketForm", () => ({
    default: ({
        onCreateTicket,
    }: {
        onCreateTicket: (ticket: CreateTicketInput) => boolean
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
                <CreateTicketPage onCreateTicket={vi.fn(() => true)} />
            </MemoryRouter>,
        )

        expect(
            screen.getByRole("heading", { name: "Create Ticket" }),
        ).toBeInTheDocument()
    })

    it("creates a ticket and navigates to the tickets page", () => {
        const onCreateTicket = vi.fn(() => true)

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
    
    it("stays on the form when ticket creation fails", () => {
        const onCreateTicket = vi.fn(() => false)

        render(
            <MemoryRouter initialEntries={["/tickets/new"]}>
                <Routes>
                    <Route
                        path="/tickets/new"
                        element={<CreateTicketPage onCreateTicket={onCreateTicket} />}
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

        expect(onCreateTicket).toHaveBeenCalledOnce()
        expect(
            screen.getByRole("heading", { name: "Create Ticket" }),
        ).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "Tickets page reached" }),
        ).not.toBeInTheDocument()
    })
})
