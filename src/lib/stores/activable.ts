import type { Updater, Writable } from 'svelte/store';
import { storable } from '$lib/stores/storable';

export function activable(configuration: {
	Store?: Writable<boolean> | boolean;
	initialValue?: boolean;
	notifier?: Updater<boolean>;
}) {
	const { Store, initialValue = false, notifier } = configuration;
	const { subscribe, sync, update } = storable({ Store, initialValue, notifier });
	return {
		subscribe,
		sync,
		update,
		toggle(this: void) {
			update((val) => !val);
		}
	};
}

export type Activable = ReturnType<typeof activable>;
