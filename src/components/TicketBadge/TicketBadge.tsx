import styles from "./TicketBadge.module.css"
import type { TicketStatus, TicketPriority } from "../../types/Ticket"

type TicketBadgeProps =
    | {
        kind: "status"
        value: TicketStatus
    }
    | {
        kind: "priority"
        value: TicketPriority
    }

export default function TicketBadge({
    kind,
    value,
}: TicketBadgeProps) {
    const label = value
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

    return (
        <span
            className={styles.badge}
            data-status={kind === "status" ? value : undefined}
            data-priority={kind === "priority" ? value : undefined}
        >
            {label}
        </span>
    )
}