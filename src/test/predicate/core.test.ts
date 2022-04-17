import * as core from '@predicate/core';

describe('isArray', () => {
	const { isArray } = core;
	it('Should return true with arrays', () => {
		expect(isArray([])).toBe(true);
		expect(isArray(new Array())).toBe(true);
	});

	it('Should return false with non-array values', () => {
		const values = [{}, new Set(), new Map(), 'string', 0, false, true];
		for (const value of values) {
			expect(isArray(value)).toBe(false);
		}
	});

	describe('predicate', () => {
		it('Should be used to determine whether the array is of the given type or not', () => {
			const numbers = [0, 1, 2, 3, 4];
			const isNumberArray = isArray(numbers, core.isNumber);
			expect(isNumberArray).toBe(true);

			const words = ['One', 'Two', 3, 4, 5];
			const isStringArray = isArray(words, core.isString);
			expect(isStringArray).toBe(false);
		});

		it('Shold pass the current value, index and array', () => {
			const values = [0, 1, 2, 3, 4, 5];
			const predicate = vi.fn((val: unknown) => typeof val === 'number');
			isArray(values, predicate as unknown as (val: unknown) => val is number);
			expect(predicate).toBeCalledTimes(values.length);
			values.forEach((number, index, array) => {
				expect(predicate).toBeCalledWith(number, index, array);
			});
		});

		it('Should stop execution after finding an invalid value', () => {
			const values = [0, 1, 2, 'NAN', 'Another One', 'Yet-Another-One'];
			const predicate = vi.fn((val: unknown) => typeof val === 'number');
			expect(isArray(values, predicate as unknown as (val: unknown) => val is number)).toBe(false);
			expect(predicate).toBeCalledTimes(4);
		});
	});
});

describe('isBoolean', () => {
	const { isBoolean } = core;
	it('Should return true with boolean values', () => {
		const values = [false, new Boolean(false), true, new Boolean(true)];
		for (const value of values) {
			expect(isBoolean(value)).toBe(true);
		}
	});

	it('Should return false with non-boolean values', () => {
		const values = [0, 'string', null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isBoolean(value)).toBe(false);
		}
	});
});

describe('isEmpty', () => {
	const { isEmpty } = core;
	it('Should return true when an array is empty', () => {
		expect(isEmpty([])).toBe(true);
	});

	it('Should return false when an array is not empty', () => {
		expect(isEmpty([1])).toBe(false);
	});

	describe('string value', () => {
		it('Should work with strings', () => {
			expect(isEmpty('')).toBe(true);
		});

		it('Should return true if the string is whitespace', () => {
			expect(
				isEmpty(`    
			
				`)
			).toBe(true);
		});
	});
});

describe('isFunction', () => {
	const { isFunction } = core;
	it('Should return true with functions', () => {
		const values = [() => {}, async () => {}, function* () {}, new Function()];
		for (const value of values) {
			expect(isFunction(value)).toBe(true);
		}
	});

	it('Should return false with non-function values', () => {
		const values = [0, 'First', false, true, new Promise<void>((res) => res()), {}, []];
		for (const value of values) {
			expect(isFunction(value)).toBe(false);
		}
	});
});

describe('isNullish', () => {
	const { isNullish } = core;
	it('Should return true if value is nullish or undefined', () => {
		expect(isNullish(undefined)).toBe(true);
		expect(isNullish(null)).toBe(true);
	});

	it('Should return false with anything else', () => {
		const values = [0, 'string', false, true, '', {}, [], () => {}];
		for (const value of values) {
			expect(isNullish(value)).toBe(false);
		}
	});
});

describe('isNumber', () => {
	const { isNumber } = core;
	it('Should return true with number values', () => {
		const values = [0, 0.125, new Number(400), new Number(400.25)];
		for (const value of values) {
			expect(isNumber(value)).toBe(true);
		}
	});

	it('Should return false with non-number values', () => {
		const values = [true, false, 'string', null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isNumber(value)).toBe(false);
		}
	});
});

describe('isObject', () => {
	const { isObject } = core;
	it('Should return true with objects', () => {
		const values = [[], {}, document.createElement('div'), new Object({ name: 'Smith' })];
		for (const value of values) {
			expect(isObject(value)).toBe(true);
		}
	});

	it('Should return false with non-object values', () => {
		const values = [0, false, true, () => 13, undefined, null, 'string'];
		for (const value of values) {
			expect(isObject(value)).toBe(false);
		}
	});

	it('Should return false with null', () => {
		expect(isObject(null)).toBe(false);
	});

	describe('properties', () => {
		it('Should return true if the object has all the given properties', () => {
			expect(isObject({ name: 'James' }, ['name'])).toBe(true);
			expect(isObject({ name: 'James', age: 43 }, ['name', 'age'])).toBe(true);
			expect(isObject({ name: 'James', age: 43, country: 'uk' }, ['name', 'age', 'country'])).toBe(
				true
			);
		});

		it('Should return false if the object does not have all the given properties', () => {
			expect(isObject({}, ['name'])).toBe(false);
			expect(isObject({ age: 43 }, ['name', 'age'])).toBe(false);
			expect(isObject({ age: 43, country: 'uk' }, ['name', 'age', 'country'])).toBe(false);
		});
	});
});

describe('isPromise', () => {
	const { isPromise } = core;
	it('Should return true with promises', () => {
		expect(isPromise(new Promise(() => {}))).toBe(true);
	});

	it('Should return false with non-promise values', () => {
		const values = [() => {}, async () => {}, 0, 'First', true, false, [], {}];
		for (const value of values) {
			expect(isPromise(value)).toBe(false);
		}
	});
});

describe('isString', () => {
	const { isString } = core;
	it('Should return true with string values', () => {
		const values = ['string', new String('another string')];
		for (const value of values) {
			expect(isString(value)).toBe(true);
		}
	});

	it('Should return false with non-string values', () => {
		const values = [0, true, false, null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isString(value)).toBe(false);
		}
	});
});
