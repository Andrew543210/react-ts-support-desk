import { useNavigate, useParams } from "react-router-dom"
import CreateTicketForm from "../../components/CreateTicketForm/CreateTicketForm"
import type { Ticket } from "../../types/Ticket"

type EditTicketPageProps = {
    tickets: Ticket[]
    onSaveTicket: (ticket: Ticket) => void
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
        onSaveTicket(updatedTicket)
        navigate("/tickets")
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

        <CreateTicketForm
            mode="edit"
            editingTicket={ticket}
            onSaveTicket={handleSaveTicket}
            onCancelEdit={handleCancelEdit}
        />
    </section>
)
}