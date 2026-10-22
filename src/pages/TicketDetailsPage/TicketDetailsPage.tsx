    import { Link, useParams } from "react-router-dom"
    import TicketBadge from "../../components/TicketBadge/TicketBadge"
    import TicketComments from "../../components/TicketComments/TicketComments"
    import type { Ticket } from "../../types/Ticket"
    import styles from "./TicketDetailsPage.module.css"

    type TicketDetailsPageProps = {
        tickets: Ticket[]
        onAddComment: (ticketId: number, content: string) => void
    }

    function formatTicketDate(value: string | null): string {
        if (value === null) {
            return "Unknown"
        }

        return new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value))
    }

    export default function TicketDetailsPage({
        tickets,
        onAddComment,
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

                    <div className={styles.detailItem}>
                        <dt className={styles.detailLabel}>Category</dt>
                        <dd className={`${styles.detailValue} ${styles.categoryValue}`}>
                            {ticket.category}
                        </dd>
                    </div>

                    <div className={styles.detailItem}>
                        <dt className={styles.detailLabel}>Created At</dt>
                        <dd className={styles.detailValue}>
                            {formatTicketDate(ticket.createdAt)}
                        </dd>
                    </div>

                    <div className={styles.detailItem}>
                        <dt className={styles.detailLabel}>Last Updated</dt>
                        <dd className={styles.detailValue}>
                            {ticket.updatedAt
                                ? formatTicketDate(ticket.updatedAt)
                                : "Not updated yet"}
                        </dd>
                    </div>
                </dl>

                <h2 className={styles.sectionTitle}>Description</h2>

                <p className={styles.description}>
                    {ticket.description}
                </p>
            </article>

            <TicketComments
                key={ticket.id}
                ticket={ticket}
                onAddComment={onAddComment}
            />
        </section>
    )
    }