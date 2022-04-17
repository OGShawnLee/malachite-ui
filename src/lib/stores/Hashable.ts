import type { Readable, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';

export class Hashable<K, V> {
	protected readonly Hash: Writable<Map<K, V>>;
	protected readonly hash: Map<K, V>;

	readonly Keys: Readable<K[]>;
	readonly Entries: Readable<[K, V][]>;
	readonly Values: Readable<V[]>;
	constructor() {
		this.hash = new Map();
		this.Hash = writable(this.hash);

		this.Entries = derived(this.Hash, (hash) => Array.from(hash.entries()));
		this.Keys = derived(this.Hash, (hash) => Array.from(hash.keys()));
		this.Values = derived(this.Hash, (hash) => Array.from(hash.values()));
	}

	get subscribe() {
		return this.Hash.subscribe;
	}

	add(this: Hashable<K, V>, key: K, value: V) {
		const duplicate = this.has(key);
		if (duplicate) throw new Error('Unable to Add Item: Duplicate');

		const index = this.hash.size;
		this.Hash.update((hash) => hash.set(key, value));
		return { index, value, destroy: this.destroy(key) };
	}

	clear(this: Hashable<K, V>) {
		this.Hash.update((hash) => {
			return hash.clear(), hash;
		});
	}

	delete(this: Hashable<K, V>, key: K) {
		if (this.has(key)) {
			this.Hash.update((hash) => (hash.delete(key), hash));
			return true;
		}

		return false;
	}

	destroy(this: Hashable<K, V>, key: K) {
		return () => this.delete(key);
	}

	get(this: Hashable<K, V>, key: K) {
		return this.hash.get(key);
	}

	has(this: Hashable<K, V>, key: K) {
		return this.hash.has(key);
	}

	push(this: Hashable<number, V>, value: V) {
		const index = this.size;
		return this.add(index, value);
	}

	set(key: K, value: V) {
		this.Hash.update((hash) => {
			return hash.set(key, value);
		});
	}

	get size() {
		return this.hash.size;
	}

	update(this: Hashable<K, V>, key: K, callback: (item: V) => V) {
		if (this.has(key)) {
			this.Hash.update((hash) => {
				const item = hash.get(key);
				return item ? hash.set(key, callback(item)) : hash;
			});
		} else throw new Error('Unable to Update Item: Not Found');
	}
}
