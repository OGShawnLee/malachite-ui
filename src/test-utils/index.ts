import type { Collectable } from '$lib';
import type { SpyInstance } from 'vitest';
import { destroy, generate } from '@utils';
import { useDOMTraversal } from '$lib/hooks';

export function appendChild<T extends Node>(child: T, container: Node = document.body) {
	return container.appendChild(child);
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
