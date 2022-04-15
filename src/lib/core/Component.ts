import type { Collectable } from '$lib';
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
