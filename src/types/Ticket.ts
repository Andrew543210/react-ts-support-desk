export type TicketStatus = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high";
export type TicketCategory = "technical" | "billing" | "account" | "general"
export type StatusFilter = TicketStatus | "all"
export type PriorityFilter = TicketPriority | "all"
export type CategoryFilter = TicketCategory | "all"
export type TicketSort = "newest" | "oldest"

export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    category: TicketCategory;
    createdAt: string | null;
    updatedAt: string | null;
}