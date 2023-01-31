import Sample from './__base.svelte';
import { useFocusOutside } from '$lib/hooks';
import { useCleaner } from '@test-utils';
import { act, render } from '@testing-library/svelte';
import { isArray, isHTMLElement, isInterface } from '$lib/predicate';

interface CallbackContext<T extends HTMLElement | HTMLElement[]> {
	element: T;
	event: FocusEvent;
	target: EventTarget | null;
}

const { add, destroy } = useCleaner();

afterEach(() => destroy());

function initComponent() {
	const result = render(Sample);
	const container = {
		root: result.getByTestId('container'),
		children: result.getAllByText(/Container Child/)
	};
	const external = result.getByText('External');
	return { ...result, container, external };
}

it.skip('Should return a function', () => {
	const func = useFocusOutside(document.createElement('div'), () => {});
	expect(func).toBeInstanceOf(Function);
	add(func);
});

it.skip('Should call the given callback upon focusing outside of the given element', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn(() => {});
	add(useFocusOutside(container.root, callback));
	await act(() => external.focus());
	expect(callback).toBeCalledTimes(1);
});

it.skip('Should not call the given callback upon focusing the given element', async () => {
	const { container } = initComponent();
	const callback = vi.fn(() => {});
	add(useFocusOutside(container.root, callback));
	await act(() => container.root.focus());
	expect(callback).not.toBeCalled();
});

it.skip('Should not call the given callback upon focusing the given element children', async () => {
	const { container } = initComponent();
	const callback = vi.fn(() => {});
	add(useFocusOutside(container.root, callback));
	for (const child of container.children) {
		await act(() => child.focus());
		expect(callback).not.toBeCalled();
	}
});

it.skip('Should pass an object: { element, event, target }: CallbackContext<HTMLElement>', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	add(useFocusOutside(container.root, callback));
	await act(() => external.focus());
	expect(callback).toBeCalledTimes(1);
	expect(
		isInterface<CallbackContext<HTMLElement>>(callback.mock.calls[0][0], {
			element: isHTMLElement,
			event: (val): val is FocusEvent => val instanceof FocusEvent,
			target: (val): val is EventTarget | null => val instanceof EventTarget || val === null
		})
	).toBe(true);
});

it.skip('Should pass the element the listener was applied to', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	add(useFocusOutside(container.root, callback));
	await act(() => external.focus());
	expect(callback).toBeCalledTimes(1);
	expect(callback.mock.calls[0][0].element).toBe(container.root);
});

describe.skip('Multiple Elements', () => {
	it.skip('Should be possible to add multiple elements', async () => {
		const { container, external } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useFocusOutside(container.children, callback));
		await act(() => external.focus());
		expect(callback).toBeCalledTimes(1);
	});

	it.skip('Should not call the given callback after clicking on any of the given elements', async () => {
		const { container } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useFocusOutside(container.children, callback));
		for (const child of container.children) {
			await act(() => child.focus());
			expect(callback).not.toBeCalled();
		}
	});

	it.skip('Should pass an object: { element, event, target }: CallbackContext<HTMLElement[]>', async () => {
		const { container } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useFocusOutside(container.children, callback));
		await act(() => container.root.focus());
		expect(callback).toBeCalled();
		expect(
			isInterface<CallbackContext<HTMLElement[]>>(callback.mock.calls[0][0], {
				element: (val): val is Array<HTMLElement> => isArray(val, isHTMLElement),
				event: (val): val is FocusEvent => val instanceof FocusEvent,
				target: (val): val is EventTarget | null => val instanceof EventTarget || val === null
			})
		).toBe(true);
	});

	it.skip('Should pass the elements the listener was applied to', async () => {
		const { container, external } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useFocusOutside(container.children, callback));
		await act(() => external.focus());
		expect(callback).toBeCalledTimes(1);
		expect(callback.mock.calls[0][0].element).toBe(container.children);
	});
});

it.skip('Should be possible to remove the listener by calling the returned function', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	const remove = useFocusOutside(container.root, callback);
	await act(() => external.focus());
	expect(callback).toBeCalledTimes(1);
	remove();
	await act(() => external.focus());
	expect(callback).toBeCalledTimes(1);
});
