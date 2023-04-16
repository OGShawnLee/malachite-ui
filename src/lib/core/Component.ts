import defineActionComponent from './defineActionComponent';
import { isNumber, isString } from '$lib/predicate';

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
