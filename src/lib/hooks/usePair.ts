import type { Readable, Unsubscriber } from 'svelte/store';
import { derived } from 'svelte/store';

export default function usePair<T, K>(a: Readable<T>, b: Readable<K>): Readable<[T, K]>;

export default function usePair<T, K>(
	a: Readable<T>,
	b: Readable<K>,
	fn: (a: T, b: K) => void
): Unsubscriber;

export default function usePair<T, K>(a: Readable<T>, b: Readable<K>, fn?: (a: T, b: K) => void) {
	const store = derived([a, b], ([first, second]) => {
		return [first, second] as [T, K];
	});
	return fn ? store.subscribe(([a, b]) => fn(a, b)) : store;
}
