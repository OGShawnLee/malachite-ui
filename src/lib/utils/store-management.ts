import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import { isWritable } from '$lib/predicate';

export function ref<T>(initialValue: T, Store: Readable<T>) {
	return {
		get value() {
			return initialValue;
		},
		listen(onChange?: (value: T) => void) {
			return onChange
				? Store.subscribe((value) => onChange((initialValue = value)))
				: Store.subscribe((value) => (initialValue = value));
		}
	};
}

export function makeReadable<T>(Store: Readable<T>) {
	return isWritable(Store) ? (derived(Store, (value) => value) as Readable<T>) : Store;
}
