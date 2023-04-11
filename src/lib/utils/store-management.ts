import type { Composables, ComposablesValues, Computed, ReadableRef, Ref } from '$lib/types';
import type { Readable, StartStopNotifier } from 'svelte/store';
import { writable } from 'svelte/store';
import { isComputed, isRef, isReadableRef } from '$lib/predicate';

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
		const initialOnSet = composables.$$onSet;
		composables.$$onSet = (value) => {
			initialOnSet(value);
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

function getComposableValue<C extends Composables>(composables: C): ComposablesValues<C> {
	if (Array.isArray(composables))
		return composables.map((composable) => composable.value()) as ComposablesValues<C>;
	return composables.value();
}

export function readonly<T>(store: Ref<T>): ReadableRef<T>;
export function readonly<T>(store: Readable<T>): Readable<T>;

export function readonly<T>(store: Readable<T> | Ref<T>): Readable<T> | ReadableRef<T> {
	if (isReadableRef(store)) return { subscribe: store.subscribe, value: store.value };
	return { subscribe: store.subscribe };
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

export function watch<T>(composable: Computed<T> | Ref<T>, onChange: (value: T) => void) {
	if (isComputed(composable)) {
		const initialSet = composable.$$onSet;
		composable.$$onSet = (value) => {
			initialSet(value);
			onChange(value);
		};
	} else {
		const initialSet = composable.set;
		composable.set = (value) => {
			initialSet(value);
			onChange(value);
		};
		const initialUpdate = composable.update;
		composable.update = (callback) => {
			initialUpdate(callback);
			onChange(composable.value());
		};
	}
}
