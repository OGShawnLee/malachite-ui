import type { ReadableRef } from '$lib/types';
import type { Unsubscriber } from 'svelte/store';
import { createDerivedRef } from '$lib/utils';
import { ref } from '$lib/utils';

interface Settings {
	entries?: boolean;
	keys?: boolean;
	values?: boolean;
}

export default class Hashable<K, V> {
	readonly hash = ref(new Map<K, V>());
	readonly entries: ReadableRef<[K, V][]>;
	readonly keys: ReadableRef<K[]>;
	readonly values: ReadableRef<V[]>;

	constructor(watch?: Settings) {
		this.entries = createDerivedRef(
			this.hash,
			(hash) => {
				return [...hash.entries()];
			},
			watch?.entries
		);
		this.keys = createDerivedRef(
			this.hash,
			(hash) => {
				return [...hash.keys()];
			},
			watch?.keys
		);
		this.values = createDerivedRef(
			this.hash,
			(hash) => {
				return [...hash.values()];
			},
			watch?.values
		);
	}

	get subscribe() {
		return this.hash.subscribe;
	}

	get size() {
		return this.hash.value().size;
	}

	clear(this: Hashable<K, V>) {
		this.hash.update((hash) => {
			return hash.clear(), hash;
		});
	}

	delete(this: Hashable<K, V>, key: K) {
		let isDeleted = this.has(key);
		this.hash.update((hash) => {
			return hash.delete(key), hash;
		});
		return isDeleted;
	}

	destroy(this: Hashable<K, V>, key: K): Unsubscriber {
		return () => this.delete(key);
	}

	get(this: Hashable<K, V>, key: K) {
		return this.hash.value().get(key);
	}

	getSafe(this: Hashable<K, V>, key: K) {
		if (this.has(key)) return this.get(key) as V;
		throw new Error(`Unable to Get ${key}`);
	}

	has(this: Hashable<K, V>, key: K) {
		return this.hash.value().has(key);
	}

	set(this: Hashable<K, V>, key: K, value: V) {
		this.hash.update((hash) => hash.set(key, value));
		return this.hash.value().size;
	}

	update(this: Hashable<K, V>, key: K, callback: (value: V) => V) {
		this.hash.update((hash) => {
			const value = hash.get(key);
			return value ? hash.set(key, callback(value)) : hash;
		});
	}
}
