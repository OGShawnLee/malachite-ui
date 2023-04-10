import { useCleanup } from '$lib/hooks';
import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';
import { isFunction } from '$lib/predicate';

it('Should return a function', () => {
	const fn = useCleanup();
	expect(isFunction(fn)).toBe(true);
});

it('Should not call the given fn if the returned fn is not called', () => {
	const fn = vi.fn(() => {});
	useCleanup(fn);
	expect(fn).not.toBeCalled();
});

it('Should call all the given functions', () => {
	const functions = generateSpyFunctions(10);
	useCleanup(...functions)();
	for (const fn of functions) {
		expect(fn).toBeCalledTimes(1);
	}
});

it('Should call all the functions if given an array', () => {
	const functions = generateSpyFunctions(6);
	useCleanup(functions)();
	for (const fn of functions) {
		expect(fn).toBeCalledTimes(1);
	}
});

it('Should work with action-like values', () => {
	const [first, second] = generateSpyFunctions(2);
	const foo = { destroy: first };
	const bar = { destroy: second };
	useCleanup(foo, bar)();
	expect(first).toBeCalledTimes(1);
	expect(second).toBeCalledTimes(1);
});

describe('recursion', () => {
	it('Should work with functions that return functions', () => {
		const [first, second] = generateSpyFunctions(2);
		const fn = vi.fn(() => first);
		const anotherFn = vi.fn(() => second);
		useCleanup(fn, anotherFn)();

		for (const func of [first, second, fn, anotherFn]) {
			expect(func).toBeCalledTimes(1);
		}
	});

	it('Should work with nested arrays', () => {
		const functions = generateSpyFunctions(6);
		const [one, two, three, four, five, six] = functions;
		useCleanup([one, [two, three, [four, [five, [six]]]]])();

		for (const fn of functions) {
			expect(fn).toBeCalledTimes(1);
		}
	});

	it('Should work with complex structures', async () => {
		const functions = generateSpyFunctions(6);
		const groupings = generate(3, () => generateSpyFunctions(3));
		const action = vi.fn(() => ({ destroy: functions }));
		useCleanup(groupings, action)();

		for (const fn of [...functions, ...groupings.flat(), action]) {
			expect(fn).toBeCalledTimes(1);
		}
	});
});
