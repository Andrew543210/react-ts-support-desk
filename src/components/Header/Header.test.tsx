import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import Header from "./Header"

describe("Header", () => {
    it("renders the SupportDesk brand", () => {
        render(<Header />)

        expect(screen.getByText("SupportDesk")).toBeInTheDocument()
        expect(screen.getByText("S")).toBeInTheDocument()
    })

    it("renders the user name and role", () => {
        render(<Header />)

        expect(screen.getByText("Support Agent")).toBeInTheDocument()
        expect(screen.getByText("Agent")).toBeInTheDocument()
        expect(screen.getByText("A")).toBeInTheDocument()
    })
})
