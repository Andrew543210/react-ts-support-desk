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
    } = useTickets()

    const { showToast } = useToast()

    function handleCreateTicket(input: CreateTicketInput) {
        createTicket(input)
        showToast("Ticket created successfully")
    }

    function handleUpdateTicket(ticket: Ticket) {
        updateTicket(ticket)
        showToast("Ticket updated successfully")
    }

    function handleChangeTicketStatus(
        id: number,
        status: TicketStatus
    ) {
        changeTicketStatus(id, status)
        showToast("Ticket status updated")
    }

    function handleDeleteTicket(id: number) {
        deleteTicket(id)
        showToast("Ticket deleted successfully")
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