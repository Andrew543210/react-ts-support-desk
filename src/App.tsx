import { useState } from "react"
import { tickets } from "./data/tickets"
import type { Ticket, TicketStatus } from "./types/Ticket"
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./components/Dashboard/Dashboard"
import TicketsPage from "./pages/TicketsPage/TicketsPage"
import styles from "./App.module.css"


function App() {
  const [ticketList, setTicketList] = useState(tickets)

  function handleCreateTicket(ticket: Ticket) {
        setTicketList((currentTickets) => [
            ...currentTickets,
            ticket,
        ])
    }

    function handleStatusChange(id: number, status: TicketStatus) {
        setTicketList((currentTickets) =>
            currentTickets.map((ticket) =>
                ticket.id === id
                    ? { ...ticket, status }
                    : ticket
            )
        )
    }

    function handleDeleteTicket(id: number) {
        setTicketList((currentTickets) =>
            currentTickets.filter((ticket) => ticket.id !== id)
        )
    }

    function handleSaveTicket(updatedTicket: Ticket) {
    setTicketList((currentTickets) =>
        currentTickets.map((ticket) =>
            ticket.id === updatedTicket.id
                ? updatedTicket
                : ticket
        )
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
                <Dashboard
                    tickets={ticketList}
                    onCreateTicket={handleCreateTicket}
                    onStatusChange={handleStatusChange}
                    onDeleteTicket={handleDeleteTicket}
                    onSaveTicket={handleSaveTicket}
                />
            }
          />
          <Route path="/tickets" element={<TicketsPage />} />
        </Routes>
      </main>
    </div>
  </>)
}

export default App