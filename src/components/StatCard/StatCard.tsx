import styles from "./StatCard.module.css"

type StatCardProps = {
    title: string
    value: number
}

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <article className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.value}>{value}</p>
        </article>
    )
}