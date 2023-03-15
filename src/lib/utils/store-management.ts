import type { Computed, ReadableRef, Ref, Refs, StoresValues } from '$lib/types';
import type { Readable, StartStopNotifier } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { isReadableRef, isWritable } from '$lib/predicate';
import { onDestroy } from 'svelte';

export function computed<T, C>(
	reference: Ref<T> | Computed<T>,
	compute: (value: T) => C
): Computed<C> {
	const store = ref(compute(reference.value()));

	let onSet: (value: C) => void = () => {};

	if ('set' in reference) {
		const initialSet = reference.set;
		reference.set = (value) => {
			initialSet(value);
			const newValue = compute(value);
			store.set(newValue);
			onSet(newValue);
		};
		reference.update = (callback) => {
			const value = callback(reference.value());
			initialSet(value);
			const newValue = compute(value);
			store.set(newValue);
			onSet(newValue);
		};
	} else {
		reference.$$onSet = (value) => {
			store.set(compute(value));
		};
	}

	return {
		subscribe: store.subscribe,
		value: store.value,
		set $$onSet(callback) {
			onSet = callback;
		},
		get $$onSet() {
			return onSet;
		}
	};
}

export function createReadableRef<T>(ref: Ref<T>): ReadableRef<T> {
	return {
		subscribe: ref.subscribe,
		value: ref.value
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
		value() {
			if (watch) return value;
			return fn(getRefValue(ref));
		}
	};
}

function getRefValue<R extends Refs>(refs: R): StoresValues<R> {
	if (isReadableRef(refs)) return refs.value();
	return refs.map((ref) => ref.value) as StoresValues<R>;
}

export function makeReadable<T>(Store: Readable<T>) {
	return isWritable(Store) ? (derived(Store, (value) => value) as Readable<T>) : Store;
}

export function ref<T>(globalValue: T, start?: StartStopNotifier<T>): Ref<T> {
	const store = writable(globalValue, start);
	return {
		set(value) {
			globalValue = value;
			store.set(value);
		},
		subscribe: store.subscribe,
		update(callback) {
			globalValue = callback(globalValue);
			store.set(globalValue);
		},
		value() {
			return globalValue;
		}
	};
}
