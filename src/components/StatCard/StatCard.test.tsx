import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import StatCard from "./StatCard"

describe("StatCard", () => {
    it("renders the title and numeric value", () => {
        render(<StatCard title="Open Tickets" value={12} />)

        expect(
            screen.getByRole("heading", { name: "Open Tickets" }),
        ).toBeInTheDocument()
        expect(screen.getByText("12")).toBeInTheDocument()
    })

    it("renders zero as the value", () => {
        render(<StatCard title="Resolved" value={0} />)

        expect(screen.getByText("0")).toBeInTheDocument()
    })

    it("renders different titles and values correctly", () => {
        const { rerender } = render(
            <StatCard title="In Progress" value={5} />,
        )

        expect(
            screen.getByRole("heading", { name: "In Progress" }),
        ).toBeInTheDocument()
        expect(screen.getByText("5")).toBeInTheDocument()

        rerender(<StatCard title="Resolved" value={38} />)

        expect(
            screen.getByRole("heading", { name: "Resolved" }),
        ).toBeInTheDocument()
        expect(screen.getByText("38")).toBeInTheDocument()
        expect(
            screen.queryByRole("heading", { name: "In Progress" }),
        ).not.toBeInTheDocument()
    })
})
