import { useDataSync } from '$lib/hooks';
import { get, writable } from 'svelte/store';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('useDataSync', () => {
	const primitive = {
		name: 'james',
		age: 15,
		isMarried: false,
		country: 'spain'
	};

	const Name = writable('leonardo');
	const Age = writable(24);

	const sync = useDataSync(primitive);
	it('Should return a function', () => {
		expect(sync).toBeInstanceOf(Function);
	});

	it('Should sync the given store and the given object property whenever the store changes', () => {
		add(sync(Name, 'name'));

		Name.set('daniel');
		expect(primitive.name === 'daniel');

		Name.set('hernan');
		expect(primitive.name === 'hernan');

		Name.update((name) => name + 'dez');
		expect(primitive.name === 'hernandez');
	});

	it('Should return an unsubscriber that stops the synchronization', () => {
		const Married = writable(false);
		const destroy = sync(Married, 'isMarried');
		expect(destroy).toBeInstanceOf(Function);

		expect(primitive.isMarried).toBe(false);
		Married.set(true);
		expect(primitive.isMarried).toBe(true);

		destroy();

		Married.set(false);
		expect(primitive.isMarried).toBe(true);
	});

	it('Should sync right from the first run', () => {
		add(sync(Age, 'age'));
		expect(primitive.age).toBe(get(Age));
	});

	describe('callback', () => {
		const Country = writable('france');
		it('Should run the given callback on store changes', () => {
			const func = vi.fn(() => {});
			add(sync(Country, 'country', func));
			expect(func).toBeCalledTimes(1);

			Country.set('nether');
			expect(func).toBeCalledTimes(2);

			Country.update((country) => country + 'lands');
			expect(func).toBeCalledTimes(3);
		});

		it('Should pass the current value', () => {
			const func = vi.fn(() => {});
			Country.set('usa');
			add(sync(Country, 'country', func));
			expect(func).toBeCalledWith('usa');

			Country.set('canada');
			expect(func).toBeCalledWith('canada');
		});
	});
});
