import { afterEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "./ErrorFallback"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("ErrorBoundary integration", () => {
    it("renders children when no error occurs", () => {
        render(
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <p>Application content</p>
            </ErrorBoundary>
        )

        expect(
            screen.getByText("Application content")
        ).toBeInTheDocument()
    })

    it("shows fallback when a child throws during rendering", () => {
        vi.spyOn(console, "error").mockImplementation(() => {})

        function BrokenComponent(): never {
            throw new Error("Render failed")
        }

        render(
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <BrokenComponent />
            </ErrorBoundary>
        )

        expect(
            screen.getByRole("alert")
        ).toBeInTheDocument()

        expect(
            screen.getByRole("heading", {
                name: "Something went wrong",
            })
        ).toBeInTheDocument()

        expect(
            screen.getByRole("button", {
                name: "Try again",
            })
        ).toBeInTheDocument()
    })

    it("recovers after a temporary rendering error", () => {
        vi.spyOn(console, "error").mockImplementation(() => {})

        let shouldThrow = true

        function SometimesBroken() {
            if (shouldThrow) {
                throw new Error("Temporary error")
            }

            return <p>Recovered content</p>
        }

        render(
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <SometimesBroken />
            </ErrorBoundary>
        )

        expect(
            screen.getByRole("alert")
        ).toBeInTheDocument()

        shouldThrow = false

        fireEvent.click(
            screen.getByRole("button", {
                name: "Try again",
            })
        )

        expect(
            screen.getByText("Recovered content")
        ).toBeInTheDocument()

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument()
    })
})