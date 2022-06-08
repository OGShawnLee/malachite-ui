import type { Readable, Writable } from 'svelte/store';
import { isFunction, isInterface } from '$lib/predicate';

export function isStore(val: unknown): val is Readable<any> {
	return isInterface<Readable<any>>(val, {
		subscribe: isFunction
	});
}

export function isNotStore(val: unknown) {
	return !isStore(val);
}

export function isWritable(val: unknown): val is Writable<any> {
	return isInterface<Writable<any>>(val, {
		subscribe: isFunction,
		set: isFunction,
		update: isFunction
	});
}
