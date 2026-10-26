import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useTickets } from "./useTickets"
import { tickets as initialTickets } from "../data/tickets"
import type { CreateTicketInput, Ticket } from "../types/Ticket"

const STORAGE_KEY = "supportdesk:tickets"
const NEXT_ID_STORAGE_KEY = "supportdesk:nextTicketId"

const makeTicket = (
    overrides: Record<string, unknown> = {},
): Ticket =>
    ({
        id: 101,
        title: "Login issue",
        description: "Cannot log in to the application",
        status: "open",
        priority: "high",
        category: "technical",
        createdAt: "2026-01-10T10:00:00.000Z",
        updatedAt: null,
        comments: [],
        ...overrides,
    }) as Ticket

const makeInput = (
    overrides: Partial<CreateTicketInput> = {},
): CreateTicketInput => ({
    title: "New ticket",
    description: "A new support request",
    priority: "medium",
    category: "general",
    ...overrides,
})

const saveStoredTickets = (tickets: unknown) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
}

describe("useTickets", () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        vi.unstubAllGlobals()
        localStorage.clear()
    })

    describe("initialization and localStorage", () => {
        it("uses initial tickets when localStorage is empty", () => {
            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual(initialTickets)
            expect(localStorage.getItem(STORAGE_KEY)).toBe(
                JSON.stringify(initialTickets),
            )
        })

        it("loads valid tickets from localStorage", () => {
            const storedTicket = makeTicket()
            saveStoredTickets([storedTicket])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toHaveLength(1)
            expect(result.current.tickets[0]).toMatchObject(storedTicket)
        })

        it("uses initial tickets when stored JSON is invalid", () => {
            localStorage.setItem(STORAGE_KEY, "{invalid json")

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual(initialTickets)
        })

        it("uses initial tickets when stored data is not an array", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: 101 }))

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual(initialTickets)
        })

        it("returns an empty list when an empty array is stored", () => {
            saveStoredTickets([])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual([])
        })

        it.each([
            ["null", null],
            ["an array instead of an object", []],
            ["a string", "invalid"],
            ["a number", 42],
        ])("rejects a stored ticket whose value is %s", (_label, value) => {
            saveStoredTickets([value])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual([])
        })

        it.each([
            ["a string ID", { id: "101" }],
            ["a zero ID", { id: 0 }],
            ["a negative ID", { id: -1 }],
            ["an unsafe integer ID", { id: Number.MAX_SAFE_INTEGER + 1 }],
            ["a non-string title", { title: 123 }],
            ["a non-string description", { description: null }],
            ["an invalid status", { status: "pending" }],
            ["an invalid priority", { priority: "urgent" }],
        ])("rejects a stored ticket with %s", (_label, overrides) => {
            saveStoredTickets([makeTicket(overrides)])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual([])
        })

        it("rejects a ticket with a fractional ID", () => {
            saveStoredTickets([makeTicket({ id: 101.5 })])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toEqual([])
        })

        it("keeps valid tickets and skips invalid records in the same array", () => {
            saveStoredTickets([
                makeTicket(),
                null,
                makeTicket({ id: 0 }),
                makeTicket({ id: 102, status: "unknown" }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets.map((ticket) => ticket.id)).toEqual([
                101,
            ])
        })

        it("keeps only the first valid ticket for each ID", () => {
            const firstTicket = makeTicket({
                id: 101,
                title: "First ticket",
            })

            const duplicateTicket = makeTicket({
                id: 101,
                title: "Duplicate ticket",
            })

            const secondTicket = makeTicket({
                id: 102,
                title: "Second ticket",
            })

            saveStoredTickets([
                firstTicket,
                duplicateTicket,
                secondTicket,
            ])

            const { result } = renderHook(() => useTickets())

            expect(
                result.current.tickets.map(({ id, title }) => ({
                    id,
                    title,
                }))
            ).toEqual([
                { id: 101, title: "First ticket" },
                { id: 102, title: "Second ticket" },
            ])

            expect(
                JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
            ).toEqual(result.current.tickets)
        })

        it("does not reserve an ID for an invalid stored ticket", () => {
            saveStoredTickets([
                makeTicket({
                    id: 101,
                    status: "invalid-status",
                }),
                makeTicket({
                    id: 101,
                    title: "Valid ticket",
                }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets).toHaveLength(1)
            expect(result.current.tickets[0].id).toBe(101)
            expect(result.current.tickets[0].title).toBe("Valid ticket")
        })

        it("normalizes valid dates and replaces invalid dates with null", () => {
            saveStoredTickets([
                makeTicket({
                    createdAt: "2026-01-10T13:00:00+03:00",
                    updatedAt: "not-a-date",
                }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].createdAt).toBe(
                "2026-01-10T10:00:00.000Z",
            )
            expect(result.current.tickets[0].updatedAt).toBeNull()
        })

        it("uses null when a stored date is not a string", () => {
            saveStoredTickets([
                makeTicket({
                    createdAt: 123,
                    updatedAt: {},
                }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].createdAt).toBeNull()
            expect(result.current.tickets[0].updatedAt).toBeNull()
        })

        it("defaults an invalid category to general", () => {
            saveStoredTickets([
                makeTicket({ category: "unknown-category" }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].category).toBe("general")
        })

        it.each([
            "technical",
            "billing",
            "account",
            "general",
        ])("preserves the valid category %s", (category) => {
            saveStoredTickets([makeTicket({ category })])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].category).toBe(category)
        })

        it("migrates legacy tickets without category, dates and comments", () => {
            saveStoredTickets([
                {
                    id: 101,
                    title: "Legacy ticket",
                    description: "Created using an older version",
                    status: "open",
                    priority: "medium",
                },
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0]).toMatchObject({
                id: 101,
                category: "general",
                createdAt: null,
                updatedAt: null,
                comments: [],
            })
        })

        it("uses a demo ticket's creation date when the stored date is invalid", () => {
            const demoTicket = initialTickets[0]

            if (!demoTicket) {
                throw new Error("The test requires an initial demo ticket")
            }

            saveStoredTickets([
                makeTicket({
                    id: demoTicket.id,
                    createdAt: "invalid-date",
                }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].createdAt).toBe(
                demoTicket.createdAt,
            )
        })

        it("keeps valid comments and removes invalid comments", () => {
            const validComment = {
                id: "comment-1",
                author: "Support Agent",
                content: "We are investigating",
                createdAt: "2026-01-10T11:00:00.000Z",
            }

            saveStoredTickets([
                makeTicket({
                    comments: [
                        validComment,
                        null,
                        [],
                        {
                            id: "comment-2",
                            author: "Agent",
                            content: "Missing date",
                        },
                        {
                            id: "comment-3",
                            author: "Agent",
                            content: "Invalid date",
                            createdAt: "not-a-date",
                        },
                    ],
                }),
            ])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].comments).toEqual([
                validComment,
            ])
        })

        it("defaults comments to an empty array when stored comments are not an array", () => {
            saveStoredTickets([makeTicket({ comments: "invalid" })])

            const { result } = renderHook(() => useTickets())

            expect(result.current.tickets[0].comments).toEqual([])
        })

        it("logs an error if localStorage cannot save tickets", () => {
            const error = new Error("Storage unavailable")
            const errorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => {})

            vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
                throw error
            })

            renderHook(() => useTickets())

            expect(errorSpy).toHaveBeenCalledWith(
                "Failed to save tickets:",
                error,
            )
        })
    })

    describe("createTicket", () => {
        it("creates a ticket with the expected default fields", () => {
            saveStoredTickets([])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.createTicket(makeInput())
            })

            expect(result.current.tickets).toHaveLength(1)
            expect(result.current.tickets[0]).toMatchObject({
                id: 1,
                ...makeInput(),
                status: "open",
                updatedAt: null,
                comments: [],
            })
            expect(
                Date.parse(result.current.tickets[0].createdAt ?? ""),
            ).not.toBeNaN()
        })

        it("assigns an ID greater than the highest existing ID", () => {
            saveStoredTickets([
                makeTicket({ id: 4 }),
                makeTicket({ id: 12 }),
                makeTicket({ id: 7 }),
            ])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.createTicket(makeInput())
            })

            expect(result.current.tickets.at(-1)?.id).toBe(13)
        })

        it("does not reuse an ID after deleting the highest-ID ticket", () => {
            saveStoredTickets([
                makeTicket({ id: 2 }),
                makeTicket({ id: 5 }),
            ])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.deleteTicket(5)
            })

            act(() => {
                result.current.createTicket(makeInput())
            })

            expect(result.current.tickets.at(-1)?.id).toBe(6)
        })

        it("preserves existing tickets when creating a new ticket", () => {
            const existingTicket = makeTicket()
            saveStoredTickets([existingTicket])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.createTicket(makeInput())
            })

            expect(result.current.tickets).toHaveLength(2)
            expect(result.current.tickets[0]).toEqual(existingTicket)
        })

        it("persists a newly created ticket to localStorage", () => {
            saveStoredTickets([])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.createTicket(makeInput())
            })

            expect(
                JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"),
            ).toEqual(result.current.tickets)
        })

        it("keeps the next ID after deletion and remounting", () => {
            saveStoredTickets([makeTicket({ id: 5 })])

            const { result, unmount } = renderHook(() => useTickets())

            act(() => {
                result.current.deleteTicket(5)
            })

            expect(localStorage.getItem(NEXT_ID_STORAGE_KEY)).toBe("6")

            unmount()

            const { result: reloaded } = renderHook(() => useTickets())

            act(() => {
                reloaded.current.createTicket(makeInput())
            })

            expect(reloaded.current.tickets.at(-1)?.id).toBe(6)
        })

        it("assigns different IDs when creating two tickets in one act", () => {
            saveStoredTickets([])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.createTicket(makeInput())
                result.current.createTicket(makeInput())
            })

            expect(result.current.tickets.map((ticket) => ticket.id))
                .toEqual([1, 2])
        })
    })

    describe("updateTicket", () => {
        it("updates the selected ticket and preserves its creation date", () => {
            const original = makeTicket()
            saveStoredTickets([original])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.updateTicket({
                    ...original,
                    title: "Updated title",
                    description: "Updated description",
                    createdAt: "2099-01-01T00:00:00.000Z",
                })
            })

            expect(result.current.tickets[0]).toMatchObject({
                title: "Updated title",
                description: "Updated description",
                createdAt: original.createdAt,
            })
            expect(result.current.tickets[0].updatedAt).not.toBeNull()
            expect(
                Date.parse(result.current.tickets[0].updatedAt ?? ""),
            ).not.toBeNaN()
        })

        it("does not change other tickets when updating one ticket", () => {
            const first = makeTicket({ id: 101 })
            const second = makeTicket({ id: 102, title: "Second ticket" })
            saveStoredTickets([first, second])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.updateTicket({
                    ...first,
                    title: "Updated first ticket",
                })
            })

            expect(result.current.tickets[0].title).toBe(
                "Updated first ticket",
            )
            expect(result.current.tickets[1]).toEqual(second)
        })

        it("does not add a ticket when the updated ID does not exist", () => {
            saveStoredTickets([makeTicket()])

            const { result } = renderHook(() => useTickets())
            const before = result.current.tickets

            act(() => {
                result.current.updateTicket(
                    makeTicket({ id: 999, title: "Unknown ticket" }),
                )
            })

            expect(result.current.tickets).toHaveLength(1)
            expect(result.current.tickets).toEqual(before)
        })
    })

    describe("changeTicketStatus", () => {
        it.each([
            ["open", "in-progress"],
            ["in-progress", "resolved"],
            ["resolved", "open"],
        ] as const)(
            "changes status from %s to %s",
            (oldStatus, newStatus) => {
                saveStoredTickets([
                    makeTicket({
                        status: oldStatus,
                        updatedAt: null,
                    }),
                ])

                const { result } = renderHook(() => useTickets())

                act(() => {
                    result.current.changeTicketStatus(101, newStatus)
                })

                expect(result.current.tickets[0].status).toBe(newStatus)
                expect(result.current.tickets[0].updatedAt).not.toBeNull()
            },
        )

        it("does not change updatedAt when the status is already the same", () => {
            const original = makeTicket({
                status: "open",
                updatedAt: "2026-01-09T10:00:00.000Z",
            })
            saveStoredTickets([original])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.changeTicketStatus(101, "open")
            })

            expect(result.current.tickets[0].updatedAt).toBe(
                original.updatedAt,
            )
        })

        it("does not change another ticket's status", () => {
            const first = makeTicket({ id: 101, status: "open" })
            const second = makeTicket({ id: 102, status: "resolved" })
            saveStoredTickets([first, second])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.changeTicketStatus(101, "resolved")
            })

            expect(result.current.tickets[0].status).toBe("resolved")
            expect(result.current.tickets[1].status).toBe("resolved")
            expect(result.current.tickets[1].updatedAt).toBe(second.updatedAt)
        })

        it("does not change ticket data when the ID does not exist", () => {
            const ticket = makeTicket()
            saveStoredTickets([ticket])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.changeTicketStatus(999, "resolved")
            })

            expect(result.current.tickets[0]).toEqual(ticket)
        })
    })

    describe("deleteTicket", () => {
        it("deletes the ticket with the specified ID", () => {
            saveStoredTickets([
                makeTicket({ id: 101 }),
                makeTicket({ id: 102 }),
            ])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.deleteTicket(101)
            })

            expect(result.current.tickets.map((ticket) => ticket.id)).toEqual([
                102,
            ])
        })

        it("keeps all tickets when the ID does not exist", () => {
            const ticket = makeTicket()
            saveStoredTickets([ticket])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.deleteTicket(999)
            })

            expect(result.current.tickets).toEqual([ticket])
        })

        it("persists deletion to localStorage", () => {
            saveStoredTickets([
                makeTicket({ id: 101 }),
                makeTicket({ id: 102 }),
            ])

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.deleteTicket(101)
            })

            expect(
                JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"),
            ).toEqual(result.current.tickets)
            expect(result.current.tickets).toHaveLength(1)
        })
    })

    describe("addTicketComment", () => {
        it("adds a trimmed comment with an author, ID and timestamp", () => {
            const ticket = makeTicket()
            saveStoredTickets([ticket])

            vi.stubGlobal("crypto", {
                randomUUID: vi.fn().mockReturnValue("comment-1"),
            })

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.addTicketComment(101, "  Investigating now  ")
            })

            expect(result.current.tickets[0].comments).toEqual([
                {
                    id: "comment-1",
                    author: "Support Agent",
                    content: "Investigating now",
                    createdAt: expect.any(String),
                },
            ])
            expect(
                Date.parse(
                    result.current.tickets[0].comments[0].createdAt,
                ),
            ).not.toBeNaN()
            expect(result.current.tickets[0].updatedAt).toBe(
                result.current.tickets[0].comments[0].createdAt,
            )
        })

        it.each(["", "   ", "\n\t  "])(
            "does not add a comment when the content is blank: %j",
            (content) => {
                saveStoredTickets([makeTicket()])

                const { result } = renderHook(() => useTickets())
                const before = result.current.tickets[0]

                act(() => {
                    result.current.addTicketComment(101, content)
                })

                expect(result.current.tickets[0].comments).toEqual([])
                expect(result.current.tickets[0].updatedAt).toBe(
                    before.updatedAt,
                )
            },
        )

        it("does not add a comment to a different ticket", () => {
            saveStoredTickets([
                makeTicket({ id: 101 }),
                makeTicket({ id: 102 }),
            ])

            vi.stubGlobal("crypto", {
                randomUUID: vi.fn().mockReturnValue("comment-1"),
            })

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.addTicketComment(101, "A comment")
            })

            expect(result.current.tickets[0].comments).toHaveLength(1)
            expect(result.current.tickets[1].comments).toEqual([])
        })

        it("does not add a comment when the ticket does not exist", () => {
            saveStoredTickets([makeTicket()])

            vi.stubGlobal("crypto", {
                randomUUID: vi.fn().mockReturnValue("comment-1"),
            })

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.addTicketComment(999, "A comment")
            })

            expect(result.current.tickets[0].comments).toEqual([])
        })

        it("persists added comments to localStorage", () => {
            saveStoredTickets([makeTicket()])

            vi.stubGlobal("crypto", {
                randomUUID: vi.fn().mockReturnValue("comment-1"),
            })

            const { result } = renderHook(() => useTickets())

            act(() => {
                result.current.addTicketComment(101, "Comment to persist")
            })

            const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) ?? "[]",
            ) as Ticket[]

            expect(stored[0].comments).toEqual(
                result.current.tickets[0].comments,
            )
            expect(stored[0].comments[0].content).toBe("Comment to persist")
        })
    })
})
