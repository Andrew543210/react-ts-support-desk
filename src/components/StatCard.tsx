type StatCardProps = {
    title: string
    value: number
}

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <article className="stat-card">
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
        </article>
    )
}