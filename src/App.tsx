import Header from "./components/Header/Header"
import Sidebar from "./components/Sidebar/Sidebar"
import Dashboard from "./components/Dashboard/Dashboard"
import styles from "./App.module.css"


function App() {
  return (<>
    <Header />
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Dashboard />
      </main>
    </div>
  </>)
}

export default App