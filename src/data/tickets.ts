import type { Ticket } from "../types/Ticket"

export const tickets: Ticket[] = [
    {
        id: 1,
        title: "Cannot reset password",
        description: "User is unable to reset the account password.",
        status: "open",
        priority: "high",
    },
    {
        id: 2,
        title: "Payment page error",
        description: "Payment page shows an error after submitting the form.",
        status: "in-progress",
        priority: "medium",
    },
    {
        id: 3,
        title: "Change email address",
        description: "User wants to update the email linked to the account.",
        status: "resolved",
        priority: "low",
    },
]