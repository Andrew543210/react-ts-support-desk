import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Sidebar from "./Sidebar"

function renderSidebar(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Sidebar />
        </MemoryRouter>,
    )
}

describe("Sidebar", () => {
    it("renders all navigation links", () => {
        renderSidebar("/")

        expect(
            screen.getByRole("link", { name: "Dashboard" }),
        ).toHaveAttribute("href", "/")

        expect(
            screen.getByRole("link", { name: "Tickets" }),
        ).toHaveAttribute("href", "/tickets")

        expect(
            screen.getByRole("link", { name: "Create Ticket" }),
        ).toHaveAttribute("href", "/tickets/new")
    })

    it("marks Dashboard as active on the root route", () => {
        renderSidebar("/")

        expect(
            screen.getByRole("link", { name: "Dashboard" }),
        ).toHaveAttribute("aria-current", "page")
    })

    it("marks Tickets as active on the tickets route", () => {
        renderSidebar("/tickets")

        expect(
            screen.getByRole("link", { name: "Tickets" }),
        ).toHaveAttribute("aria-current", "page")
    })

    it("does not mark Tickets as active on the Create Ticket route", () => {
        renderSidebar("/tickets/new")

        expect(
            screen.getByRole("link", { name: "Create Ticket" }),
        ).toHaveAttribute("aria-current", "page")

        expect(
            screen.getByRole("link", { name: "Tickets" }),
        ).not.toHaveAttribute("aria-current", "page")
    })
})
