import { isFunction } from '@predicate';

export function generate<T extends (index: number) => unknown>(
	length: number,
	value: T
): T extends (index: number) => infer R ? R[] : T[];

export function generate<T>(length: number, value: T): T[];

export function generate<T>(length: number, value: T) {
	const emptyArray = [...Array(length).keys()];
	if (isFunction(value)) return emptyArray.map((index) => value(index));
	return emptyArray.map(() => value);
}
