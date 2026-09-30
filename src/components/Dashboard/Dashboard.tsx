import { useState } from "react"
import styles from "./Dashboard.module.css"
import StatCard from "../StatCard/StatCard"
import TicketList from "../TicketList/TicketList"
import CreateTicketForm from "../CreateTicketForm/CreateTicketForm"
import { tickets } from "../../data/tickets"
import type { Ticket, TicketStatus } from "../../types/Ticket"


export default function Dashboard() {

    const [ticketList, setTicketList] = useState(tickets)
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)


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

    function handleStatusChange(id: number, status: TicketStatus) {
        setTicketList((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === id
                    ? { ...ticket, status }
                    : ticket
            )
        )
    }

    function handleEditTicket(ticket: Ticket) {
        setEditingTicket(ticket)
    }

    function handleCancelEdit() {
        setEditingTicket(null)
    }

    function handleDeleteTicket(id: number) {
        setTicketList((currentTickets) =>
            currentTickets.filter((ticket) => ticket.id !== id)
        )
    }

    function handleSaveTicket(updatedTicket: Ticket) {
        setTicketList((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === updatedTicket.id
                    ? updatedTicket
                    : ticket
            )
        )

        setEditingTicket(null)
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Overview of your support activity.</p>
            </header>
            <section className={styles.statsGrid}>
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}
            </section>
            <TicketList
                tickets={ticketList}
                onStatusChange={handleStatusChange}
                onDeleteTicket={handleDeleteTicket}
                onEditTicket={handleEditTicket}
            />
            <CreateTicketForm
                onCreateTicket={handleCreateTicket}
                editingTicket={editingTicket}
                onSaveTicket={handleSaveTicket}
                onCancelEdit={handleCancelEdit}
            />
        </div>
    )
}