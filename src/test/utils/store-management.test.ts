import * as store from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isFunction, isInterface, isStore, isWritable } from '$lib/predicate';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

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
	type RefReturn = ReturnType<typeof ref>;
	const { ref } = store;

	const Name = writable('James');
	const initialRef = ref('Jack', Name);

	it('Should return an object: { value: Function, listen: Function }', () => {
		expect(
			isInterface<RefReturn>(initialRef, {
				value: isFunction,
				listen: isFunction
			})
		);
	});

	describe('#value', () => {
		const Country = writable('China');
		const country = ref('Spain', Country);

		it('Should be a getter', () => {
			expect(country.value).toBe('Spain');
		});

		it("Should return the initialValue if #listen hasn't been called", () => {
			expect(country.value).toBe('Spain');
		});

		it('Should return the current Store value if #listen has been called', () => {
			add(country.listen());

			expect(country.value).toBe('China');

			Country.set('Japan');
			expect(country.value).toBe('Japan');

			Country.set('Uruguay');
			expect(country.value).toBe('Uruguay');
		});
	});

	describe('#listen', () => {
		const Tweets = writable(0);
		const tweetCount = ref(10, Tweets);

		it('Should return a subscriber (Function)', () => {
			const stop = tweetCount.listen();
			expect(stop).toBeInstanceOf(Function);
			add(stop);
		});

		it('Should sync the return of #value with the current Store value', () => {
			add(tweetCount.listen());
			expect(tweetCount.value).toBe(0);

			Tweets.set(10);
			expect(tweetCount.value).toBe(10);

			Tweets.set(20);
			expect(tweetCount.value).toBe(20);
		});

		it('Should not sync the Store value if the subscription has been stopped', () => {
			Tweets.set(125);
			expect(tweetCount.value).toBe(20);

			Tweets.set(1000);
			expect(tweetCount.value).toBe(20);
		});
	});

	describe('Parameters', () => {
		const DisplayName = writable('James');
		const displayName = ref('Jack', DisplayName);

		describe('initialValue', () => {
			it('Should set the initialValue returned by #value before calling #listen', () => {
				expect(displayName.value).toBe('Jack');
			});

			it("Should always be returned by #value if #listen hasn't been called", () => {
				expect(displayName.value).toBe('Jack');

				DisplayName.set('Damian');
				expect(displayName.value).toBe('Jack');

				DisplayName.set('Rohan');
				expect(displayName.value).toBe('Jack');
			});

			it('Should return the current value', () => {
				add(displayName.listen());
				expect(displayName.value).toBe('Rohan');

				DisplayName.set('Jackie');
				expect(displayName.value).toBe('Jackie');

				DisplayName.set('John');
				expect(displayName.value).toBe('John');
			});
		});
	});
});
