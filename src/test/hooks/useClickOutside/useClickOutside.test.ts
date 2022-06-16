import Sample from './__base.svelte';
import { useClickOutside } from '$lib/hooks';
import { useCleaner } from '@test-utils';
import { fireEvent, render } from '@testing-library/svelte';
import { isArray, isHTMLElement, isInterface } from '$lib/predicate';

interface CallbackContext<T extends HTMLElement | HTMLElement[]> {
	element: T;
	event: MouseEvent;
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
	const external = {
		root: result.getByTestId('external-container'),
		child: result.getByTestId('external-child')
	};
	return { ...result, container, external };
}

it('Should return a function', () => {
	const func = useClickOutside(document.createElement('div'), () => {});
	expect(func).toBeInstanceOf(Function);
	add(func);
});

it('Should call the given callback upon clicking outside of the given element', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn(() => {});
	add(useClickOutside(container.root, callback));
	await fireEvent.click(external.root);
	expect(callback).toBeCalledTimes(1);
});

it('Should not call the given callback upon clicking inside the given element', async () => {
	const { container } = initComponent();
	const callback = vi.fn(() => {});
	add(useClickOutside(container.root, callback));
	await fireEvent.click(container.root);
	expect(callback).not.toBeCalled();
});

it('Should not call the given callback upon clicking the given element children', async () => {
	const { container } = initComponent();
	const callback = vi.fn(() => {});
	add(useClickOutside(container.root, callback));
	for (const child of container.children) {
		await fireEvent.click(child);
		expect(callback).not.toBeCalled();
	}
});

it('Should pass an object: { element, event, target }: CallbackContext<HTMLElement>', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	add(useClickOutside(container.root, callback));
	await fireEvent.click(external.root);
	expect(callback).toBeCalledTimes(1);
	expect(
		isInterface<CallbackContext<HTMLElement>>(callback.mock.calls[0][0], {
			element: isHTMLElement,
			event: (val): val is MouseEvent => val instanceof MouseEvent,
			target: (val): val is EventTarget | null => val instanceof EventTarget || val === null
		})
	).toBe(true);
});

it('Should pass the element the listener was applied to', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	add(useClickOutside(container.root, callback));
	await fireEvent.click(external.root);
	expect(callback).toBeCalledTimes(1);
	expect(callback.mock.calls[0][0].element).toBe(container.root);
});

describe('Multiple Elements', () => {
	it('Should be possible to add multiple elements', async () => {
		const { container, external } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useClickOutside(container.children, callback));
		await fireEvent.click(external.root);
		expect(callback).toBeCalledTimes(1);
	});

	it('Should not call the given callback after clicking on any of the given elements', async () => {
		const { container } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useClickOutside(container.children, callback));
		for (const child of container.children) {
			await fireEvent.click(child);
			expect(callback).not.toBeCalled();
		}
	});

	it('Should pass an object: { element, event, target }: CallbackContext<HTMLElement[]>', async () => {
		const { container } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useClickOutside(container.children, callback));
		await fireEvent.click(container.root);
		expect(callback).toBeCalled();
		expect(
			isInterface<CallbackContext<HTMLElement[]>>(callback.mock.calls[0][0], {
				element: (val): val is Array<HTMLElement> => isArray(val, isHTMLElement),
				event: (val): val is MouseEvent => val instanceof MouseEvent,
				target: (val): val is EventTarget | null => val instanceof EventTarget || val === null
			})
		).toBe(true);
	});

	it('Should pass the elements the listener was applied to', async () => {
		const { container, external } = initComponent();
		const callback = vi.fn<[CallbackContext<HTMLElement[]>]>(() => {});
		add(useClickOutside(container.children, callback));
		await fireEvent.click(external.root);
		expect(callback).toBeCalledTimes(1);
		expect(callback.mock.calls[0][0].element).toBe(container.children);
	});
});

it('Should be possible to remove the listener by calling the returned function', async () => {
	const { container, external } = initComponent();
	const callback = vi.fn<[CallbackContext<HTMLElement>]>(() => {});
	const remove = useClickOutside(container.root, callback);
	await fireEvent.click(external.child);
	expect(callback).toBeCalledTimes(1);
	remove();
	await fireEvent.click(external.child);
	expect(callback).toBeCalledTimes(1);
});
