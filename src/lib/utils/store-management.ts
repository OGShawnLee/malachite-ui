import type {
	ReadableRef,
	ReadableWrapper,
	Ref,
	Refs,
	StoresValues,
	SyncFunction,
	WritableWrapper
} from '$lib/types';
import type { Readable, StartStopNotifier, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { isReadableRef, isStore, isWritable } from '$lib/predicate';
import { notifiable } from '$lib/stores';
import { onDestroy } from 'svelte';

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

export function createReadableRef<T>(ref: Ref<T>): ReadableRef<T> {
	return {
		subscribe: ref.subscribe,
		get value() {
			return ref.value;
		}
	};
}

export function createDerivedRef<R extends Refs, T>(
	ref: R,
	fn: (ref: StoresValues<R>) => T,
	watch = true
): ReadableRef<T> {
	const store = derived(ref, fn);
	let value = fn(getRefValue(ref));
	if (watch) {
		const free = store.subscribe((val) => (value = val));
		onDestroy(free);
	}
	return {
		subscribe: store.subscribe,
		get value() {
			if (watch) return value;
			return fn(getRefValue(ref));
		}
	};
}

function getRefValue<R extends Refs>(refs: R): StoresValues<R> {
	if (isReadableRef(refs)) return refs.value;
	return refs.map((ref) => ref.value) as StoresValues<R>;
}

export function makeReadable<T>(Store: Readable<T>) {
	return isWritable(Store) ? (derived(Store, (value) => value) as Readable<T>) : Store;
}

export function ref<T>(initialValue: T, start?: StartStopNotifier<T>): Ref<T> {
	const store = writable(initialValue, start);
	return {
		subscribe: store.subscribe,
		get value() {
			return initialValue;
		},
		set value(value: T) {
			initialValue = value;
			store.set(initialValue);
		},
		set(value: T) {
			initialValue = value;
			store.set(initialValue);
		},
		update(callback: (currentValue: T) => T) {
			initialValue = callback(initialValue);
			store.set(initialValue);
		}
	};
}
