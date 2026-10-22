import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import ConfirmDialog from "./ConfirmDialog"

let originalShowModal: PropertyDescriptor | undefined
let originalClose: PropertyDescriptor | undefined

beforeEach(() => {
    originalShowModal = Object.getOwnPropertyDescriptor(
        HTMLDialogElement.prototype,
        "showModal",
    )
    originalClose = Object.getOwnPropertyDescriptor(
        HTMLDialogElement.prototype,
        "close",
    )

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
        configurable: true,
        value: vi.fn(function (this: HTMLDialogElement) {
            this.open = true
        }),
    })

    Object.defineProperty(HTMLDialogElement.prototype, "close", {
        configurable: true,
        value: vi.fn(function (this: HTMLDialogElement) {
            this.open = false
        }),
    })
})

afterEach(() => {
    if (originalShowModal) {
        Object.defineProperty(
            HTMLDialogElement.prototype,
            "showModal",
            originalShowModal,
        )
    } else {
        Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal")
    }

    if (originalClose) {
        Object.defineProperty(
            HTMLDialogElement.prototype,
            "close",
            originalClose,
        )
    } else {
        Reflect.deleteProperty(HTMLDialogElement.prototype, "close")
    }

    vi.restoreAllMocks()
})

const defaultProps = {
    isOpen: true,
    title: "Delete ticket?",
    message: "Are you sure you want to delete this ticket?",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
}

describe("ConfirmDialog", () => {
    it("renders the title, message and action buttons", () => {
        render(<ConfirmDialog {...defaultProps} />)

        expect(
            screen.getByRole("heading", { name: "Delete ticket?" }),
        ).toBeInTheDocument()

        expect(
            screen.getByText("Are you sure you want to delete this ticket?"),
        ).toBeInTheDocument()

        expect(
            screen.getByRole("button", { name: "Cancel" }),
        ).toBeInTheDocument()

        expect(
            screen.getByRole("button", { name: "Delete ticket" }),
        ).toBeInTheDocument()
    })

    it("opens the dialog when isOpen is true", () => {
        render(<ConfirmDialog {...defaultProps} />)

        const dialog = document.querySelector("dialog")

        expect(dialog).not.toBeNull()
        expect(dialog?.open).toBe(true)
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce()
    })

    it("does not open the dialog when isOpen is false", () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />)

        const dialog = document.querySelector("dialog")

        expect(dialog?.open).toBe(false)
        expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
    })

    it("closes the dialog when isOpen changes to false", () => {
        const { rerender } = render(
            <ConfirmDialog {...defaultProps} isOpen={false} />,
        )

        rerender(<ConfirmDialog {...defaultProps} isOpen={true} />)

        expect(document.querySelector("dialog")?.open).toBe(true)

        rerender(<ConfirmDialog {...defaultProps} isOpen={false} />)

        expect(document.querySelector("dialog")?.open).toBe(false)
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalledOnce()
    })

    it("calls onCancel when the Cancel button is clicked", () => {
        const onCancel = vi.fn()

        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onCancel).toHaveBeenCalledOnce()
    })

    it("calls onConfirm when the Delete ticket button is clicked", () => {
        const onConfirm = vi.fn()

        render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)

        fireEvent.click(
            screen.getByRole("button", { name: "Delete ticket" }),
        )

        expect(onConfirm).toHaveBeenCalledOnce()
    })

    it("prevents the default cancel event and calls onCancel", () => {
        const onCancel = vi.fn()

        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

        const dialog = document.querySelector("dialog")
        expect(dialog).not.toBeNull()

        const event = new Event("cancel", { cancelable: true })

        fireEvent(dialog!, event)

        expect(event.defaultPrevented).toBe(true)
        expect(onCancel).toHaveBeenCalledOnce()
    })

    it("connects the dialog to its title and message for accessibility", () => {
        render(<ConfirmDialog {...defaultProps} />)

        const dialog = document.querySelector("dialog")
        const title = screen.getByRole("heading", { name: "Delete ticket?" })
        const message = screen.getByText(
            "Are you sure you want to delete this ticket?",
        )

        expect(dialog).toHaveAttribute("aria-labelledby", title.id)
        expect(dialog).toHaveAttribute("aria-describedby", message.id)
    })
})
