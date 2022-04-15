import type { Readable } from 'svelte/store';

export function useDataSync<O>(data: O) {
	return function <K extends keyof O>(
		Store: Readable<O[K]>,
		key: K,
		callback?: (value: O[K]) => void
	) {
		if (callback)
			return Store.subscribe((value) => {
				data[key] = value;
				callback(value);
			});

		return Store.subscribe((value) => {
			data[key] = value;
		});
	};
}
