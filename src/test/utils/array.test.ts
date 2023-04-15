import * as array from '$lib/utils/array';
import { isArray } from '$lib/predicate';

describe('generate', () => {
	const { generate } = array;

	it('Should return an array', () => {
		expect(generate(3, 3)).toBeInstanceOf(Array);
	});

	it('Should return an array of the given length filled with the given value', () => {
		const arr = generate(10, 5);
		expect(arr).toHaveLength(10);
		expect(isArray(arr, (num): num is number => num === 5)).toBe(true);
	});

	describe('function value', () => {
		it('Should fill the array with the return value', () => {
			const names = generate(5, () => 'James');
			expect(names).toHaveLength(5);
			expect(isArray(names, (name): name is string => name === 'James')).toBe(true);
		});

		it('Should call the function as many times as the given length', () => {
			const func = vi.fn(() => {});
			generate(10, func);
			expect(func).toBeCalledTimes(10);
		});

		it('Should pass the current index', () => {
			const func = vi.fn(() => {});
			generate(5, func);
			expect(func.mock.calls.flat()).toEqual([0, 1, 2, 3, 4]);
		});
	});
});

describe('getFirstAndLast', () => {
	const { getFirstAndLast } = array;
	const items = [0, 1, 2, 3];

	it('Should return the first and last in a tuple', () => {
		expect(getFirstAndLast(items)).toBeInstanceOf(Array);
		expect(getFirstAndLast(items)).toHaveLength(2);
	});

	it('Should return the first and last item', () => {
		expect(getFirstAndLast(items)).toEqual([0, 3]);
	});

	it('Should return the first item and undefined if the array has only one item', () => {
		expect(getFirstAndLast([10])).toEqual([10, undefined]);
	});
});

describe('makeUnique', () => {
	it('Should return an array with unique items', () => {
		const items = [0, 0, 0, 1, 2, 3, 'First', 'First', 1];
		expect(array.makeUnique(items)).toEqual([0, 1, 2, 3, 'First']);
	});
});
