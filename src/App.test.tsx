
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "./App"
import ToastProvider from "./components/ToastProvider/ToastProvider"

vi.mock("./hooks/useTickets", () => ({
    useTickets: () => ({
        tickets: [
            {
                id: 1,
                title: "Test ticket",
                description: "Test description",
                status: "open",
                priority: "medium",
                category: "technical",
                createdAt: "2026-10-10T10:00:00.000Z",
                updatedAt: null,
                comments: [],
            },
        ],
        createTicket: vi.fn(),
        changeTicketStatus: vi.fn(),
        deleteTicket: vi.fn(),
        updateTicket: vi.fn(),
        addTicketComment: vi.fn(),
    }),
}))

function renderApp(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <ToastProvider>
                <App />
            </ToastProvider>
        </MemoryRouter>,
    )
}

describe("App", () => {
    it("renders the shared header and sidebar", () => {
        renderApp("/")

        expect(screen.getByText("SupportDesk")).toBeInTheDocument()
        expect(
            screen.getByRole("link", { name: "Dashboard" }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole("link", { name: "Tickets" }),
        ).toBeInTheDocument()
        expect(
            screen.getByRole("link", { name: "Create Ticket" }),
        ).toBeInTheDocument()
    })

    it("renders the dashboard route", () => {
        renderApp("/")

        expect(
            screen.getByRole("heading", { name: "Dashboard" }),
        ).toBeInTheDocument()
        expect(screen.getByText("Test ticket")).toBeInTheDocument()
    })

    it("renders the tickets route", () => {
        renderApp("/tickets")

        expect(screen.getByRole("heading", {level: 1, name: "Tickets",})).toBeInTheDocument()
        expect(screen.getByText("Test ticket")).toBeInTheDocument()
    })

    it("renders the ticket details route", () => {
        renderApp("/tickets/1")

        expect(
            screen.getByRole("heading", { name: "Test ticket" }),
        ).toBeInTheDocument()
        expect(screen.getByText("Test description")).toBeInTheDocument()
    })

    it("renders the create ticket route", () => {
        renderApp("/tickets/new")

        expect(
            screen.getByRole("heading", { name: "Create Ticket" }),
        ).toBeInTheDocument()
    })

    it("renders the edit ticket route", () => {
        renderApp("/tickets/1/edit")

        expect(
            screen.getByRole("heading", { name: "Edit Ticket" }),
        ).toBeInTheDocument()
    })

    it("shows a not-found message for an unknown ticket ID", () => {
        renderApp("/tickets/999")

        expect(
            screen.getByRole("heading", { name: "Ticket not found" }),
        ).toBeInTheDocument()
    })
})
