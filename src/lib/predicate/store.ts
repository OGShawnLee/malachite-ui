import type { Readable, Writable } from 'svelte/store';
import { isFunction, isObject } from '$lib/predicate';

export function isStore(val: unknown): val is Readable<unknown> {
	return isObject(val, ['subscribe']) && isFunction(val.subscribe);
}

export function isNotStore(val: unknown) {
	return !isStore(val);
}

export function isWritable(val: unknown): val is Writable<unknown> {
	return (
		isObject(val, ['subscribe', 'set', 'update']) &&
		isFunction(val.subscribe) &&
		isFunction(val.set) &&
		isFunction(val.update)
	);
}
