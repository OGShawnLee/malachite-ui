import { storable } from '$lib/stores';
import { isWritable, isStore } from '$lib/predicate';
import { derived, get, readable, writable } from 'svelte/store';
import { useCleaner } from '../../test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('storable', () => {
	describe('options', () => {
		describe('Store', () => {
			it('Should return a writable store if given a primitive value', () => {
				const Foo = storable({ Store: 0, initialValue: 1 });
				expect(isWritable(Foo)).toBe(true);
			});

			it('Should return the type of the given store', () => {
				const Write = storable({ Store: writable(0), initialValue: 1 });
				expect(isWritable(Write)).toBe(true);

				const Read = storable({ Store: readable('James'), initialValue: 'James' });
				expect(isStore(Read)).toBe(true);
				expect(isWritable(Read)).toBe(false);

				const Derived = derived(Read, (name) => name);
				expect(isStore(Derived)).toBe(true);
				expect(isWritable(Derived)).toBe(false);
			});
		});

		describe('initialValue', () => {
			it('Should set the initialValue if Store is nullish', () => {
				const Foo = storable({ initialValue: 4 });
				expect(get(Foo)).toBe(4);

				const Bar = storable({ Store: null, initialValue: 10 });
				expect(get(Bar)).toBe(10);
			});
		});

		it('Should not set the initialValue if Store is falsy', () => {
			const Foo = storable({ Store: '', initialValue: 'James' });
			expect(get(Foo)).toBe('');

			const Bar = storable({ Store: false, initialValue: true });
			expect(get(Bar)).toBe(false);

			const Sap = storable({ Store: 0, initialValue: 64 });
			expect(get(Sap)).toBe(0);
		});

		describe('notifier', () => {
			it('Should return a notifiable store', () => {
				const notifier = vi.fn(() => {});

				const Foo = storable({ initialValue: 0, notifier });
				Foo.set(10);
				expect(notifier).toBeCalledTimes(1);
				expect(notifier).toBeCalledWith(10);
				Foo.update((val) => val * 2);
				expect(notifier).toBeCalledTimes(2);
				expect(notifier).toBeCalledWith(20);

				const Bar = storable({ initialValue: writable(0), notifier });
				Bar.set(20);
				expect(notifier).toBeCalledTimes(3);
				expect(notifier).toBeCalledWith(20);
				Bar.update((val) => val * 2);
				expect(notifier).toBeCalledTimes(4);
				expect(notifier).toBeCalledWith(40);
			});

			it('Should work if given a writable store', () => {
				const notifier = vi.fn(() => {});
				const Foo = storable({ Store: writable('Mongolia'), initialValue: 'Korea', notifier });
				Foo.set('China');
				expect(notifier).toBeCalledTimes(1);
				expect(notifier).toBeCalledWith('China');
			});
		});
	});

	describe('sync', () => {
		it('Should have a sync method', () => {
			expect(storable({ initialValue: 2 })).toHaveProperty('sync');
			expect(storable({ initialValue: 2 }).sync).toBeInstanceOf(Function);
		});

		it('Should set the value if it is different to the previous one', () => {
			const Foo = storable({ initialValue: 5 });

			Foo.sync({ previous: 5, value: 10 });
			expect(get(Foo)).toBe(10);

			Foo.sync({ previous: 5, value: 5 });
			expect(get(Foo)).toBe(10);
		});

		it('Should not trigger a subscription callback if the value has not changed', () => {
			const Foo = storable({ initialValue: 5 });
			const func = vi.fn(() => {});
			add(Foo.subscribe(func));

			Foo.sync({ previous: 5, value: 5 });
			expect(get(Foo)).toBe(5);
			expect(func).toBeCalledTimes(1);
		});

		// * this may change
		it('Should not sync if value is a store', () => {
			const Foo = storable({ initialValue: 'james' });
			Foo.sync({ previous: 'james', value: writable('carlo') });
			expect(get(Foo)).toBe('james');
		});
	});
});
