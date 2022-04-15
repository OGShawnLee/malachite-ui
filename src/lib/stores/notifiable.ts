import type { StartStopNotifier, Updater, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { isStore } from '@predicate';

export function notifiable<T>(options: {
	initialValue: Writable<T> | T;
	notifier: (value: T) => void;
	start?: StartStopNotifier<T>;
}): Writable<T> {
	const { initialValue, notifier, start } = options;
	const { subscribe, set, update } = isStore(initialValue)
		? initialValue
		: writable(initialValue, start);
	return {
		subscribe,
		set(value: T) {
			set(value);
			notifier(value);
		},
		update(updater: Updater<T>) {
			let newValue: T;
			update((val) => (newValue = updater(val)));
			notifier(newValue!);
		}
	};
}
