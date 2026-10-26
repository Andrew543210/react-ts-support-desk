import { useTickets } from "./hooks/useTickets"
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./components/Dashboard/Dashboard"
import TicketsPage from "./pages/TicketsPage/TicketsPage"
import EditTicketPage from "./pages/EditTicketPage/EditTicketPage"
import CreateTicketPage from "./pages/CreateTicketPage/CreateTicketPage"
import { useToast } from "./hooks/useToast"
import TicketDetailsPage from "./pages/TicketDetailsPage/TicketDetailsPage"
import styles from "./App.module.css"
import type { CreateTicketInput, TicketStatus, Ticket } from "./types/Ticket"


function App() {
    const {
        tickets,
        createTicket,
        changeTicketStatus,
        deleteTicket,
        updateTicket,
        addTicketComment,
    } = useTickets()

    const { showToast } = useToast()

    function reportResult(saved: boolean, successMessage: string): boolean {
        showToast(
            saved
                ? successMessage
                : "Could not save changes. Please try again."
        )
        return saved
    }

    function handleCreateTicket(input: CreateTicketInput) {
        return reportResult(
            createTicket(input),
            "Ticket created successfully"
        )
    }

    function handleUpdateTicket(ticket: Ticket) {
        return reportResult(
            updateTicket(ticket),
            "Ticket updated successfully"
        )
    }

    function handleChangeTicketStatus(
        id: number,
        status: TicketStatus
    ) {
        reportResult(
            changeTicketStatus(id, status),
            "Ticket status updated"
        )
    }

    function handleAddComment(ticketId: number, content: string) {
        return reportResult(
            addTicketComment(ticketId, content),
            "Comment added successfully"
        )
    }

    function handleDeleteTicket(id: number) {
        reportResult(
            deleteTicket(id),
            "Ticket deleted successfully"
        )
    }


  return (<>
    <Header />
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={
                <Dashboard tickets={tickets} />
            }
          />
          <Route
            path="/tickets"
            element={
                <TicketsPage
                    tickets={tickets}
                    onStatusChange={handleChangeTicketStatus}
                    onDeleteTicket={handleDeleteTicket}
                />
            }
          />
          <Route
            path="/tickets/:id"
            element={
                <TicketDetailsPage
                    tickets={tickets}
                    onAddComment={handleAddComment}
                />
            }
          />
          <Route
            path="/tickets/new"
            element={
                <CreateTicketPage
                    onCreateTicket={handleCreateTicket}
                />
            }
          />
          <Route
            path="/tickets/:id/edit"
            element={
                <EditTicketPage
                    tickets={tickets}
                    onSaveTicket={handleUpdateTicket}
                 />
            }
          />
        </Routes>
      </main>
    </div>
  </>)
}

export default App