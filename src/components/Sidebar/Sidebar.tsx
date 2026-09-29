import styles from "./Sidebar.module.css"

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <a
                    className={`${styles.link} ${styles.active}`}
                    href="#"
                >
                    Dashboard
                </a>

                <a
                    className={styles.link}
                    href="#"
                >
                    Tickets
                </a>

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