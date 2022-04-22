import { isFunction } from '$lib/predicate';

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

export function getFirstAndLast<T>(array: T[]) {
	if (array.length === 1) return [array.at(0), undefined];
	return [array.at(0), array.at(-1)] as [first: T | undefined, last: T | undefined];
}

export function makeUnique<T>(arr: T[]) {
	const set = new Set<T>();
	for (let index = 0; index < arr.length; index++) set.add(arr[index]);
	return Array.from(set);
}
