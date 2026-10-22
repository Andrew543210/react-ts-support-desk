export type TicketStatus = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high";
export type TicketCategory = "technical" | "billing" | "account" | "general"
export type StatusFilter = TicketStatus | "all"
export type PriorityFilter = TicketPriority | "all"
export type CategoryFilter = TicketCategory | "all"
export type TicketSort =
    | "newest"
    | "oldest"
    | "priority-high"
    | "priority-low"

export type CreateTicketInput = Pick<
    Ticket,
    "title" | "description" | "priority" | "category"
>

export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    createdAt: string | null;
    updatedAt: string | null;
    comments: TicketComment[];
}

export type TicketComment = {
    id: string
    author: string
    content: string
    createdAt: string
}