import { Link, useParams } from "react-router-dom"
import TicketBadge from "../../components/TicketBadge/TicketBadge"
import type { Ticket } from "../../types/Ticket"
import styles from "./TicketDetailsPage.module.css"

type TicketDetailsPageProps = {
    tickets: Ticket[]
}

export default function TicketDetailsPage({
    tickets,
}: TicketDetailsPageProps) {
    const { id } = useParams()

    const ticketId = Number(id)

    const ticket = tickets.find(
        (ticket) => ticket.id === ticketId
    )

    if (!ticket) {
        return (
            <section>
                <h1>Ticket not found</h1>
                <p>The requested ticket does not exist.</p>
            </section>
        )
    }

    return (
    <section className={styles.page}>
        <header className={styles.header}>
            <div>
                <h1 className={styles.title}>{ticket.title}</h1>
                <p className={styles.ticketId}>Ticket #{ticket.id}</p>
            </div>

            <div className={styles.actions}>
                <Link
                    to="/tickets"
                    className={styles.backLink}
                >
                    Back to Tickets
                </Link>

                <Link
                    to={`/tickets/${ticket.id}/edit`}
                    className={styles.editLink}
                >
                    Edit Ticket
                </Link>
            </div>
        </header>

        <article className={styles.card}>
            <h2 className={styles.sectionTitle}>
                Ticket Information
            </h2>

            <dl className={styles.details}>
                <div className={styles.detailItem}>
                    <dt className={styles.detailLabel}>Status</dt>
                    <dd className={styles.detailValue}>
                        <TicketBadge
                            kind="status"
                            value={ticket.status}
                        />
                    </dd>
                </div>

                <div className={styles.detailItem}>
                    <dt className={styles.detailLabel}>Priority</dt>
                    <dd className={styles.detailValue}>
                        <TicketBadge
                            kind="priority"
                            value={ticket.priority}
                        />
                    </dd>
                </div>
            </dl>

            <h2 className={styles.sectionTitle}>Description</h2>

            <p className={styles.description}>
                {ticket.description}
            </p>
        </article>
    </section>
)
}