import * as store from '@predicate/store';
import { derived, readable, writable } from 'svelte/store';

describe('isStore', () => {
	const { isStore } = store;
	it('Should return true if value is a store', () => {
		const First = writable(0);
		const Second = writable(10);
		const Derived = derived([First, Second], ([first, second]) => first + second);
		const stores = [First, Second, Derived, readable(10)];
		for (const store of stores) {
			expect(isStore(store)).toBe(true);
		}
	});

	it('Should return false if value is not a store', () => {
		const values = [0, 'string', false, true, {}, [], null, undefined, () => {}];
		for (const value of values) {
			expect(isStore(value)).toBe(false);
		}
	});

	it('Should return false if the subscribe method is not an actual function', () => {
		const FakeStore = { subscribe: 'Definitely not a function!' };
		expect(isStore(FakeStore)).toBe(false);
	});
});

describe('isWritable', () => {
	const { isWritable } = store;
	it('Should return true if value is a writable store', () => {
		expect(isWritable(writable(0))).toBe(true);
	});

	it('Should return false if value is not a writable store', () => {
		expect(isWritable(readable(0))).toBe(false);
		expect(isWritable(derived(writable(0), () => {}))).toBe(false);

		const values = [0, 'string', false, true, {}, [], null, undefined, () => {}];
		for (const value of values) {
			expect(isWritable(value)).toBe(false);
		}
	});

	it("Should return false if the 'store' methods are not actual functions", () => {
		const FakeWritable = { subscribe: 'Sike!', set: 'Sike!', update: 400 };
		expect(isWritable(FakeWritable)).toBe(false);
	});
});
