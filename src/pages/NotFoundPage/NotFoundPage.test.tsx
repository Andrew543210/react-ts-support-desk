import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import NotFoundPage from "./NotFoundPage"

describe("NotFoundPage", () => {
    it("shows a 404 message and navigates back to Dashboard", async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={["/unknown"]}>
                <Routes>
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />

                    <Route
                        path="/"
                        element={<h1>Dashboard reached</h1>}
                    />
                </Routes>
            </MemoryRouter>
        )

        expect(
            screen.getByText("404")
        ).toBeInTheDocument()

        expect(
            screen.getByRole("heading", {
                name: "Page not found",
            })
        ).toBeInTheDocument()

        await user.click(
            screen.getByRole("link", {
                name: "Back to Dashboard",
            })
        )

        expect(
            screen.getByRole("heading", {
                name: "Dashboard reached",
            })
        ).toBeInTheDocument()
    })
})