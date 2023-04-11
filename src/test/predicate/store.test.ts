import * as store from '$lib/predicate/store';
import type { Computed, Ref } from '$lib/types';
import type { Writable } from 'svelte/store';
import { computed, ref } from '$lib/utils';
import { derived, readable, writable } from 'svelte/store';

describe('isComputed', () => {
	const { isComputed } = store;
	it('Should return whether or not the given value is a computed store', () => {
		const firstName = ref('Big');
		const fullName = computed(firstName, (name) => name + ' Ounce');
		expect(isComputed(fullName)).toBe(true);
		expect(isComputed(firstName)).toBe(false);
		expect(isComputed(writable('Big Ounce, the Prairie Dog.'))).toBe(false);
		expect(isComputed(readable('Big Ounce, the Prairie Dog.'))).toBe(false);
		expect(isComputed('Not even a store.')).toBe(false);
		expect(isComputed(420)).toBe(false);
	});

	it('Should validate each field type', () => {
		const imposter: Record<keyof Computed<any>, string> = {
			subscribe: 'Not a function.',
			value: 'Not a function.',
			$$onSet: 'Not a function.'
		};
		expect(isComputed(imposter)).toBe(false);
	});
});

describe('isStore', () => {
	const { isStore } = store;
	it('Should return whether or not the given value is store', () => {
		const count = writable(0);
		const double = derived(count, (count) => count * 2);
		const time = readable('2 days');
		const name = ref('James');
		const bigName = computed(name, (name) => name.toUpperCase());
		const stores = [count, double, time, name, bigName];
		for (const store of stores) {
			expect(isStore(store)).toBe(true);
		}
		expect(isStore(10)).toBe(false);
		expect(isStore({})).toBe(false);
		expect(isStore('Not a store')).toBe(false);
	});

	it.skip('Should verify the subscribe method is an actual function', () => {
		const theFakeOne = { subscribe: 'Definitely not a function!' };
		expect(isStore(theFakeOne)).toBe(false);
	});
});

describe('isWritable', () => {
	const { isWritable } = store;
	it('Should return whether or not the given value is store', () => {
		const count = writable(0);
		expect(isWritable(count)).toBe(true);
		const double = derived(count, (count) => count * 2);
		expect(isWritable(double)).toBe(false);
		const time = readable('2 days');
		expect(isWritable(time)).toBe(false);
		const name = ref('James');
		expect(isWritable(name)).toBe(true);
		const bigName = computed(name, (name) => name.toUpperCase());
		expect(isWritable(bigName)).toBe(false);
		expect(isWritable(10)).toBe(false);
		expect(isWritable({})).toBe(false);
		expect(isWritable('Not a store')).toBe(false);
	});

	it('Should verify each method type', () => {
		const imposter: Record<keyof Writable<any>, string> = {
			set: 'Not a function',
			subscribe: 'Not a function',
			update: 'Not a function'
		};
		expect(isWritable(imposter)).toBe(false);
	});
});
