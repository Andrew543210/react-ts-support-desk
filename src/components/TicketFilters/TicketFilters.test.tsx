import { render, screen, fireEvent } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import TicketFilters from "./TicketFilters"
import type {
    StatusFilter,
    PriorityFilter,
    CategoryFilter,
    TicketSort,
} from "../../types/Ticket"

const defaultProps = {
    searchTerm: "",
    statusFilter: "all" as StatusFilter,
    priorityFilter: "all" as PriorityFilter,
    categoryFilter: "all" as CategoryFilter,
    sortOrder: "newest" as TicketSort,
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onPriorityChange: vi.fn(),
    onCategoryChange: vi.fn(),
    onSortChange: vi.fn(),
}

function renderFilters() {
    const props = {
        ...defaultProps,
        onSearchChange: vi.fn(),
        onStatusChange: vi.fn(),
        onPriorityChange: vi.fn(),
        onCategoryChange: vi.fn(),
        onSortChange: vi.fn(),
    }

    render(<TicketFilters {...props} />)

    return props
}

describe("TicketFilters", () => {
    it("renders all five filter controls", () => {
        renderFilters()

        expect(screen.getByRole("textbox", { name: "Search:" })).toBeInTheDocument()
        expect(screen.getByRole("combobox", { name: "Filter by Status:" })).toBeInTheDocument()
        expect(screen.getByRole("combobox", { name: "Filter by Priority:" })).toBeInTheDocument()
        expect(screen.getByRole("combobox", { name: "Filter by Category:" })).toBeInTheDocument()
        expect(screen.getByRole("combobox", { name: "Sort by:" })).toBeInTheDocument()
    })

    it("displays the supplied current values", () => {
        render(
            <TicketFilters
                {...defaultProps}
                searchTerm="login"
                statusFilter="in-progress"
                priorityFilter="high"
                categoryFilter="technical"
                sortOrder="priority-high"
            />,
        )

        expect(screen.getByRole("textbox", { name: "Search:" })).toHaveValue("login")
        expect(screen.getByRole("combobox", { name: "Filter by Status:" })).toHaveValue("in-progress")
        expect(screen.getByRole("combobox", { name: "Filter by Priority:" })).toHaveValue("high")
        expect(screen.getByRole("combobox", { name: "Filter by Category:" })).toHaveValue("technical")
        expect(screen.getByRole("combobox", { name: "Sort by:" })).toHaveValue("priority-high")
    })

    it("shows the search placeholder", () => {
        renderFilters()

        expect(screen.getByPlaceholderText("Search tickets...")).toBeInTheDocument()
    })

    it("calls onSearchChange with the entered search term", () => {
        const props = renderFilters()
        const searchInput = screen.getByRole("textbox", { name: "Search:" })

        fireEvent.change(searchInput, { target: { value: "payment issue" } })

        expect(props.onSearchChange).toHaveBeenCalledExactlyOnceWith("payment issue")
    })

    it("calls onSearchChange when the search is cleared", () => {
    const onSearchChange = vi.fn()

    render(
        <TicketFilters
            {...defaultProps}
            searchTerm="login"
            onSearchChange={onSearchChange}
        />,
    )

    const searchInput = screen.getByRole("textbox", { name: "Search:" })

    fireEvent.change(searchInput, { target: { value: "" } })

    expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("")
})

    it.each([
        ["all", "All Statuses"],
        ["open", "Open"],
        ["in-progress", "In Progress"],
        ["resolved", "Resolved"],
    ] as const)("provides the %s status option", (value, label) => {
        renderFilters()

        expect(
            screen.getByRole("option", { name: label }),
        ).toHaveValue(value)
    })

    it.each(["all", "open", "in-progress", "resolved"] as const)(
        "calls onStatusChange with %s",
        (status) => {
            const props = renderFilters()

            fireEvent.change(screen.getByRole("combobox", { name: "Filter by Status:" }), {
                target: { value: status },
            })

            expect(props.onStatusChange).toHaveBeenCalledExactlyOnceWith(status)
        },
    )

    it.each([
        ["all", "All Priorities"],
        ["low", "Low"],
        ["medium", "Medium"],
        ["high", "High"],
    ] as const)("provides the %s priority option", (value, label) => {
        renderFilters()

        expect(
            screen.getByRole("option", { name: label }),
        ).toHaveValue(value)
    })

    it.each(["all", "low", "medium", "high"] as const)(
        "calls onPriorityChange with %s",
        (priority) => {
            const props = renderFilters()

            fireEvent.change(screen.getByRole("combobox", { name: "Filter by Priority:" }), {
                target: { value: priority },
            })

            expect(props.onPriorityChange).toHaveBeenCalledExactlyOnceWith(priority)
        },
    )

    it.each([
        ["all", "All Categories"],
        ["technical", "Technical"],
        ["billing", "Billing"],
        ["account", "Account"],
        ["general", "General"],
    ] as const)("provides the %s category option", (value, label) => {
        renderFilters()

        expect(
            screen.getByRole("option", { name: label }),
        ).toHaveValue(value)
    })

    it.each(["all", "technical", "billing", "account", "general"] as const)(
        "calls onCategoryChange with %s",
        (category) => {
            const props = renderFilters()

            fireEvent.change(screen.getByRole("combobox", { name: "Filter by Category:" }), {
                target: { value: category },
            })

            expect(props.onCategoryChange).toHaveBeenCalledExactlyOnceWith(category)
        },
    )

    it.each([
        ["newest", "Newest first"],
        ["oldest", "Oldest first"],
        ["priority-high", "Highest priority"],
        ["priority-low", "Lowest priority"],
    ] as const)("provides the %s sorting option", (value, label) => {
        renderFilters()

        expect(
            screen.getByRole("option", { name: label }),
        ).toHaveValue(value)
    })

    it.each(["newest", "oldest", "priority-high", "priority-low"] as const)(
        "calls onSortChange with %s",
        (sortOrder) => {
            const props = renderFilters()

            fireEvent.change(screen.getByRole("combobox", { name: "Sort by:" }), {
                target: { value: sortOrder },
            })

            expect(props.onSortChange).toHaveBeenCalledExactlyOnceWith(sortOrder)
        },
    )
})
