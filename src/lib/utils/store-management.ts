import type { ReadableWrapper, Ref, SyncFunction, WritableWrapper } from '$lib/types';
import type { Readable, StartStopNotifier, Writable } from 'svelte/store';
import { derived, readable, writable } from 'svelte/store';
import { isStore, isWritable } from '$lib/predicate';
import { notifiable } from '$lib/stores';

export function createStoreWrapper<T>(configuration: {
	Store?: Writable<T> | T;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}): WritableWrapper<T>;

export function createStoreWrapper<T>(configuration: {
	Store?: Readable<T> | T;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}): ReadableWrapper<T>;

export function createStoreWrapper<T>(configuration: {
	Store?: Readable<T> | T;
	initialValue: T;
	notifier?: (value: T) => void;
	start?: StartStopNotifier<T>;
}): ReadableWrapper<T> {
	const { Store, initialValue, notifier, start } = configuration;

	let FinalStore: Readable<T> = writable(initialValue, start);

	if (isStore(Store)) {
		if (isWritable(Store))
			FinalStore = notifier ? notifiable({ initialValue: Store, notifier, start }) : Store;
		else FinalStore = Store;
	} else {
		const finalInitialValue = Store ?? initialValue;
		FinalStore = notifier
			? notifiable({ initialValue: finalInitialValue, notifier, start })
			: writable(finalInitialValue, start);
	}

	const sync: SyncFunction<T> = ({ current, previous }) => {
		if (isStore(current) || !isWritable(FinalStore)) return;
		if (current !== previous) FinalStore.set(current);
	};

	return { ...FinalStore, sync };
}

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
