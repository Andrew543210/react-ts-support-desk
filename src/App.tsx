import { useTickets } from "./hooks/useTickets"
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./components/Dashboard/Dashboard"
import TicketsPage from "./pages/TicketsPage/TicketsPage"
import EditTicketPage from "./pages/EditTicketPage/EditTicketPage"
import CreateTicketPage from "./pages/CreateTicketPage/CreateTicketPage"
import styles from "./App.module.css"


function App() {
 const {
        tickets,
        createTicket,
        changeTicketStatus,
        deleteTicket,
        updateTicket,
    } = useTickets()


  return (<>
    <Header />
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={
                <Dashboard
                    tickets={tickets}
                    onStatusChange={changeTicketStatus}
                    onDeleteTicket={deleteTicket}
                />
            }
          />
          <Route
            path="/tickets"
            element={
                <TicketsPage
                    tickets={tickets}
                    onStatusChange={changeTicketStatus}
                    onDeleteTicket={deleteTicket}
                />
            }
          />
          <Route
            path="/tickets/new"
            element={
                <CreateTicketPage
                    onCreateTicket={createTicket}
                />
            }
          />
          <Route
            path="/tickets/:id/edit"
            element={
                <EditTicketPage
                    tickets={tickets}
                    onSaveTicket={updateTicket}
                 />
            }
          />
        </Routes>
      </main>
    </div>
  </>)
}

export default App