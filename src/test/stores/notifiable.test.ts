import { notifiable } from '@stores';
import { isWritable } from '@predicate';
import { get, writable } from 'svelte/store';

describe('options', () => {
	describe('initialValue', () => {
		it('Should always return a writable store', () => {
			const Bar = notifiable({ initialValue: 0, notifier: () => {} });
			expect(isWritable(Bar)).toBe(true);

			const Foo = notifiable({ initialValue: writable(0), notifier: () => {} });
			expect(isWritable(Foo)).toBe(true);

			for (const Store of [Bar, Foo]) {
				const func = vi.fn(() => {});
				const destroy = Store.subscribe(func);

				expect(get(Store)).toBe(0);
				expect(func).toBeCalledTimes(1);
				expect(func).toBeCalledWith(0);

				Store.set(10);
				expect(get(Store)).toBe(10);
				expect(func).toBeCalledTimes(2);
				expect(func).toBeCalledWith(10);

				Store.update((number) => number * 3);
				expect(get(Store)).toBe(30);
				expect(func).toBeCalledTimes(3);
				expect(func).toBeCalledWith(30);

				destroy();
			}
		});

		it('Should return a new store if given a writable', () => {
			const Original = writable(false);
			expect(notifiable({ initialValue: Original, notifier: console.log })).not.toBe(Original);
		});

		it('Should update the given store upon changes', () => {
			const Name = writable('James');
			const Another = notifiable({ initialValue: Name, notifier: () => {} });

			Another.set('Brandon');
			expect(get(Name)).toBe('Brandon');

			Another.set('Vincent');
			expect(get(Name)).toBe('Vincent');
		});
	});

	describe('start', () => {
		it('Should run the start callback if given a primitive value', () => {
			const onStop = vi.fn(() => {});
			const start = vi.fn((set: (val: number) => void) => {
				set(10);
				return onStop;
			});
			const Store = notifiable({ initialValue: 0, notifier: () => {}, start });

			const destroy = Store.subscribe(() => {});
			expect(start).toBeCalledTimes(1);
			expect(get(Store)).toBe(10);
			expect(start.mock.calls[0][0]).toBeInstanceOf(Function);

			destroy();
			expect(onStop).toBeCalledTimes(1);
		});

		it('Should not run the start callback if given a store', () => {
			const onStop = vi.fn(() => {});
			const start = vi.fn((set: (val: number) => void) => {
				set(10);
				return onStop;
			});
			const Store = notifiable({ initialValue: writable(0), notifier: () => {}, start });

			Store.subscribe(() => {})();
			expect(start).not.toBeCalled();
		});
	});

	describe('notifier', () => {
		it('Should not run the notifier when created', () => {
			const notifier = vi.fn(() => {});
			notifiable({ initialValue: 0, notifier });
			expect(notifier).not.toBeCalled();
		});

		it('Should run the notifier whenever the store changes', () => {
			const notifier = vi.fn(() => {});
			const Country = notifiable({ initialValue: 'USA', notifier });

			Country.set('Brazil');
			expect(notifier).toBeCalledTimes(1);

			Country.update(() => 'Thailand');
			expect(notifier).toBeCalledTimes(2);
		});

		it('Should pass the current value', () => {
			const notifier = vi.fn(() => {});
			const Country = notifiable({ initialValue: 'USA', notifier });

			Country.set('Brazil');
			expect(notifier).toBeCalledWith('Brazil');

			Country.update(() => 'Thailand');
			expect(notifier).toBeCalledWith('Thailand');
		});
	});
});
