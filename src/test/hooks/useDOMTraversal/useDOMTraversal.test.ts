import Base from './__base.svelte';
import { useDOMTraversal } from '$lib/hooks';
import { render } from '@testing-library/svelte';
import { hasTagName, isHTMLElement } from '$lib/predicate';

it("Should take an element and return its children", () => {
	const { getByTestId } = render(Base);
	const container = getByTestId('container');
	const elements = useDOMTraversal(container);
	expect(elements).toHaveLength(7);
	const innerContainer = getByTestId('inner-container');
	const innerElements = useDOMTraversal(innerContainer)
	expect(innerElements).toHaveLength(2)
})

it('Should include the element', () => {
	const { getByTestId } = render(Base);
	const container = getByTestId('container');
	const elements = useDOMTraversal(container);
	expect(elements.includes(container)).toBe(true);
	const innerContainer = getByTestId('inner-container');
	const innerElements = useDOMTraversal(innerContainer);
	expect(innerElements.includes(innerContainer)).toBe(true);
});

it("Should only return HTMLElements", () => {
	const { getByTestId } = render(Base);
	const container = getByTestId('container');
	const elements = useDOMTraversal(container);
	for (const child of elements) {
		expect(isHTMLElement(child)).toBe(true)
	}
})

describe("predicate", () => {
	it("Should take a predicate function that decides which children are returned", () => {
		const { getByTestId } = render(Base)
		const container = getByTestId("container")
		const buttons = useDOMTraversal(container, child => hasTagName(child, "button"))
		expect(buttons).toHaveLength(3)
		const section = useDOMTraversal(container, child => hasTagName(child, "section"))
		expect(section).toHaveLength(1)
		const disabledButton = useDOMTraversal(container, child => {
			return hasTagName(child, "button") && child.disabled
		})
		expect(disabledButton).toHaveLength(1)
	})

	it("Should pass the current child", () => {
		const { getByTestId } = render(Base)
		const container = getByTestId('container');
		const fn = vi.fn<[HTMLElement]>(() => true)
		const children = useDOMTraversal(container, fn)
		for (const [child] of fn.mock.calls) {
			expect(children).toContain(child)
		}
	})
})
