export type TicketStatus = "open" | "in-progress" | "resolved";
export type TicketPriority = "low" | "medium" | "high";
export type StatusFilter = TicketStatus | "all"
export type PriorityFilter = TicketPriority | "all"

export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
}