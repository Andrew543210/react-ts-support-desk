import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import TicketForm from "./TicketForm"
import type { Ticket, CreateTicketInput } from "../../types/Ticket"

const editingTicket: Ticket = {
    id: 42,
    title: "Existing ticket",
    description: "Existing description",
    status: "in-progress",
    priority: "high",
    category: "technical",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

function fillRequiredFields(title: string, description: string) {
    fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
        target: { value: title },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Description" }), {
        target: { value: description },
    })
}

describe("TicketForm — create mode", () => {
    it("renders all fields and default values", () => {
        render(<TicketForm mode="create" onCreateTicket={vi.fn(() => true)} />)

        expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("")
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("")
        expect(screen.getByRole("combobox", { name: "Priority" })).toHaveValue("medium")
        expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue("general")
        expect(screen.getByRole("button", { name: "Create Ticket" })).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument()
    })

    it("creates a ticket with trimmed text and selected values", () => {
        const onCreateTicket = vi.fn<(input: CreateTicketInput) => boolean>()
            .mockReturnValue(true)
        render(<TicketForm mode="create" onCreateTicket={onCreateTicket} />)

        fillRequiredFields("  Login problem  ", "  Cannot access my account.  ")
        fireEvent.change(screen.getByRole("combobox", { name: "Priority" }), {
            target: { value: "high" },
        })
        fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
            target: { value: "technical" },
        })
        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(onCreateTicket).toHaveBeenCalledExactlyOnceWith({
            title: "Login problem",
            description: "Cannot access my account.",
            priority: "high",
            category: "technical",
        })
    })

    it("requires a title", () => {
        const onCreateTicket = vi.fn(() => true)
        render(<TicketForm mode="create" onCreateTicket={onCreateTicket} />)

        fillRequiredFields("   ", "A description")
        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(screen.getByText("Title and description are required.")).toBeInTheDocument()
        expect(onCreateTicket).not.toHaveBeenCalled()
    })

    it("requires a description", () => {
        const onCreateTicket = vi.fn(() => true)
        render(<TicketForm mode="create" onCreateTicket={onCreateTicket} />)

        fillRequiredFields("A title", "   ")
        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(screen.getByText("Title and description are required.")).toBeInTheDocument()
        expect(onCreateTicket).not.toHaveBeenCalled()
    })

    it("requires both title and description", () => {
        const onCreateTicket = vi.fn(() => true)
        render(<TicketForm mode="create" onCreateTicket={onCreateTicket} />)

        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(screen.getByText("Title and description are required.")).toBeInTheDocument()
        expect(onCreateTicket).not.toHaveBeenCalled()
    })

    it("clears the validation error after a successful submission", () => {
        const onCreateTicket = vi.fn(() => true)
        render(<TicketForm mode="create" onCreateTicket={onCreateTicket} />)

        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))
        expect(screen.getByText("Title and description are required.")).toBeInTheDocument()

        fillRequiredFields("A title", "A description")
        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(screen.queryByText("Title and description are required.")).not.toBeInTheDocument()
        expect(onCreateTicket).toHaveBeenCalledOnce()
    })

    it("resets fields to their defaults after successful creation", () => {
        render(<TicketForm mode="create" onCreateTicket={vi.fn(() => true)} />)

        fillRequiredFields("A title", "A description")
        fireEvent.change(screen.getByRole("combobox", { name: "Priority" }), {
            target: { value: "high" },
        })
        fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
            target: { value: "billing" },
        })
        fireEvent.click(screen.getByRole("button", { name: "Create Ticket" }))

        expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("")
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("")
        expect(screen.getByRole("combobox", { name: "Priority" })).toHaveValue("medium")
        expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue("general")
    })

    it("keeps entered values when creation fails", () => {
        const onCreateTicket = vi.fn(() => false)

        render(
            <TicketForm
                mode="create"
                onCreateTicket={onCreateTicket}
            />
        )

        fillRequiredFields("Important issue", "Please investigate")

        fireEvent.click(
            screen.getByRole("button", {
                name: "Create Ticket",
            })
        )

        expect(onCreateTicket).toHaveBeenCalledOnce()

        expect(
            screen.getByRole("textbox", { name: "Title" })
        ).toHaveValue("Important issue")

        expect(
            screen.getByRole("textbox", { name: "Description" })
        ).toHaveValue("Please investigate")
    })
})

describe("TicketForm — edit mode", () => {
    it("populates fields with the existing ticket values", () => {
        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={vi.fn(() => true)}
                onCancelEdit={vi.fn()}
            />,
        )

        expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("Existing ticket")
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("Existing description")
        expect(screen.getByRole("combobox", { name: "Priority" })).toHaveValue("high")
        expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue("technical")
        expect(screen.getByRole("button", { name: "Update Ticket" })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    })

    it("saves updated values while preserving the other ticket fields", () => {
        const onSaveTicket = vi.fn<(ticket: Ticket) => boolean>()
            .mockReturnValue(true)
        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={onSaveTicket}
                onCancelEdit={vi.fn()}
            />,
        )

        fillRequiredFields("  Updated title  ", "  Updated description  ")
        fireEvent.change(screen.getByRole("combobox", { name: "Priority" }), {
            target: { value: "low" },
        })
        fireEvent.change(screen.getByRole("combobox", { name: "Category" }), {
            target: { value: "billing" },
        })
        fireEvent.click(screen.getByRole("button", { name: "Update Ticket" }))

        expect(onSaveTicket).toHaveBeenCalledExactlyOnceWith({
            ...editingTicket,
            title: "Updated title",
            description: "Updated description",
            priority: "low",
            category: "billing",
        })
    })

    it("does not save when required fields are empty", () => {
        const onSaveTicket = vi.fn(() => true)
        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={onSaveTicket}
                onCancelEdit={vi.fn()}
            />,
        )

        fillRequiredFields("", "   ")
        fireEvent.click(screen.getByRole("button", { name: "Update Ticket" }))

        expect(screen.getByText("Title and description are required.")).toBeInTheDocument()
        expect(onSaveTicket).not.toHaveBeenCalled()
    })

    it("calls onCancelEdit when Cancel is clicked", () => {
        const onCancelEdit = vi.fn()
        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={vi.fn(() => true)}
                onCancelEdit={onCancelEdit}
            />,
        )

        fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

        expect(onCancelEdit).toHaveBeenCalledOnce()
    })

    it("resets the form after a successful update", () => {
        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={vi.fn(() => true)}
                onCancelEdit={vi.fn()}
            />,
        )

        fillRequiredFields("Updated title", "Updated description")
        fireEvent.click(screen.getByRole("button", { name: "Update Ticket" }))

        expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue("")
        expect(screen.getByRole("textbox", { name: "Description" })).toHaveValue("")
        expect(screen.getByRole("combobox", { name: "Priority" })).toHaveValue("medium")
        expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue("general")
    })
    it("keeps edited values when saving fails", () => {
        const onSaveTicket = vi.fn(() => false)

        render(
            <TicketForm
                mode="edit"
                editingTicket={editingTicket}
                onSaveTicket={onSaveTicket}
                onCancelEdit={vi.fn()}
            />,
        )

        fillRequiredFields("Unpublished title", "Unpublished description")
        fireEvent.change(
            screen.getByRole("combobox", { name: "Priority" }),
            { target: { value: "low" } },
        )
        fireEvent.change(
            screen.getByRole("combobox", { name: "Category" }),
            { target: { value: "billing" } },
        )
        fireEvent.click(screen.getByRole("button", { name: "Update Ticket" }))

        expect(onSaveTicket).toHaveBeenCalledExactlyOnceWith({
            ...editingTicket,
            title: "Unpublished title",
            description: "Unpublished description",
            priority: "low",
            category: "billing",
        })
        expect(screen.getByRole("textbox", { name: "Title" }))
            .toHaveValue("Unpublished title")
        expect(screen.getByRole("textbox", { name: "Description" }))
            .toHaveValue("Unpublished description")
        expect(screen.getByRole("combobox", { name: "Priority" }))
            .toHaveValue("low")
        expect(screen.getByRole("combobox", { name: "Category" }))
            .toHaveValue("billing")
    })
})
