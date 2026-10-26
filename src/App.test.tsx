import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import App from "./App"
import ToastProvider from "./components/ToastProvider/ToastProvider"

const createTicketMock = vi.hoisted(() => vi.fn(() => true))

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
        createTicket: createTicketMock,
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
    beforeEach(() => {
        createTicketMock.mockReset()
        createTicketMock.mockReturnValue(true)
    })

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

    it("shows an error and keeps the form when ticket creation fails", () => {
        createTicketMock.mockReturnValue(false)

        renderApp("/tickets/new")

        fireEvent.change(
            screen.getByRole("textbox", { name: "Title" }),
            { target: { value: "Important issue" } }
        )

        fireEvent.change(
            screen.getByRole("textbox", { name: "Description" }),
            { target: { value: "Please investigate" } }
        )

        fireEvent.click(
            screen.getByRole("button", { name: "Create Ticket" })
        )

        expect(createTicketMock).toHaveBeenCalledWith({
            title: "Important issue",
            description: "Please investigate",
            priority: "medium",
            category: "general",
        })

        expect(
            screen.getByText(
                "Could not save changes. Please try again."
            )
        ).toBeInTheDocument()

        expect(
            screen.getByRole("heading", { name: "Create Ticket" })
        ).toBeInTheDocument()

        expect(
            screen.getByRole("textbox", { name: "Title" })
        ).toHaveValue("Important issue")

        expect(
            screen.getByRole("textbox", { name: "Description" })
        ).toHaveValue("Please investigate")
    })

    it("renders the not-found page for an unknown route", () => {
        renderApp("/unknown-route")

        expect(
            screen.getByRole("heading", {
                name: "Page not found",
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole("link", {
                name: "Back to Dashboard",
            })
        ).toHaveAttribute("href", "/")
    })
})
