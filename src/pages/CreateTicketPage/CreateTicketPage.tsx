import { useNavigate } from "react-router-dom"
import CreateTicketForm from "../../components/CreateTicketForm/CreateTicketForm"
import type { Ticket } from "../../types/Ticket"

type CreateTicketPageProps = {
    onCreateTicket: (ticket: Ticket) => void
}

export default function CreateTicketPage({
    onCreateTicket,
}: CreateTicketPageProps) {
    const navigate = useNavigate()

    function handleCreateTicket(ticket: Ticket) {
        onCreateTicket(ticket)
        navigate("/tickets")
    }

    return (
        <section>
            <CreateTicketForm
                mode="create"
                onCreateTicket={handleCreateTicket}
            />
        </section>
    )
}