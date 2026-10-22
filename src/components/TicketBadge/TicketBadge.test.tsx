
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import TicketBadge from "./TicketBadge"

describe("TicketBadge", () => {
    it("displays the open status with a capital letter", () => {
        render(<TicketBadge kind="status" value="open" />)

        expect(screen.getByText("Open")).toBeInTheDocument()
    })

    it("formats a hyphenated status correctly", () => {
        render(<TicketBadge kind="status" value="in-progress" />)

        expect(screen.getByText("In Progress")).toBeInTheDocument()
    })

    it("displays the resolved status", () => {
        render(<TicketBadge kind="status" value="resolved" />)

        expect(screen.getByText("Resolved")).toBeInTheDocument()
    })

    it.each(["low", "medium", "high"] as const)(
        "displays the %s priority correctly",
        (priority) => {
            render(<TicketBadge kind="priority" value={priority} />)

            expect(
                screen.getByText(
                    priority.charAt(0).toUpperCase() + priority.slice(1),
                ),
            ).toBeInTheDocument()
        },
    )

    it("sets data-status for a status badge", () => {
        render(<TicketBadge kind="status" value="in-progress" />)

        const badge = screen.getByText("In Progress")

        expect(badge).toHaveAttribute("data-status", "in-progress")
        expect(badge).not.toHaveAttribute("data-priority")
    })

    it("sets data-priority for a priority badge", () => {
        render(<TicketBadge kind="priority" value="high" />)

        const badge = screen.getByText("High")

        expect(badge).toHaveAttribute("data-priority", "high")
        expect(badge).not.toHaveAttribute("data-status")
    })
})
