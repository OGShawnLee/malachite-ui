import { isFunction } from '$lib/predicate';

export function everyWithIndex<T>(
	arr: T[],
	predicate: (item: T, index: number, self: T[]) => unknown
): [boolean, number] {
	for (let index = 0; index < arr.length; index++) {
		const element = arr[index];
		if (!predicate(element, index, arr)) return [false, index];
	}

	return [true, -1];
}

export function findIndex<T>(
	array: T[],
	predicate: (val: T, index: number, self: T[]) => unknown,
	index = 0
) {
	for (index; index < array.length; index++) {
		const element = array[index];
		if (predicate(element, index, array)) return index;
	}

	return -1;
}

export function findLastIndex<T>(
	array: T[],
	predicate: (val: T, index: number, self: T[]) => unknown,
	index = array.length - 1
) {
	for (index; index >= 0; index--) {
		const element = array[index];
		if (predicate(element, index, array)) return index;
	}

	return -1;
}

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
