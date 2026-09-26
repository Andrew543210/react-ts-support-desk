import StatCard from "./StatCard"

const stats = [
    { title: "Open Tickets", value: 12 },
    { title: "In Progress", value: 5 },
    { title: "Resolved", value: 38 },
]

export default function Dashboard() {
    return (
        <>
            <h2>Dashboard</h2>
            <p>Overview of your support activity.</p>
            <section className="stats-grid">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}
            </section>
        </>
    )
}