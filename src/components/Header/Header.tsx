import styles from "./Header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logoMark}>S</div>
                <h1 className={styles.title}>SupportDesk</h1>
            </div>

            <div className={styles.user}>
                <div className={styles.avatar}>A</div>

                <div className={styles.userInfo}>
                    <span className={styles.userName}>Support Agent</span>
                    <span className={styles.userRole}>Agent</span>
                </div>
            </div>
        </header>
    )
}