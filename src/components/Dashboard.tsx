import { useState } from "react"
import StatCard from "./StatCard"
import TicketList from "./TicketList"
import CreateTicketForm from "./CreateTicketForm"
import { tickets } from "../data/tickets"
import type { Ticket } from "../types/Ticket"

const stats = [
    { title: "Open Tickets", value: 12 },
    { title: "In Progress", value: 5 },
    { title: "Resolved", value: 38 },
]


export default function Dashboard() {

    const [ticketList, setTicketList] = useState(tickets)

    function handleCreateTicket(ticket: Ticket) {
        setTicketList((currentTickets) => [
            ...currentTickets,
            ticket,
        ])
    }

    return (
        <>
            <h2>Dashboard</h2>
            <p>Overview of your support activity.</p>
            <section className="stats-grid">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}
            </section>
            <TicketList tickets={ticketList} />
            <CreateTicketForm onCreateTicket={handleCreateTicket} />
        </>
    )
}