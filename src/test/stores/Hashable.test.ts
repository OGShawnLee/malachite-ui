import { Hashable } from '$lib/stores';
import { isNumber, isStore } from '$lib/predicate';
import { get } from 'svelte/store';

const hash = new Hashable<string, string>();

afterEach(() => hash.clear());

it('Should be a valid store', () => {
	const value = get(hash);
	expect(isStore(hash)).toBe(true);

	const callback = vi.fn((hash: Map<string, string>) => hash);
	const free = hash.subscribe(callback);

	expect(callback).toBeCalledTimes(1);
	expect(callback).toBeCalledWith(value);

	hash.set('Monad', 'Mosk');
	expect(callback).toBeCalledTimes(2);
	expect(callback.mock.calls[1][0].has('Monad'));

	hash.set('Vincent', 'Mosk');
	expect(callback).toBeCalledTimes(3);
	expect(callback.mock.calls[2][0].has('Vincent'));

	hash.clear();
	expect(callback).toBeCalledTimes(4);
	expect(callback.mock.calls[3][0].size).toBe(0);

	free();
});

it('Should be empty by default', () => {
	expect(get(hash).size).toBe(0);
});

describe('method -> set', () => {
	it('Should have a set method', () => {
		expect(hash).toHaveProperty('set');
		expect(hash.set).toBeInstanceOf(Function);
	});

	it('Should set items', () => {
		hash.set('Senex', 'Charos');
		expect(hash.has('Senex')).toBe(true);
		expect(hash.get('Senex')).toBe('Charos');

		hash.set('Kaskis', 'Asura');
		expect(hash.has('Kaskis')).toBe(true);
		expect(hash.get('Kaskis')).toBe('Asura');
	});

	it('Should return the new size of the hash', () => {
		const capitals = new Hashable<string, string>();
		let index = capitals.set('China', 'Beijing');
		expect(index).toBe(1);
		index = capitals.set('Russia', 'Moscu');
		expect(index).toBe(2);
	});

	it('Should overwrite the previous value', () => {
		hash.set('First', '1');
		expect(hash.get('First')).toBe('1');
		hash.set('First', '10');
		expect(hash.get('First')).toBe('10');
	});
});

describe('method -> clear', () => {
	it('Should have a clear method', () => {
		expect(hash).toHaveProperty('clear');
		expect(hash.clear).toBeInstanceOf(Function);
	});

	it('Should clear the hash', () => {
		const tuples = [
			['First', 'One'],
			['Second', 'Two'],
			['Third', 'Three']
		];
		for (const [key, value] of tuples) hash.set(key, value);

		expect(hash.size).toBe(3);
		for (const [key] of tuples) expect(hash.has(key)).toBe(true);
		hash.clear();
		expect(hash.size).toBe(0);
		for (const [key] of tuples) expect(hash.has(key)).toBe(false);
	});
});

describe('method -> delete', () => {
	it('Should have a delete method', () => {
		expect(hash).toHaveProperty('delete');
		expect(hash.delete).toBeInstanceOf(Function);
	});

	it('Should delete an item', () => {
		hash.set('Earth', 'Tierra');
		expect(hash.has('Earth')).toBe(true);
		hash.delete('Earth');
		expect(hash.has('Earth')).toBe(false);
	});

	it('Should return whether or not the item was deleted', () => {
		hash.set('Earth', 'Tierra');
		expect(hash.delete('Earth')).toBe(true);
		expect(hash.delete('404')).toBe(false);
	});

	// Will make this true
	it.skip('Should trigger a subscription callback only if the item was deleted', () => {
		const fn = vi.fn(() => {});
		const free = hash.subscribe(fn);
		hash.delete('404');
		expect(fn).toBeCalledTimes(2);

		hash.set('Neptune', 'Neptuno');
		expect(fn).toBeCalledTimes(2);
		hash.delete('Neptune');
		expect(fn).toBeCalledTimes(3);

		free();
	});
});

describe('method -> destroy', () => {
	it('Should have a destroy method', () => {
		expect(hash).toHaveProperty('destroy');
		expect(hash.destroy).toBeInstanceOf(Function);
	});

	it('Should return a function', () => {
		hash.set('First', 'One');
		expect(hash.destroy('First')).toBeInstanceOf(Function);
	});

	it('Should delete the given key when called', () => {
		hash.set('First', 'One');
		expect(hash.has('First')).toBe(true);
		hash.destroy('First')();
		expect(hash.has('First')).toBe(false);
	});
});

describe('method -> get', () => {
	it('Should have a get method', () => {
		expect(hash).toHaveProperty('get');
		expect(hash.get).toBeInstanceOf(Function);
	});

	it('Should return the requested value if it exists', () => {
		hash.set('Galaxy', 'Galaxia');
		expect(hash.get('Galaxy')).toBe('Galaxia');
	});

	it('Should return undefined if the value does not exist', () => {
		expect(hash.get('404')).toBeUndefined();
	});
});

// Will rename to getOrThrow
describe('method -> getSafe', () => {
	it('Should have a getSafe method', () => {
		expect(hash).toHaveProperty('getSafe');
		expect(hash.getSafe).toBeInstanceOf(Function);
	});

	it('Should return the requested value', () => {
		hash.set('Galaxy', 'Galaxia');
		expect(hash.getSafe('Galaxy')).toBe('Galaxia');
	});

	it('Should throw if the requested value does not exist', () => {
		const danger = () => hash.getSafe('404');
		expect(danger).toThrow();
	});
});

describe('method -> has', () => {
	it('Should have a has method', () => {
		expect(hash).toHaveProperty('has');
		expect(hash.has).toBeInstanceOf(Function);
	});

	it('Should return whether or not the given item exists', () => {
		expect(hash.has('Not Found')).toBe(false);
		hash.set('Not Found', 'I am here');
		expect(hash.has('Not Found')).toBe(true);
	});
});

describe('method -> update', () => {
	it('Should have an update method', () => {
		expect(hash).toHaveProperty('update');
		expect(hash.update).toBeInstanceOf(Function);
	});

	const numbers = new Hashable<string, number>();
	it('Should run a mutation fn on the target item', () => {
		numbers.set('count', 10);
		numbers.update('count', (count) => count * 10);
		expect(numbers.get('count')).toBe(100);
	});

	it('Should not run the given fn if the target item does not exist', () => {
		const fn = vi.fn((double: number) => double * 10);
		numbers.update('double', fn);
		expect(fn).not.toBeCalled();
	});
});

describe('prop -> size', () => {
	it('Should have a size property', () => {
		expect(hash).toHaveProperty('size');
	});

	it('Should be a number', () => {
		expect(isNumber(hash.size)).toBe(true);
	});

	it('Should return the current hash size', () => {
		expect(hash.size).toBe(0);
		hash.set('Uranus', 'Urano');
		expect(hash.size).toBe(1);
		hash.set('Neptune', 'Neptune');
		expect(hash.size).toBe(2);
	});
});
