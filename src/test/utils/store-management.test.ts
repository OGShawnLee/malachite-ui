import * as store from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isStore, isWritable } from '$lib/predicate';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('computed', () => {
	const { computed, ref } = store;
	it('Should return a valid readable store', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		expect(isStore(double)).toBe(true);
	});

	describe('value()', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		it('Should have a value method', () => {
			expect(double).toHaveProperty('value');
			expect(double.value).toBeTypeOf('function');
		});

		it('Should return the current ref value', () => {
			expect(double.value()).toBe(20);
			count.set(20);
			expect(double.value()).toBe(40);
			count.set(40);
			expect(double.value()).toBe(80);
		});
	});

	it('Should compute when created', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		expect(double.value()).toBe(20);
	});

	it('Should compute when the original store value is updated', () => {
		const name = ref('Vincent');
		const fullName = computed(name, (name) => name + ' Law');
		expect(fullName.value()).toBe('Vincent Law');
		name.set('Raul');
		expect(fullName.value()).toBe('Raul Law');
		name.update((name) => name.toUpperCase());
		expect(fullName.value()).toBe('RAUL Law');
	});

	it('Should work with another computed store', () => {
		const count = ref(2);
		const double = computed(count, (count) => count * 2);
		const quadruple = computed(double, (double) => double * 2);
		expect(quadruple.value()).toBe(8);
		count.set(10);
		expect(quadruple.value()).toBe(40);
		count.update((count) => count * 2);
		expect(quadruple.value()).toBe(80);
	});
});

describe.skip('makeReadable', () => {
	const { makeReadable } = store;

	const First = writable(2);
	const Second = readable('James');
	const Third = derived([First, Second], (value) => value);

	const Write = makeReadable(First);
	const Read = makeReadable(Second);
	const Derived = makeReadable(Third);

	it.skip('Should take a store and return a readable store', () => {
		expect(isStore(Write) && !isWritable(Write)).toBe(true);
		expect(isStore(Read) && !isWritable(Read)).toBe(true);
		expect(isStore(Derived) && !isWritable(Derived)).toBe(true);
	});

	it.skip('Should return the original store if it is already readable', () => {
		expect(Read).toBe(Second);
		expect(Derived).toBe(Third);
	});

	it.skip('Should store the same value after the original store changes', () => {
		First.set(200);
		expect(get(Write)).toBe(200);
		expect(get(Third)).toEqual([200, 'James']);
	});
});

describe('ref', () => {
	const ref = store.ref;
	it('Should return a valid writable store', () => {
		const name = ref('Jack');
		expect(isWritable(name)).toBe(true);
	});

	describe('value()', () => {
		const count = ref(10);
		it('Should have a value method', () => {
			expect(count).toHaveProperty('value');
			expect(count.value).toBeTypeOf('function');
		});

		it('Should return the current ref value', () => {
			expect(count.value()).toBe(10);
			count.set(20);
			expect(count.value()).toBe(20);
			count.set(40);
			expect(count.value()).toBe(40);
		});
	});
});
