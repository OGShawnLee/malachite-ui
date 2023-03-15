import * as store from '$lib/predicate/store';
import type { Computed, Ref } from '$lib/types';
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

describe('isComputed', () => {
	const { isRef } = store;
	it('Should return whether or not the given value is a ref store', () => {
		const firstName = ref('Big');
		const fullName = computed(firstName, (name) => name + ' Ounce');
		expect(isRef(fullName)).toBe(false);
		expect(isRef(firstName)).toBe(true);
		expect(isRef(writable('Big Ounce, the Prairie Dog.'))).toBe(false);
		expect(isRef(readable('Big Ounce, the Prairie Dog.'))).toBe(false);
		expect(isRef('Not even a store.')).toBe(false);
		expect(isRef(420)).toBe(false);
	});

	it('Should validate each field type', () => {
		const imposter: Record<keyof Ref<any>, string> = {
			subscribe: 'Not a function.',
			value: 'Not a function.',
			set: 'Not a function.',
			update: 'Not a function.'
		};
		expect(isRef(imposter)).toBe(false);
	});
});

describe.skip('isStore', () => {
	const { isStore } = store;
	it.skip('Should return true if value is a store', () => {
		const First = writable(0);
		const Second = writable(10);
		const Derived = derived([First, Second], ([first, second]) => first + second);
		const stores = [First, Second, Derived, readable(10)];
		for (const store of stores) {
			expect(isStore(store)).toBe(true);
		}
	});

	it.skip('Should return false if value is not a store', () => {
		const values = [0, 'string', false, true, {}, [], null, undefined, () => {}];
		for (const value of values) {
			expect(isStore(value)).toBe(false);
		}
	});

	it.skip('Should return false if the subscribe method is not an actual function', () => {
		const FakeStore = { subscribe: 'Definitely not a function!' };
		expect(isStore(FakeStore)).toBe(false);
	});
});

describe.skip('isWritable', () => {
	const { isWritable } = store;
	it.skip('Should return true if value is a writable store', () => {
		expect(isWritable(writable(0))).toBe(true);
	});

	it.skip('Should return false if value is not a writable store', () => {
		expect(isWritable(readable(0))).toBe(false);
		expect(isWritable(derived(writable(0), () => {}))).toBe(false);

		const values = [0, 'string', false, true, {}, [], null, undefined, () => {}];
		for (const value of values) {
			expect(isWritable(value)).toBe(false);
		}
	});

	it.skip("Should return false if the 'store' methods are not actual functions", () => {
		const FakeWritable = { subscribe: 'Sike!', set: 'Sike!', update: 400 };
		expect(isWritable(FakeWritable)).toBe(false);
	});
});
