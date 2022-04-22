import * as store from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isStore, isWritable } from '$lib/predicate';

describe('makeReadable', () => {
	const { makeReadable } = store;

	const First = writable(2);
	const Second = readable('James');
	const Third = derived([First, Second], (value) => value);

	const Write = makeReadable(First);
	const Read = makeReadable(Second);
	const Derived = makeReadable(Third);

	it('Should take a store and return a readable store', () => {
		expect(isStore(Write) && !isWritable(Write)).toBe(true);
		expect(isStore(Read) && !isWritable(Read)).toBe(true);
		expect(isStore(Derived) && !isWritable(Derived)).toBe(true);
	});

	it('Should return the original store if it is already readable', () => {
		expect(Read).toBe(Second);
		expect(Derived).toBe(Third);
	});

	it('Should store the same value after the original store changes', () => {
		First.set(200);
		expect(get(Write)).toBe(200);
		expect(get(Third)).toEqual([200, 'James']);
	});
});
