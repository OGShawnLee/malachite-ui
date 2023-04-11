import type { Computed, ReadableRef, Ref } from '$lib/types';
import type { Readable, Writable } from 'svelte/store';
import { ElementBinder, ElementLabel } from '$lib/core';
import { isFunction, isInterface } from '$lib/predicate';

export function isComputed(value: unknown): value is Computed<any> {
	return isInterface<Computed<any>>(value, {
		subscribe: isFunction,
		value: isFunction,
		$$onSet: isFunction
	});
}

export function isElementBinder(value: unknown): value is ElementBinder {
	return value instanceof ElementBinder;
}

export function isElementLabel(value: unknown): value is ElementLabel {
	return value instanceof ElementLabel;
}

export function isStore(val: unknown): val is Readable<any> {
	return isInterface<Readable<any>>(val, {
		subscribe: isFunction
	});
}

export function isNotStore(val: unknown) {
	return !isStore(val);
}

export function isReadableRef(value: unknown): value is ReadableRef<any> {
	return isInterface<ReadableRef<any>>(value, {
		subscribe: isFunction,
		value: isFunction
	});
}

export function isRef(value: unknown): value is Ref<any> {
	return isInterface<Ref<any>>(value, {
		set: isFunction,
		subscribe: isFunction,
		update: isFunction,
		value: isFunction
	});
}

export function isWritable(val: unknown): val is Writable<any> {
	return isInterface<Writable<any>>(val, {
		subscribe: isFunction,
		set: isFunction,
		update: isFunction
	});
}
