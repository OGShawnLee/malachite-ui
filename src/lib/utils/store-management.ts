import type { Ref } from '$lib/types';
import type { Readable } from 'svelte/store';
import { derived, readable } from 'svelte/store';
import { isWritable } from '$lib/predicate';

export function makeReadable<T>(Store: Readable<T>) {
	return isWritable(Store) ? (derived(Store, (value) => value) as Readable<T>) : Store;
}

export function ref<T>(initialValue: T, Store = readable(initialValue)): Ref<T> {
	return {
		get value() {
			return initialValue;
		},
		listen(onChange) {
			return onChange
				? Store.subscribe((value) => onChange((initialValue = value)))
				: Store.subscribe((value) => (initialValue = value));
		}
	};
}
