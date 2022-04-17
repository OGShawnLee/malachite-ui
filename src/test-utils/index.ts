import type { Updater } from 'svelte/store';
import type { Collectable } from '$lib';
import type { SpyInstance } from 'vitest';
import { destroy, generate } from '@utils';
import { useDOMTraversal } from '@hooks';
import { notifiable } from '@stores';
import { isAround, isEmpty, isHTMLElement } from '@predicate';
import { derived, writable } from 'svelte/store';

export function appendChild<T extends Node>(child: T, container: Node = document.body) {
	return container.appendChild(child);
}

export function fuseElementsName(elements: Element[]) {
	return elements
		.map((element) => {
			if (isEmpty(element.id)) throw new Error('Element doest not have a valid id');
			return element.id;
		})
		.join(' ');
}

export function generateActions<T>(
	amount: number,
	parameter?: T
): [spy: SpyInstance<[HTMLElement, T], void>, argument: T][];

export function generateActions(
	amount: number
): [spy: SpyInstance<[HTMLElement, number], void>, argument: number][];

export function generateActions<T>(amount: number, parameter?: T) {
	if (parameter)
		return generate(amount, () => {
			return [vi.fn(() => {}), parameter] as unknown as [
				spy: SpyInstance<[HTMLElement, T], void>,
				argument: number
			];
		});

	return generate(amount, (parameter) => {
		return [vi.fn(() => {}), parameter] as unknown as [
			spy: SpyInstance<[HTMLElement, number], void>,
			argument: number
		];
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
	const Size = notifiable({ initialValue, notifier: (value) => (initialValue = value) });
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
