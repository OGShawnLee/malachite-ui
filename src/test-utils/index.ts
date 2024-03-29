import type { Updater } from 'svelte/store';
import type { Collectable } from '$lib/types';
import { destroy, generate, ref } from '$lib/utils';
import { useDOMTraversal } from '$lib/hooks';
import { isAround, isHTMLElement } from '$lib/predicate';
import { derived, writable } from 'svelte/store';

export {
	default as ContextParent,
	createContextParentRenderer,
	renderContextParentComponent
} from './__context-parent.svelte';

export function appendChild<T extends Node>(child: T, container: Node = document.body) {
	return container.appendChild(child);
}

export function findByTestId(container: HTMLElement, testid: string) {
	return useDOMTraversal(container, element => {
		return element.getAttribute("data-testid") === testid
	})
}

export function fuseElementsName(elements: Element[]) {
	return elements.reduce((str, element) => {
		return (str + ' ' + element.id).trim();
	}, '');
}

export function generateActions<T>(amount: number) {
	return generate(amount, () => {
		return vi.fn(() => {});
	});
}

export function generateSpyFunctions<T extends any[]>(amount: number) {
	return generate(amount, () => vi.fn<T, void>(() => {}));
}

export function getAllByComponentName(
	name: string,
	options: {
		container?: HTMLElement;
		predicate?: (element: Element, elements: Element[]) => unknown;
	} = {}
) {
	const { container = document.body, predicate } = options;

	if (predicate)
		return useDOMTraversal(container, (element, elements) => {
			return isHTMLElement(element) && element.id.includes(name) && predicate(element, elements);
		}) as HTMLElement[];

	return useDOMTraversal(container, (element) => {
		return isHTMLElement(element) && element.id.includes(name);
	}) as HTMLElement[];
}

export function isValidComponentName(element: HTMLElement, component: string, child?: string) {
	if (!element.id) return false;

	const duplicates = useDOMTraversal(document.body, (node) => node.id === element.id);
	const isUnique = duplicates.length === 1;

	return isUnique && element.id.includes(component) && (child ? element.id.includes(child) : true);
}

export function useCleaner(...collectable: Collectable[]) {
	let items = [...collectable];
	return {
		add(...value: Collectable[]) {
			items.push(value);
		},
		destroy() {
			destroy(items);
			items = [];
		}
	};
}

export function useToggle(initialValue = false) {
	const Store = writable(initialValue);
	return [Store, () => Store.update((val) => !val)] as const;
}

export function useRange(initialValue: number, config: { min?: number; max?: number } = {}) {
	const initial = initialValue;
	const { min = 0, max = Infinity } = config;
	const Size = ref(initialValue);
	const Range = derived(Size, (size) => [...Array(size).keys()]);
	const { subscribe } = Range;
	return {
		subscribe,
		Range,
		Size: derived(Size, (size) => size),
		decrement() {
			if (initialValue - 1 < min) return;
			Size.update((size) => --size);
		},
		increment() {
			if (initialValue + 1 >= max) return;
			Size.update((size) => ++size);
		},
		set(size: number) {
			if (size < min) throw new Error('New Value is below the allowed minimum');
			if (size >= max) throw new Error('New Value is beyond the allowed maximum');

			Size.set(size);
		},
		update(updater: Updater<number>) {
			const newValue = updater(initialValue);
			if (isAround(newValue, { min, max })) Size.set(newValue);
		},
		reset() {
			Size.set(initial);
		}
	};
}

export function waitAWhile(timeout = 1000) {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			resolve();
		}, timeout);
	});
}
