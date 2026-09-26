import type { Ticket } from "../types/Ticket";

type TicketListProps = {
    tickets: Ticket[]
}

export default function TicketList({ tickets }: TicketListProps) {
    return (
        <section>
            <h2>Tickets</h2>
            <ul className="ticket-list">
                {tickets.map((ticket) => (
                    <li key={ticket.id} className="ticket-item">
                        <h3>{ticket.title}</h3>
                        <p>Status: {ticket.status.toUpperCase()}</p>
                        <p>Priority: {ticket.priority.toUpperCase()}</p>
                        <p>{ticket.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

