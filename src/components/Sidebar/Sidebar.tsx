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
                    className={({ isActive }) =>
                        `${styles.link} ${isActive ? styles.active : ""}`
                    }
                >
                    Tickets
                </NavLink>

                <a
                    className={styles.link}
                    href="#"
                >
                    Create Ticket
                </a>
            </nav>
        </aside>
    )
}