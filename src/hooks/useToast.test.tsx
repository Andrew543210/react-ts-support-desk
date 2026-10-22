import { renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { useToast } from "./useToast"
import ToastProvider from "../components/ToastProvider/ToastProvider"

describe("useToast", () => {
    it("returns the toast context when used inside ToastProvider", () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        )

        const { result } = renderHook(() => useToast(), { wrapper })

        expect(result.current.showToast).toBeInstanceOf(Function)
    })

    it("throws an error when used outside ToastProvider", () => {
        expect(() => renderHook(() => useToast())).toThrowError(
            "useToast must be used within ToastProvider",
        )
    })
})
