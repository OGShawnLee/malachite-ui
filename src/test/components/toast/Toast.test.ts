import "@testing-library/jest-dom"
import { Toast, ToastGroup, useToast } from '$lib'
import { Component, Fragment, Rendering } from './samples'
import { fireEvent, render, waitFor } from '@testing-library/svelte'
import { elementTagNames } from "$lib/components/render"
import { ContextParent, createContextParentRenderer, generateActions } from "@test-utils"
import { get } from "svelte/store"

const samples = [Component, Fragment]
const toast = useToast()

describe("Behaviour", () => {
    const toast = useToast(500)

    afterEach(() => toast.clear())

    describe("Toast", () => {
        it.each(samples)("Should be removed automatically after a timeout", async (Component) => {
            const { findByTestId } = render(Component, { props: { toast } })
            expect(get(toast)).toHaveLength(0)

            toast.push({ message: "Purple Hex - Alone Again", type: "error" })

            const element = await findByTestId("toast")
            expect(element).toBeInTheDocument()

            await waitFor(() => expect(get(toast)).toHaveLength(0))
        })

        it.each(samples)("Should be removed automatically after the specified delay", async (Component) => {
            const toast = useToast(2_000)
            const { findByTestId } = render(Component, { props: { toast } })
            expect(get(toast)).toHaveLength(0)

            toast.push({ message: "Purple Hex - Alone Again", type: "error" })

            let element = await findByTestId("toast")
            expect(element).toBeInTheDocument()

            await waitFor(() => expect(element).not.toBeInTheDocument(), { timeout: 2_100 })
        })


        it.each(samples)("Should be able to close a toast with close()", async (Component) => {
            const { findByTestId } = render(Component, { props: { toast } })
            expect(get(toast)).toHaveLength(0)

            toast.push({ message: "Purple Hex - Alone Again", type: "error" })

            const element = await findByTestId("toast")
            const button = await findByTestId("toast-close-button")
            expect(button).toBeInTheDocument()

            await fireEvent.click(button)
            expect(get(toast)).toHaveLength(0)
            expect(element).not.toBeInTheDocument()
        })
    })

    describe("ToastStore", () => {
        it.each(samples)("Should start with no toasts", (Component) => {
            const { getAllByTestId } = render(Component, { props: { toast } })
            expect(() => getAllByTestId("toast")).toThrow()
            expect(get(toast)).toHaveLength(0)
        })

        describe("methods", () => {
            const toast = useToast(3_000)

            afterEach(() => toast.clear())

            it.each(samples)("Should be able to add a toast with push()", async (Component) => {
                const { findAllByTestId } = render(Component, { props: { toast } })
                expect(get(toast)).toHaveLength(0)

                toast.push({ message: "Purple Hex - Alone Again", type: "error" })

                let elements = await findAllByTestId("toast")
                expect(elements).toHaveLength(1)

                toast.push({ message: "Working for a Nuclear Free City - Je Suis Le Vent", type: "success" })
                await waitFor(async () => {
                    elements = await findAllByTestId("toast")
                    expect(elements).toHaveLength(2)
                })
            })

            it.each(samples)("Should be able to remove all toasts with clear()", async (Component) => {
                const { findAllByTestId, getAllByTestId } = render(Component, { props: { toast } })
                expect(get(toast)).toHaveLength(0)

                toast.push({ message: "Purple Hex - Alone Again", type: "error" })

                let elements = await findAllByTestId("toast")
                expect(elements).toHaveLength(1)
                expect(get(toast)).toHaveLength(1)

                toast.push({ message: "Working for a Nuclear Free City - Je Suis Le Vent", type: "success" })
                await waitFor(async () => {
                    elements = await findAllByTestId("toast")
                    expect(get(toast)).toHaveLength(2)
                    expect(elements).toHaveLength(2)
                })

                toast.clear();
                await waitFor(async () => {
                    expect(() => getAllByTestId("toast")).toThrow()
                    expect(get(toast)).toHaveLength(0)
                })
            })
        })
    })
})

describe("Rendering", () => {
    describe("ToastGroup", () => {
        it("Should be rendered as a div by default", () => {
            const { getByTestId } = render(ToastGroup, { props: { toast, "data-testid": "toast-group" } })
            const group = getByTestId("toast-group")
            expect(group.tagName).toBe("DIV")
        })

        it.each(elementTagNames)("Should be rendered as a %s", (tagName) => {
            const { getByTestId } = render(ToastGroup, { props: { toast, as: tagName, "data-testid": "toast-group" } })
            const group = getByTestId("toast-group")
            expect(group.tagName).toBe(tagName.toUpperCase())
        })

        it("Should be able of forwarding attributes", () => {
            const attributes = { tabIndex: "4", title: "an amazing toast-group", "data-testid": "toast-group" }
            const { getByTestId } = render(ToastGroup, { props: { toast, ...attributes } })
            const group = getByTestId("toast-group")
            for (const [attr, value] of Object.entries(attributes)) {
                expect(group).toHaveAttribute(attr, value)
            }
        })

        it("Should be able of forwarding actions", () => {
            const actions = generateActions(3)
            const { getByTestId } = render(ToastGroup, {
                props: {
                    toast, use: actions, "data-testid": "toast-group"
                }
            })
            const group = getByTestId("toast-group")
            for (const action of actions) {
                expect(action).toBeCalledWith(group)
            }
        })
    })

    describe("Toast", () => {
        it("Should be rendered as a div by default", () => {
            const { getByTestId } = render(Rendering)
            const toast = getByTestId("toast")
            expect(toast.tagName).toBe("DIV")
        })

        it.each(elementTagNames)("Should be rendered as a %s", (tagName) => {
            const { getByTestId } = render(Rendering, { props: { toast: { as: tagName } } })
            const toast = getByTestId("toast")
            expect(toast.tagName).toBe(tagName.toUpperCase())
        })

        it("Should be able of forwarding attributes", () => {
            const attributes = { tabIndex: "4", title: "an amazing toast" }
            const { getByTestId } = render(Rendering, { props: { toast: { rest: attributes } } })
            const toast = getByTestId("toast")
            for (const [attr, value] of Object.entries(attributes)) {
                expect(toast).toHaveAttribute(attr, value)
            }
        })

        it("Should be able of forwarding actions", () => {
            const actions = generateActions(3)
            const { getByTestId } = render(Rendering, {
                props: { toast: { use: actions } }
            })
            const toast = getByTestId("toast")
            for (const action of actions) {
                expect(action).toBeCalledWith(toast)
            }
        })
    })

    describe("Context", () => {
        const [init, messages] = createContextParentRenderer(ContextParent, "toast-group")


        describe("Unset Context", () => {
            it("Should throw if used outside of a ToastGroup", () => {
                expect(() => render(Toast)).toThrow()
            })

            it("Should throw an specific error", () => {
                expect(() => render(Toast)).toThrow(messages.unset)
            })
        })

        describe("Invalid Context", () => {
            it("Should throw if given an invalid context", () => {
                expect(() => init(Toast, null)).toThrow()
            })

            it("Should throw an specific error", () => {
                expect(() => init(Toast, null)).toThrow(messages.invalid)
            })
        })
    })
})