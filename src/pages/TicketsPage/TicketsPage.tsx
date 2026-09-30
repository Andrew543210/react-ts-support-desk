import { useNavigate } from "react-router-dom"
import TicketList from "../../components/TicketList/TicketList"
import type { Ticket, TicketStatus } from "../../types/Ticket"

type TicketsPageProps = {
    tickets: Ticket[]
    onStatusChange: (id: number, status: TicketStatus) => void
    onDeleteTicket: (id: number) => void
}

export default function TicketsPage({
    tickets,
    onStatusChange,
    onDeleteTicket,
}: TicketsPageProps) {
    const navigate = useNavigate()

    function handleEditTicket(ticket: Ticket) {
        navigate(`/tickets/${ticket.id}/edit`)
    }

    return (
        <section>
            <h1>Tickets</h1>

            <TicketList
                tickets={tickets}
                onStatusChange={onStatusChange}
                onDeleteTicket={onDeleteTicket}
                onEditTicket={handleEditTicket}
            />
        </section>
    )
}