import * as store from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isStore, isWritable } from '$lib/predicate';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

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

describe.skip('ref', () => {
	const { ref } = store;

	it.skip('Should return a valid writable store', () => {
		const name = ref('Jack');
		expect(isWritable(name)).toBe(true);
	});

	describe.skip('#value', () => {
		it.skip('Should return the current value (getter)', () => {
			const name = ref('Jack');

			expect(name.value).toBe('Jack');
			expect(get(name)).toBe('Jack');
			name.set('Robert');
			expect(name.value).toBe('Robert');
			expect(get(name)).toBe('Robert');
			name.update((name) => name.toUpperCase());
			expect(name.value).toBe('ROBERT');
			expect(get(name)).toBe('ROBERT');
		});

		it.skip('Should set the given new value (setter)', () => {
			const name = ref('Jack');

			name.value = 'Adrian';
			expect(name.value).toBe('Adrian');
			name.value = 'Simon';
			expect(name.value).toBe('Simon');
			name.value = name.value.toUpperCase();
			expect(name.value).toBe('SIMON');
		});
	});
});
