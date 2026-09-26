import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import "./App.css"


function App() {
  return (<>
    <Header />
    <div className="app-layout">
      <Sidebar />
      <main>
        <Dashboard />
      </main>
    </div>
  </>)
}

export default App