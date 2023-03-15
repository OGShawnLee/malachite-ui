import type {
	Composables,
	ComposablesValues,
	Computed,
	ReadableRef,
	Ref,
	Refs,
	StoresValues
} from '$lib/types';
import type { Readable, StartStopNotifier } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import { isComputed, isReadableRef, isRef, isWritable } from '$lib/predicate';
import { onDestroy } from 'svelte';

export function computed<T extends Composables, C>(
	composables: T,
	compute: (value: ComposablesValues<T>) => C
): Computed<C> {
	const value = getComposableValue(composables);
	const store = ref(compute(value));

	let onSet: (value: C) => void = () => {};

	if (isRef(composables)) {
		const initialSet = composables.set;
		composables.set = (value) => {
			initialSet(value);
			const newValue = compute(value);
			store.set(newValue);
			onSet(newValue);
		};
		composables.update = (callback) => {
			const value = callback(composables.value());
			initialSet(value);
			const newValue = compute(value);
			store.set(newValue);
			onSet(newValue);
		};
	} else if (Array.isArray(composables)) {
		composables.forEach((composable) => {
			if (isComputed(composable)) {
				const initialSet = composable.$$onSet;
				composable.$$onSet = (value) => {
					initialSet(value);
					const values = getComposableValue(composables);
					store.set(compute(values));
				};
			} else {
				const initialSet = composable.set;
				composable.set = (value) => {
					initialSet(value);
					const values = getComposableValue(composables);
					const newValue = compute(values);
					store.set(newValue);
					onSet(newValue);
				};
				composable.update = (callback) => {
					const value = callback(composable.value());
					initialSet(value);
					const values = getComposableValue(composables);
					const newValue = compute(values);
					store.set(newValue);
					onSet(newValue);
				};
			}
		});
	} else {
		composables.$$onSet = (value) => {
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

function getComposableValue<C extends Composables>(composables: C): ComposablesValues<C> {
	if (Array.isArray(composables))
		return composables.map((composable) => composable.value()) as ComposablesValues<C>;
	return composables.value();
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
