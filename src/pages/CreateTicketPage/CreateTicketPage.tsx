import { useNavigate } from "react-router-dom"
import TicketForm from "../../components/TicketForm/TicketForm"
import type { CreateTicketInput } from "../../types/Ticket"

type CreateTicketPageProps = {
    onCreateTicket: (ticket: CreateTicketInput) => void
}

export default function CreateTicketPage({
    onCreateTicket,
}: CreateTicketPageProps) {
    const navigate = useNavigate()

    function handleCreateTicket(ticket: CreateTicketInput) {
        onCreateTicket(ticket)
        navigate("/tickets")
    }

    return (
        <section>
            <TicketForm
                mode="create"
                onCreateTicket={handleCreateTicket}
            />
        </section>
    )
}