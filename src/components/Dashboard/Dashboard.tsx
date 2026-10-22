import styles from "./Dashboard.module.css"
import StatCard from "../StatCard/StatCard"
import type { Ticket } from "../../types/Ticket"
import { Link } from "react-router-dom"
import TicketBadge from "../TicketBadge/TicketBadge"

type DashboardProps = {
    tickets: Ticket[]
}

export default function Dashboard({
    tickets,
}: DashboardProps) {

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

    const recentTickets = [...tickets]
        .sort((a, b) => {
            if (a.createdAt === null && b.createdAt === null) return 0
            if (a.createdAt === null) return 1
            if (b.createdAt === null) return -1

            return Date.parse(b.createdAt) - Date.parse(a.createdAt)
        })
        .slice(0, 5)

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

            <section
                className={styles.recentSection}
                aria-labelledby="recent-tickets-title"
            >
                <div className={styles.recentHeader}>
                    <h2
                        id="recent-tickets-title"
                        className={styles.recentTitle}
                    >
                        Recent Tickets
                    </h2>
                    <Link
                        to="/tickets"
                        className={styles.viewAllLink}
                    >
                        View all tickets →
                    </Link>
                </div>

                {recentTickets.length === 0 ? (
                    <p className={styles.emptyState}>
                        No tickets yet.
                    </p>
                ) : (
                    <ul className={styles.recentList}>
                        {recentTickets.map((ticket) => (
                            <li
                                key={ticket.id}
                                className={styles.recentItem}
                            >
                                <Link
                                    to={`/tickets/${ticket.id}`}
                                    className={styles.ticketLink}
                                >
                                    {ticket.title}
                                </Link>

                                <TicketBadge
                                    kind="status"
                                    value={ticket.status}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}