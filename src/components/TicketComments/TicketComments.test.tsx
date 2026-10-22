import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import TicketComments from "./TicketComments"
import type { Ticket } from "../../types/Ticket"

const ticket: Ticket = {
    id: 10,
    title: "Login problem",
    description: "Cannot access account",
    status: "open",
    priority: "medium",
    category: "account",
    createdAt: "2026-10-21T10:00:00.000Z",
    updatedAt: null,
    comments: [],
}

describe("TicketComments", () => {
    it("submits a trimmed comment and clears the form", async () => {
        const user = userEvent.setup()
        const onAddComment = vi.fn()

        render(
            <TicketComments
                ticket={ticket}
                onAddComment={onAddComment}
            />
        )

        const textarea = screen.getByRole("textbox", {
            name: "Add a comment",
        })

        const button = screen.getByRole("button", {
            name: "Add comment",
        })

        expect(button).toBeDisabled()

        await user.type(textarea, "  Investigating now  ")

        expect(button).toBeEnabled()

        await user.click(button)

        expect(onAddComment).toHaveBeenCalledWith(
            10,
            "Investigating now"
        )

        expect(textarea).toHaveValue("")
        expect(button).toBeDisabled()
    })
})