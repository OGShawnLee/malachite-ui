import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import { isWritable } from '$lib/predicate';

export function makeReadable<T>(Store: Readable<T>) {
	return isWritable(Store) ? (derived(Store, (value) => value) as Readable<T>) : Store;
}
