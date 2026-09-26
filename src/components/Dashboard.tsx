import { useState } from "react"
import StatCard from "./StatCard"
import TicketList from "./TicketList"
import CreateTicketForm from "./CreateTicketForm"
import { tickets } from "../data/tickets"
import type { Ticket } from "../types/Ticket"


export default function Dashboard() {

    const [ticketList, setTicketList] = useState(tickets)

    const stats = [
        {
            title: "Open Tickets",
            value: ticketList.filter((ticket) => ticket.status === "open").length,
        },
        {
            title: "In Progress",
            value: ticketList.filter((ticket) => ticket.status === "in-progress").length,
        },
        {
            title: "Resolved",
            value: ticketList.filter((ticket) => ticket.status === "resolved").length,
        },
    ]

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