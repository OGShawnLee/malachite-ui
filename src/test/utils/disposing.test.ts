import { destroy } from '$lib/utils/disposing';
import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';

describe('destroy', () => {
	it('Should work with a function', () => {
		const fn = vi.fn(() => {});
		destroy(fn);
		expect(fn).toBeCalled();
	});

	it('Should work with an array of functions', () => {
		const functions = generateSpyFunctions(10);
		destroy(functions);
		for (const fn of functions) {
			expect(fn).toBeCalledTimes(1);
		}
	});

	it('Should call the given functions once', () => {
		const functions = generateSpyFunctions(10);
		destroy(functions);
		for (const fn of functions) {
			expect(fn).toBeCalledTimes(1);
		}
	});

	it('Should work with action-like objects', () => {
		const [first, second] = generateSpyFunctions(2);
		const foo = { destroy: first };
		const bar = { destroy: second };

		destroy([foo, bar]);
		expect(first).toBeCalledTimes(1);
		expect(second).toBeCalledTimes(1);
	});

	it('Should work recursively with complex and nested structures', async () => {
		const collectable = generate(5, () => generateSpyFunctions(2));
		const [one, two, three, four, five] = collectable;

		destroy([one, [two, three], { destroy: () => [four, five] }]);
		for (const functions of collectable) {
			functions.forEach((fn) => expect(fn).toBeCalledTimes(1));
		}
	});
});
