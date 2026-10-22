import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi, afterEach } from "vitest"
import { useToast } from "../../hooks/useToast"
import ToastProvider from "./ToastProvider"

function TestConsumer() {
    const { showToast } = useToast()

    return (
        <div>
            <button onClick={() => showToast("Success message")}>
                Show success
            </button>
            <button onClick={() => showToast("Error message")}>
                Show error
            </button>
        </div>
    )
}

describe("ToastProvider", () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    it("renders its children", () => {
        render(
            <ToastProvider>
                <p>Child content</p>
            </ToastProvider>,
        )

        expect(screen.getByText("Child content")).toBeInTheDocument()
    })

    it("does not show a notification initially", () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        expect(
            screen.queryByRole("button", { name: "Dismiss notification" }),
        ).not.toBeInTheDocument()
    })

    it("shows a notification when showToast is called", () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))

        expect(screen.getByText("Success message")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Dismiss notification" }))
            .toBeInTheDocument()
    })

    it("replaces the current notification with a new one", () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))

        expect(screen.getByText("Success message")).toBeInTheDocument()

        fireEvent.click(screen.getByRole("button", { name: "Show error" }))

        expect(screen.getByText("Error message")).toBeInTheDocument()
        expect(screen.queryByText("Success message")).not.toBeInTheDocument()
    })

    it("dismisses a notification when the close button is clicked", () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))
        fireEvent.click(
            screen.getByRole("button", { name: "Dismiss notification" }),
        )

        expect(screen.queryByText("Success message")).not.toBeInTheDocument()
    })

    it("automatically dismisses a notification after four seconds", () => {
        vi.useFakeTimers()

        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))

        expect(screen.getByText("Success message")).toBeInTheDocument()

        act(() => {
            vi.advanceTimersByTime(3999)
        })

        expect(screen.getByText("Success message")).toBeInTheDocument()

        act(() => {
            vi.advanceTimersByTime(1)
        })

        expect(screen.queryByText("Success message")).not.toBeInTheDocument()
    })

    it("restarts the timeout when a new notification replaces the current one", () => {
        vi.useFakeTimers()

        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))

        act(() => {
            vi.advanceTimersByTime(3000)
        })

        fireEvent.click(screen.getByRole("button", { name: "Show error" }))

        act(() => {
            vi.advanceTimersByTime(2000)
        })

        expect(screen.getByText("Error message")).toBeInTheDocument()

        act(() => {
            vi.advanceTimersByTime(2000)
        })

        expect(screen.queryByText("Error message")).not.toBeInTheDocument()
    })

    it("clears the active timeout when the notification is dismissed manually", () => {
        vi.useFakeTimers()
        const clearTimeoutSpy = vi.spyOn(window, "clearTimeout")

        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        fireEvent.click(screen.getByRole("button", { name: "Show success" }))
        fireEvent.click(
            screen.getByRole("button", { name: "Dismiss notification" }),
        )

        expect(screen.queryByText("Success message")).not.toBeInTheDocument()
        expect(clearTimeoutSpy).toHaveBeenCalled()

        clearTimeoutSpy.mockRestore()
    })

    it("exposes a polite live region for accessibility", () => {
        const { container } = render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        )

        const liveRegion = container.querySelector('[aria-live="polite"]')

        expect(liveRegion).toBeInTheDocument()
        expect(liveRegion).toHaveAttribute("aria-atomic", "true")
    })
})
