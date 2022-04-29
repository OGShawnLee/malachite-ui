import { type Readable, derived } from 'svelte/store';

export function usePair<F, S>(First: Readable<F>, Second: Readable<S>) {
	return derived([First, Second], ([first, second]) => {
		return [first, second] as [F, S];
	});
}
