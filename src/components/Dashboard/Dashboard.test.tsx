import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Dashboard from "./Dashboard"
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

function renderDashboard(tickets: Ticket[] = []) {
    return render(
        <MemoryRouter>
            <Dashboard tickets={tickets} />
        </MemoryRouter>,
    )
}

describe("Dashboard", () => {
    it("renders the dashboard heading and subtitle", () => {
        renderDashboard()

        expect(
            screen.getByRole("heading", { name: "Dashboard" }),
        ).toBeInTheDocument()

        expect(
            screen.getByText("Overview of your support activity."),
        ).toBeInTheDocument()
    })

    it("shows zero for every statistic when there are no tickets", () => {
        renderDashboard()

        expect(screen.getByRole("heading", { name: "Open Tickets" }))
            .toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "In Progress" }))
            .toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Resolved" }))
            .toBeInTheDocument()

        const statCards = screen.getAllByRole("article")
        expect(statCards).toHaveLength(3)

        for (const card of statCards) {
            expect(within(card).getByText("0")).toBeInTheDocument()
        }
    })

    it("calculates ticket statistics by status", () => {
        const tickets: Ticket[] = [
            makeTicket({ id: 1, status: "open" }),
            makeTicket({ id: 2, status: "open" }),
            makeTicket({ id: 3, status: "in-progress" }),
            makeTicket({ id: 4, status: "resolved" }),
            makeTicket({ id: 5, status: "resolved" }),
            makeTicket({ id: 6, status: "resolved" }),
        ]

        renderDashboard(tickets)

        const openCard = screen.getByRole("heading", {
            name: "Open Tickets",
        }).closest("article")

        const progressCard = screen.getByRole("heading", {
            name: "In Progress",
        }).closest("article")

        const resolvedCard = screen.getByRole("heading", {
            name: "Resolved",
        }).closest("article")

        expect(openCard).not.toBeNull()
        expect(progressCard).not.toBeNull()
        expect(resolvedCard).not.toBeNull()

        expect(within(openCard as HTMLElement).getByText("2"))
            .toBeInTheDocument()
        expect(within(progressCard as HTMLElement).getByText("1"))
            .toBeInTheDocument()
        expect(within(resolvedCard as HTMLElement).getByText("3"))
            .toBeInTheDocument()
    })

    it("shows an empty-state message when there are no tickets", () => {
        renderDashboard([])

        expect(screen.getByText("No tickets yet.")).toBeInTheDocument()
        expect(screen.queryByRole("list")).not.toBeInTheDocument()
    })

    it("displays recent tickets in descending creation-date order", () => {
        const tickets: Ticket[] = [
            makeTicket({
                id: 1,
                title: "Oldest ticket",
                createdAt: "2026-10-01T10:00:00.000Z",
            }),
            makeTicket({
                id: 2,
                title: "Newest ticket",
                createdAt: "2026-10-03T10:00:00.000Z",
            }),
            makeTicket({
                id: 3,
                title: "Middle ticket",
                createdAt: "2026-10-02T10:00:00.000Z",
            }),
        ]

        renderDashboard(tickets)

        const list = screen.getByRole("list")
        const links = within(list).getAllByRole("link")

        expect(links.map((link) => link.textContent)).toEqual([
            "Newest ticket",
            "Middle ticket",
            "Oldest ticket",
        ])
    })

    it("shows no more than five recent tickets", () => {
        const tickets = Array.from({ length: 7 }, (_, index) =>
            makeTicket({
                id: index + 1,
                title: `Ticket ${index + 1}`,
                createdAt: `2026-10-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
            }),
        )

        renderDashboard(tickets)

        const list = screen.getByRole("list")
        const items = within(list).getAllByRole("listitem")

        expect(items).toHaveLength(5)
        expect(screen.getByRole("link", { name: "Ticket 7" }))
            .toBeInTheDocument()
        expect(screen.getByRole("link", { name: "Ticket 3" }))
            .toBeInTheDocument()
        expect(screen.queryByRole("link", { name: "Ticket 2" }))
            .not.toBeInTheDocument()
    })

    it("places tickets without a creation date after dated tickets", () => {
        const tickets: Ticket[] = [
            makeTicket({
                id: 1,
                title: "Undated ticket",
                createdAt: null,
            }),
            makeTicket({
                id: 2,
                title: "Dated ticket",
                createdAt: "2026-10-01T10:00:00.000Z",
            }),
        ]

        renderDashboard(tickets)

        const links = within(screen.getByRole("list")).getAllByRole("link")

        expect(links.map((link) => link.textContent)).toEqual([
            "Dated ticket",
            "Undated ticket",
        ])
    })

    it("links to the tickets page and individual ticket details", () => {
        const tickets = [
            makeTicket({
                id: 42,
                title: "Cannot access account",
            }),
        ]

        renderDashboard(tickets)

        expect(
            screen.getByRole("link", { name: /View all tickets/ }),
        ).toHaveAttribute("href", "/tickets")

        expect(
            screen.getByRole("link", { name: "Cannot access account" }),
        ).toHaveAttribute("href", "/tickets/42")
    })
})
