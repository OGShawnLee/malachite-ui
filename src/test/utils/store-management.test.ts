import * as store from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isFunction, isInterface, isStore, isWritable } from '$lib/predicate';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('createStoreWrapper', () => {
	const { createStoreWrapper } = store;
	describe('options', () => {
		describe('Store', () => {
			it('Should return a writable store if given a primitive value', () => {
				const Foo = createStoreWrapper({ Store: 0, initialValue: 1 });
				expect(isWritable(Foo)).toBe(true);
			});

			it('Should return the type of the given store', () => {
				const Write = createStoreWrapper({ Store: writable(0), initialValue: 1 });
				expect(isWritable(Write)).toBe(true);

				const Read = createStoreWrapper({ Store: readable('James'), initialValue: 'James' });
				expect(isStore(Read)).toBe(true);
				expect(isWritable(Read)).toBe(false);

				const Derived = derived(Read, (name) => name);
				expect(isStore(Derived)).toBe(true);
				expect(isWritable(Derived)).toBe(false);
			});
		});

		describe('initialValue', () => {
			it('Should set the initialValue if Store is nullish', () => {
				const Foo = createStoreWrapper({ initialValue: 4 });
				expect(get(Foo)).toBe(4);

				const Bar = createStoreWrapper({ Store: null, initialValue: 10 });
				expect(get(Bar)).toBe(10);
			});
		});

		it('Should not set the initialValue if Store is falsy', () => {
			const Foo = createStoreWrapper({ Store: '', initialValue: 'James' });
			expect(get(Foo)).toBe('');

			const Bar = createStoreWrapper({ Store: false, initialValue: true });
			expect(get(Bar)).toBe(false);

			const Sap = createStoreWrapper({ Store: 0, initialValue: 64 });
			expect(get(Sap)).toBe(0);
		});

		describe('notifier', () => {
			it('Should return a notifiable store', () => {
				const notifier = vi.fn(() => {});

				const Foo = createStoreWrapper({ initialValue: 0, notifier });
				Foo.set(10);
				expect(notifier).toBeCalledTimes(1);
				expect(notifier).toBeCalledWith(10);
				Foo.update((val) => val * 2);
				expect(notifier).toBeCalledTimes(2);
				expect(notifier).toBeCalledWith(20);

				const Bar = createStoreWrapper({ initialValue: 0, notifier });
				Bar.set(20);
				expect(notifier).toBeCalledTimes(3);
				expect(notifier).toBeCalledWith(20);
				Bar.update((val) => val * 2);
				expect(notifier).toBeCalledTimes(4);
				expect(notifier).toBeCalledWith(40);
			});

			it('Should work if given a writable store', () => {
				const notifier = vi.fn(() => {});
				const Foo = createStoreWrapper({
					Store: writable('Mongolia'),
					initialValue: 'Korea',
					notifier
				});
				Foo.set('China');
				expect(notifier).toBeCalledTimes(1);
				expect(notifier).toBeCalledWith('China');
			});
		});
	});

	describe('sync', () => {
		it('Should have a sync method', () => {
			expect(createStoreWrapper({ initialValue: 2 })).toHaveProperty('sync');
			expect(createStoreWrapper({ initialValue: 2 }).sync).toBeInstanceOf(Function);
		});

		it('Should set the value if it is different to the previous one', () => {
			const Foo = createStoreWrapper({ initialValue: 5 });

			Foo.sync({ previous: 5, current: 10 });
			expect(get(Foo)).toBe(10);

			Foo.sync({ previous: 5, current: 5 });
			expect(get(Foo)).toBe(10);
		});

		it('Should not trigger a subscription callback if the value has not changed', () => {
			const Foo = createStoreWrapper({ initialValue: 5 });
			const func = vi.fn(() => {});
			add(Foo.subscribe(func));

			Foo.sync({ previous: 5, current: 5 });
			expect(get(Foo)).toBe(5);
			expect(func).toBeCalledTimes(1);
		});

		// * this may change
		it('Should not sync if value is a store', () => {
			const Foo = createStoreWrapper({ initialValue: 'james' });
			Foo.sync({ previous: 'james', current: writable('carlo') });
			expect(get(Foo)).toBe('james');
		});
	});
});

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

describe('ref', () => {
	const { ref } = store;
	
	it("Should return a valid writable store", () => {
		const name = ref("Jack")
		expect(isWritable(name)).toBe(true)
	})
	
	describe("#value", () => {
		it("Should return the current value (getter)", () => {
			const name = ref("Jack")
			
			expect(name.value).toBe("Jack");
			expect(get(name)).toBe("Jack")
			name.set("Robert")
			expect(name.value).toBe("Robert");
			expect(get(name)).toBe("Robert")
			name.update(name => name.toUpperCase())
			expect(name.value).toBe("ROBERT");
			expect(get(name)).toBe("ROBERT")
		})
		
		it("Should set the given new value (setter)", () => {
			const name = ref("Jack")
			
			name.value = "Adrian"
			expect(name.value).toBe("Adrian");
			name.value = "Simon"
			expect(name.value).toBe("Simon");
			name.value = name.value.toUpperCase()
			expect(name.value).toBe("SIMON");
		})
	})
});
