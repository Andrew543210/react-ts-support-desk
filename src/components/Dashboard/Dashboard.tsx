import { useNavigate } from "react-router-dom"
import styles from "./Dashboard.module.css"
import StatCard from "../StatCard/StatCard"
import TicketList from "../TicketList/TicketList"
import CreateTicketForm from "../CreateTicketForm/CreateTicketForm"
import type { Ticket, TicketStatus } from "../../types/Ticket"

type DashboardProps = {
    tickets: Ticket[]
    onCreateTicket: (ticket: Ticket) => void
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
}

export default function Dashboard({
    tickets,
    onCreateTicket,
    onStatusChange,
    onDeleteTicket,
}: DashboardProps) {
    const navigate = useNavigate()

    const stats = [
        {
            title: "Open Tickets",
            value: tickets.filter((ticket) => ticket.status === "open").length,
        },
        {
            title: "In Progress",
            value: tickets.filter((ticket) => ticket.status === "in-progress").length,
        },
        {
            title: "Resolved",
            value: tickets.filter((ticket) => ticket.status === "resolved").length,
        },
    ]

    function handleEditTicket(ticket: Ticket) {
        navigate(`/tickets/${ticket.id}/edit`)
    }

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>
                    Overview of your support activity.
                </p>
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
                tickets={tickets}
                onStatusChange={onStatusChange}
                onDeleteTicket={onDeleteTicket}
                onEditTicket={handleEditTicket}
            />

            <CreateTicketForm
                mode="create"
                onCreateTicket={onCreateTicket}
            />
        </div>
    )
}