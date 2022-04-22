import type { Collectable } from '$lib/types';
import { Bridge } from '@stores';
import { useCollector } from '@hooks';
import { isArray, isFunction, isNumber, isString } from '@predicate';

export const LIBRARY_NAME = 'malachite';

export class Component {
	readonly name: string;
	readonly index: number;

	constructor({ component, index }: { component: string; index: number }) {
		this.index = index;
		this.name = `${LIBRARY_NAME}-${component}-${index + 1}`;
	}

	private static indexGenerator = indexGenerator;

	protected defineActionComponent = defineActionComponent;

	protected static initIndexGenerator() {
		const generate = this.indexGenerator();
		return function () {
			return generate.next().value as number;
		};
	}

	protected nameChild(options: { parent?: string; name: string; index?: number } | string) {
		if (isString(options)) return `${this.name}-${options}`;

		const { parent = this.name, name, index } = options;
		if (isNumber(index)) return `${parent}-${name}-${index + 1}`;

		return `${parent}-${name}`;
	}
}

export function defineActionComponent(Settings: {
	Bridge?: Bridge;
	onInit?: (context: { Bridge: Bridge }) => void;
	onMount: ((context: { element: HTMLElement; Bridge: Bridge }) => string) | string;
	destroy?:
		| Collectable
		| ((context: { Bridge: Bridge; element: HTMLElement; name: string }) => Collectable);
}) {
	const { Bridge: Shard = new Bridge(), onInit, onMount, destroy } = Settings;
	onInit?.({ Bridge: Shard });
	return {
		Proxy: Shard,
		action(element: HTMLElement) {
			const name = isFunction(onMount) ? onMount({ element, Bridge: Shard }) : onMount;
			return {
				destroy: useCollector({
					beforeInit: () => [Shard.onMount(element, name)],
					init: () => {
						if (isFunction(destroy)) {
							const collect = destroy({ element, name, Bridge: Shard });

							if (isArray(collect)) return collect;
							return collect ? [collect] : [];
						}

						return destroy ?? [];
					}
				})
			};
		}
	};
}

export function defineActionComponentWithParams<T>(Settings: {
	Bridge?: Bridge;
	onInit?: (context: { Bridge: Bridge }) => void;
	onMount:
		| ((context: { element: HTMLElement; parameter: T | undefined; Bridge: Bridge }) => string)
		| string;
	onUpdate?: (context: {
		element: HTMLElement;
		name: string;
		parameter: T | undefined;
		Bridge: Bridge;
	}) => void;
	destroy?:
		| Collectable
		| ((context: {
				Bridge: Bridge;
				element: HTMLElement;
				name: string;
				parameter: {
					initialValue: T | undefined;
					value: T | undefined;
				};
		  }) => Collectable);
}) {
	const { Bridge: Shard = new Bridge(), onInit, onMount, onUpdate, destroy } = Settings;
	onInit?.({ Bridge: Shard });
	return {
		Proxy: Shard,
		action(element: HTMLElement, parameter?: T) {
			const name = isFunction(onMount) ? onMount({ element, parameter, Bridge: Shard }) : onMount;
			const initialValue = parameter;
			const parameterData = { initialValue, value: parameter };
			return {
				update(parameter?: T) {
					if (onUpdate && parameter !== parameterData.value)
						onUpdate({ Bridge: Shard, element, name, parameter });

					parameterData.value = parameter;
				},
				destroy: useCollector({
					beforeInit: () => [Shard.onMount(element, name)],
					init: () => {
						if (isFunction(destroy)) {
							const collect = destroy({ Bridge: Shard, element, name, parameter: parameterData });

							if (isArray(collect)) return collect;
							return collect ? [collect] : [];
						}

						return destroy ?? [];
					}
				})
			};
		}
	};
}

export function* indexGenerator() {
	let index = 0;
	while (true) yield index++;
}

export function initIndexGenerator() {
	const generate = indexGenerator();
	return function () {
		return generate.next().value as number;
	};
}
