import type { ActionComponent } from '$lib/types';
import { Bridge } from '$lib/stores';
import { isFunction, isInterface } from '$lib/predicate/core';

export function isActionComponent<T>(val: unknown): val is ActionComponent<T> {
	return isInterface<ActionComponent<T>>(val, {
		Proxy: (val): val is Bridge => val instanceof Bridge,
		action: isFunction
	});
}
