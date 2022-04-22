import Base from './__base.svelte';
import { useDOMTraversal } from '$lib/hooks';
import { cleanup, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';

afterEach(() => cleanup());

it('Should return all the nested elements by default', async () => {
	const { findByTestId } = render(Base);
	const container = await findByTestId('container-element');
	const elements = useDOMTraversal(container);
	expect(elements).toHaveLength(7);
});

it('Should traverse the given container', async () => {
	const { findByTestId } = render(Base);
	const nested = await findByTestId('nested-container');
	const buttons = useDOMTraversal(nested, (element) => hasTagName(element, 'button'));
	expect(buttons).toHaveLength(1);
});

describe('predicate', () => {
	it('Should return only the elements that match the given predicate', async () => {
		const { findByTestId } = render(Base);
		const container = await findByTestId('container-element');
		const buttons = useDOMTraversal(container, (element) => hasTagName(element, 'button'));
		expect(buttons).toHaveLength(3);

		const section = useDOMTraversal(container, (element) => hasTagName(element, 'section'));
		expect(section).toHaveLength(1);
	});

	it('Should pass the current element, index and the selected elements', async () => {
		const func = vi.fn<[Element, Element[]]>(() => {});
		const { findByTestId } = render(Base);
		const container = await findByTestId('container-element');
		const allElements = useDOMTraversal(container);
		useDOMTraversal(container, func);

		for (const [element, filtered] of func.mock.calls) {
			expect(allElements).toContain(element);
			expect(filtered).toEqual([]);
		}
	});
});
