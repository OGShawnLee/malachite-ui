import { useCleanup } from '$lib/hooks';
import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';
import { isFunction } from '$lib/predicate';

it.skip('Should return a function', () => {
	const func = useCleanup();
	expect(isFunction(func)).toBe(true);
});

it.skip('Should not destroy if not called', () => {
	const func = vi.fn(() => {});
	useCleanup(func);
	expect(func).not.toBeCalled();
});

it.skip('Should call multiple functions', () => {
	const functions = generateSpyFunctions(10);
	useCleanup(...functions)();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
	}
});

it.skip('Should call all the functions if given an array', () => {
	const functions = generateSpyFunctions(6);
	useCleanup(functions)();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
	}
});

it.skip('Should work with action-like values', () => {
	const [first, second] = generateSpyFunctions(2);
	const foo = { destroy: first };
	const bar = { destroy: second };
	useCleanup(foo, bar)();
	expect(first).toBeCalledTimes(1);
	expect(second).toBeCalledTimes(1);
});

describe.skip('recursion', () => {
	it.skip('Should work with functions that return functions', () => {
		const [first, second] = generateSpyFunctions(3);
		const func = vi.fn(() => first);
		const anotherFunc = vi.fn(() => second);
		useCleanup(func, anotherFunc)();

		for (const fn of [first, second, func, anotherFunc]) {
			expect(fn).toBeCalledTimes(1);
		}
	});

	it.skip('Should work with nested arrays', () => {
		const functions = generateSpyFunctions(6);
		const [one, two, three, four, five, six] = functions;
		useCleanup([one, [two, three, [four, [five, [six]]]]])();

		for (const func of functions) {
			expect(func).toBeCalledTimes(1);
		}
	});

	it.skip('Should work with complex structures', async () => {
		const groups = generate(3, () => generateSpyFunctions(3));
		const [secondGroup] = groups;
		const functions = generateSpyFunctions(6);
		const [one, two, four, five, six] = functions;

		useCleanup(one, [two, [{ destroy: () => [four, five, six, secondGroup] }]])();

		for (const func of [...groups.flat(), ...functions]) {
			expect(func).toBeCalledTimes(1);
		}
	});
});
