import * as core from '$lib/predicate/core';

describe.skip('isArray', () => {
	const { isArray } = core;
	it.skip('Should return true with arrays', () => {
		expect(isArray([])).toBe(true);
		expect(isArray(new Array())).toBe(true);
	});

	it.skip('Should return false with non-array values', () => {
		const values = [{}, new Set(), new Map(), 'string', 0, false, true];
		for (const value of values) {
			expect(isArray(value)).toBe(false);
		}
	});

	describe.skip('predicate', () => {
		it.skip('Should be used to determine whether the array is of the given type or not', () => {
			const numbers = [0, 1, 2, 3, 4];
			const isNumberArray = isArray(numbers, core.isNumber);
			expect(isNumberArray).toBe(true);

			const words = ['One', 'Two', 3, 4, 5];
			const isStringArray = isArray(words, core.isString);
			expect(isStringArray).toBe(false);
		});

		it.skip('Shold pass the current value, index and array', () => {
			const values = [0, 1, 2, 3, 4, 5];
			const predicate = vi.fn((val: unknown) => typeof val === 'number');
			isArray(values, predicate as unknown as (val: unknown) => val is number);
			expect(predicate).toBeCalledTimes(values.length);
			values.forEach((number, index, array) => {
				expect(predicate).toBeCalledWith(number, index, array);
			});
		});

		it.skip('Should stop execution after finding an invalid value', () => {
			const values = [0, 1, 2, 'NAN', 'Another One', 'Yet-Another-One'];
			const predicate = vi.fn((val: unknown) => typeof val === 'number');
			expect(isArray(values, predicate as unknown as (val: unknown) => val is number)).toBe(false);
			expect(predicate).toBeCalledTimes(4);
		});
	});
});

describe.skip('isBoolean', () => {
	const { isBoolean } = core;
	it.skip('Should return true with boolean values', () => {
		const values = [false, new Boolean(false), true, new Boolean(true)];
		for (const value of values) {
			expect(isBoolean(value)).toBe(true);
		}
	});

	it.skip('Should return false with non-boolean values', () => {
		const values = [0, 'string', null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isBoolean(value)).toBe(false);
		}
	});
});

describe.skip('isEmpty', () => {
	const { isEmpty } = core;
	it.skip('Should return true when an array is empty', () => {
		expect(isEmpty([])).toBe(true);
	});

	it.skip('Should return false when an array is not empty', () => {
		expect(isEmpty([1])).toBe(false);
	});

	describe.skip('string value', () => {
		it.skip('Should work with strings', () => {
			expect(isEmpty('')).toBe(true);
		});

		it.skip('Should return true if the string is whitespace', () => {
			expect(
				isEmpty(`    
			
				`)
			).toBe(true);
		});
	});
});

describe.skip('isFunction', () => {
	const { isFunction } = core;
	it.skip('Should return true with functions', () => {
		const values = [() => {}, async () => {}, function* () {}, new Function()];
		for (const value of values) {
			expect(isFunction(value)).toBe(true);
		}
	});

	it.skip('Should return false with non-function values', () => {
		const values = [0, 'First', false, true, new Promise<void>((res) => res()), {}, []];
		for (const value of values) {
			expect(isFunction(value)).toBe(false);
		}
	});
});

describe.skip('isIncluded', () => {
	const { isIncluded } = core;
	it.skip('Should return true if the given element is included in the given array', () => {
		expect(isIncluded(2, [1, 2, 3])).toBe(true);
		expect(isIncluded('Second', ['First', 'Second', 3])).toBe(true);
		expect(isIncluded('First', ['First', 'Second', 'Third'])).toBe(true);
		expect(isIncluded(null, ['First', 'Second', 'Third', null])).toBe(true);
	});

	it.skip('Should return false if the given element is not included in the given array', () => {
		expect(isIncluded('James', [1, 2, 3])).toBe(false);
		expect(isIncluded(false, ['First', 'Second', 3])).toBe(false);
		expect(isIncluded(null, ['First', 'Second', 'Third'])).toBe(false);
		expect(isIncluded(undefined, ['First', 'Second', 'Third', null])).toBe(false);
	});
});

describe.skip('isInterface', () => {
	const { isArray, isBoolean, isFunction, isInterface, isNumber, isString } = core;

	interface User {
		name: string;
		display_name: string;
		created_at: string;
		is_verified: boolean;
		children: number;
		friends: string[];
	}

	const user = {
		name: 'Ergo',
		display_name: 'Vincent Law',
		created_at: 'June 24 2123',
		is_verified: false,
		children: 0,
		friends: ['RE-L', 'Pino', 'Monad']
	};

	function isUser(val: unknown): val is User {
		return isInterface<User>(val, {
			name: isString,
			display_name: isString,
			created_at: isString,
			is_verified: isBoolean,
			children: isNumber,
			friends(val): val is Array<string> {
				return isArray(val, isString);
			}
		});
	}

	it.skip('Should always return false with arrays', () => {
		expect(isUser([])).toBe(false);
		expect(isInterface([], {})).toBe(false);
	});

	it.skip('Should handle values that are not objects', () => {
		expect(isUser(123)).toBe(false);
		expect(isUser('Invalid')).toBe(false);
		expect(isUser(false)).toBe(false);
		expect(isUser(true)).toBe(false);
		expect(isUser(null)).toBe(false);
		expect(isUser(undefined)).toBe(false);
	});

	it.skip('Should return true if all the given predicates return true', () => {
		expect(isUser(user)).toBe(true);
	});

	it.skip('Should return false if a predicate function returns false', () => {
		expect(
			isUser({
				name: 'John',
				display_name: 'Doe',
				created_at: '24 May 1980',
				is_verified: 'negative',
				children: 0,
				friends: ['John Cena', 'John Snow', 'John 117']
			})
		).toBe(false);
	});

	it.skip('Should pass the object property value to the predicate function', () => {
		const { text, user_id } = {
			text: "You're kinda slow for a human, aren't ya?",
			user_id: 123339
		};

		const tweet = { text, user_id };
		const textPredicate = vi.fn((value: unknown): value is string => isString(value));
		const idPredicate = vi.fn((value: unknown): value is number => isNumber(value));

		isInterface<{ text: string; user_id: number }>(tweet, {
			text(value): value is string {
				return textPredicate(value);
			},
			user_id(value): value is number {
				return idPredicate(value);
			}
		});

		expect(textPredicate).toBeCalledWith(text);
		expect(idPredicate).toBeCalledWith(user_id);
	});

	it.skip('Should return false if a predicate property is missing', () => {
		const john = { name: 'John', display_name: '117', is_verified: true, children: 0 };
		expect(
			isInterface<User>(john, {
				name: core.isString,
				display_name: core.isString,
				created_at: core.isString,
				is_verified: core.isBoolean,
				children: core.isNumber,
				friends(val): val is Array<string> {
					return core.isArray(val, core.isString);
				}
			})
		).toBe(false);
	});

	describe.skip('Function Value', () => {
		interface WithFunction {
			name: string;
			fight: (foe: string) => boolean;
		}

		it.skip('Should ask for a simple function predicate ((v) => v is Function)', () => {
			expect(
				isInterface<WithFunction>(
					{ name: 'James', fight: () => false },
					{
						name: isString,
						fight: isFunction
					}
				)
			).toBe(true);
		});
	});

	describe.skip('Predicate Function Error', () => {
		it.skip('Should throw a TypeError if not given a valid predicate function', () => {
			expect(() =>
				isInterface(user, {
					name: isString,
					display_name: isString,
					// @ts-expect-error
					created_at: 'Danger Levels',
					is_verified: isBoolean,
					children: isNumber
				})
			).toThrow(TypeError);
		});

		it.skip('Should inform which property key was expecting it', () => {
			expect(() =>
				isInterface(user, {
					name: isString,
					display_name: isString,
					// @ts-expect-error
					created_at: 'Danger Levels',
					is_verified: isBoolean,
					children: isNumber
				})
			).toThrow(new TypeError('Expected Predicate Function for Property: created_at'));
		});
	});
});

describe.skip('isNullish', () => {
	const { isNullish } = core;
	it.skip('Should return true if value is nullish or undefined', () => {
		expect(isNullish(undefined)).toBe(true);
		expect(isNullish(null)).toBe(true);
	});

	it.skip('Should return false with anything else', () => {
		const values = [0, 'string', false, true, '', {}, [], () => {}];
		for (const value of values) {
			expect(isNullish(value)).toBe(false);
		}
	});
});

describe.skip('isNumber', () => {
	const { isNumber } = core;
	it.skip('Should return true with number values', () => {
		const values = [0, 0.125, new Number(400), new Number(400.25)];
		for (const value of values) {
			expect(isNumber(value)).toBe(true);
		}
	});

	it.skip('Should return false with non-number values', () => {
		const values = [true, false, 'string', null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isNumber(value)).toBe(false);
		}
	});
});

describe.skip('isObject', () => {
	const { isObject } = core;
	it.skip('Should return true with objects', () => {
		const values = [[], {}, document.createElement('div'), new Object({ name: 'Smith' })];
		for (const value of values) {
			expect(isObject(value)).toBe(true);
		}
	});

	it.skip('Should return false with non-object values', () => {
		const values = [0, false, true, () => 13, undefined, null, 'string'];
		for (const value of values) {
			expect(isObject(value)).toBe(false);
		}
	});

	it.skip('Should return false with null', () => {
		expect(isObject(null)).toBe(false);
	});

	describe.skip('properties', () => {
		it.skip('Should return true if the object has all the given properties', () => {
			expect(isObject({ name: 'James' }, ['name'])).toBe(true);
			expect(isObject({ name: 'James', age: 43 }, ['name', 'age'])).toBe(true);
			expect(isObject({ name: 'James', age: 43, country: 'uk' }, ['name', 'age', 'country'])).toBe(
				true
			);
		});

		it.skip('Should return false if the object does not have all the given properties', () => {
			expect(isObject({}, ['name'])).toBe(false);
			expect(isObject({ age: 43 }, ['name', 'age'])).toBe(false);
			expect(isObject({ age: 43, country: 'uk' }, ['name', 'age', 'country'])).toBe(false);
		});
	});
});

describe.skip('isPromise', () => {
	const { isPromise } = core;
	it.skip('Should return true with promises', () => {
		expect(isPromise(new Promise(() => {}))).toBe(true);
	});

	it.skip('Should return false with non-promise values', () => {
		const values = [() => {}, async () => {}, 0, 'First', true, false, [], {}];
		for (const value of values) {
			expect(isPromise(value)).toBe(false);
		}
	});
});

describe.skip('isString', () => {
	const { isString } = core;
	it.skip('Should return true with string values', () => {
		const values = ['string', new String('another string')];
		for (const value of values) {
			expect(isString(value)).toBe(true);
		}
	});

	it.skip('Should return false with non-string values', () => {
		const values = [0, true, false, null, undefined, {}, [], () => {}];
		for (const value of values) {
			expect(isString(value)).toBe(false);
		}
	});
});

describe('isWhitespace', () => {
	const { isWhitespace } = core;
	
	it('Should return whether or not the given string is whitespace', () => {
		expect(isWhitespace(' ')).toBe(true);
		expect(isWhitespace('I have a dream!')).toBe(false);
	});

	it('Should return true if the given string is empty', () => {
		expect(isWhitespace('')).toBe(true);
	});
});
