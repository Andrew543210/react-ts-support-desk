import styles from "./Header.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <div className={styles.logoMark}>S</div>
                <div className={styles.title}>SupportDesk</div>
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