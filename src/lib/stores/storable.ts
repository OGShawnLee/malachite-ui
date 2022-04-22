import type { Store } from '$lib/types';
import type { Readable, StartStopNotifier, Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { notifiable } from '$lib/stores/notifiable';
import { isStore, isWritable } from '$lib/predicate';

export function storable<T>(Settings: {
	Store?: Nullable<Writable<T> | T>;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}): Store<T>;

export function storable<T>(Settings: {
	Store?: Nullable<Readable<T> | T>;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}): Store<Readable<T>>;

export function storable<T>(options: {
	Store?: Nullable<Readable<T> | Writable<T>>;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}) {
	let { Store: Original, initialValue, notifier, start } = options;

	let Store: Readable<T> = writable(initialValue, start);

	if (isStore(Original)) {
		if (isWritable(Original))
			Store = notifier ? notifiable({ initialValue: Original, notifier }) : Original;
		else Store = Original;
	} else {
		initialValue = Original ?? initialValue;
		Store = notifier
			? notifiable({ initialValue, notifier, start })
			: writable(initialValue, start);
	}

	function sync(this: void, configuration: { previous: T; value: Readable<T> | T }) {
		const { previous, value } = configuration;
		if (isStore(value)) return;
		if (isWritable(Store) && previous !== value) Store.set(value);
	}

	return { ...Store, sync };
}
