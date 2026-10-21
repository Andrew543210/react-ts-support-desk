import { NavLink } from "react-router-dom"
import styles from "./Sidebar.module.css"

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/tickets"
                    end
                    className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                    }
                >
                    Tickets
                </NavLink>

                <NavLink
                    to="/tickets/new"
                    className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                    }
                >
                    Create Ticket
                </NavLink>
            </nav>
        </aside>
    )
}