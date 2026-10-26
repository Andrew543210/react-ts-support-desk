import { useNavigate, useParams } from "react-router-dom"
import TicketForm from "../../components/TicketForm/TicketForm"
import type { Ticket } from "../../types/Ticket"

type EditTicketPageProps = {
    tickets: Ticket[]
    onSaveTicket: (ticket: Ticket) => boolean
}

export default function EditTicketPage({
    tickets,
    onSaveTicket,
}: EditTicketPageProps) {

    const navigate = useNavigate()
    const { id } = useParams()

    const ticketId = Number(id)

    const ticket = tickets.find((ticket) => ticket.id === ticketId)

    function handleSaveTicket(updatedTicket: Ticket) {
        const saved = onSaveTicket(updatedTicket)

        if (saved) {
            navigate("/tickets")
        }

        return saved
    }

    function handleCancelEdit() {
        navigate("/tickets")
    }

    if (!ticket) {
        return (
            <section>
                <h1>Ticket not found</h1>
            </section>
        )
    }

    return (
        <section>
            <h1>Edit Ticket</h1>

            <TicketForm
                key={ticket.id}
                mode="edit"
                editingTicket={ticket}
                onSaveTicket={handleSaveTicket}
                onCancelEdit={handleCancelEdit}
            />
        </section>
    )
}