import type { Ticket } from "../types/Ticket"

export const tickets: Ticket[] = [
    {
        id: 1,
        title: "Cannot reset password",
        description: "User is unable to reset the account password.",
        status: "open",
        priority: "high",
        category: "account",
        createdAt: "2026-09-26T09:52:07.000Z",
        updatedAt: null,
    },
    {
        id: 2,
        title: "Payment page error",
        description: "Payment page shows an error after submitting the form.",
        status: "in-progress",
        priority: "medium",
        category: "billing",
        createdAt: "2026-09-26T09:52:07.000Z",
        updatedAt: "2026-09-26T09:52:07.000Z",
    },
    {
        id: 3,
        title: "Change email address",
        description: "User wants to update the email linked to the account.",
        status: "resolved",
        priority: "low",
        category: "account",
        createdAt: "2026-09-26T09:52:07.000Z",
        updatedAt: "2026-09-26T09:52:07.000Z",
    },
]