import { useCleanup } from '$lib/hooks';
import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';
import { isFunction } from '$lib/predicate';

it('Should return an async function', () => {
	const func = useCleanup();
	expect(isFunction(func)).toBe(true);
	expect(func()).toBeInstanceOf(Promise);
});

it('Should not destroy if not called', () => {
	const func = vi.fn(() => {});
	useCleanup(func);
	expect(func).not.toBeCalled();
});

it('Should call multiple functions', () => {
	const functions = generateSpyFunctions(10);
	useCleanup(...functions)();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
	}
});

it('Should work with async functions', () => {
	const func = vi.fn(async () => {});
	useCleanup(func)();
	expect(func).toBeCalledTimes(1);
});

it('Should call all the functions if given an array', () => {
	const functions = generateSpyFunctions(6);
	useCleanup(functions)();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
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

it('Should not throw if not given collectable values', () => {
	const check = () => useCleanup(0, 'string', false, true, [], {});
	expect(check).not.toThrow();
});

it('Should work with promises', async () => {
	const func = vi.fn(() => {});
	const promise = new Promise((res) => res(func));
	await useCleanup(promise)();
	expect(func).toBeCalled();
});

describe('recursion', () => {
	it('Should work with functions that return functions', () => {
		const [first, second] = generateSpyFunctions(3);
		const func = vi.fn(() => first);
		const anotherFunc = vi.fn(() => second);
		useCleanup(func, anotherFunc)();

		for (const fn of [first, second, func, anotherFunc]) {
			expect(fn).toBeCalledTimes(1);
		}
	});

	it('Should work with nested arrays', () => {
		const functions = generateSpyFunctions(6);
		const [one, two, three, four, five, six] = functions;
		useCleanup([one, [two, three, [four, [five, [six]]]]])();

		for (const func of functions) {
			expect(func).toBeCalledTimes(1);
		}
	});

	it('Should work with complex structures', async () => {
		const groups = generate(3, () => generateSpyFunctions(3));
		const [firstGroup, secondGroup, thirdGroup] = groups;
		const functions = generateSpyFunctions(6);
		const [one, two, three, four, five, six] = functions;

		await useCleanup(one, [
			two,
			async () => [three, firstGroup],
			[{ destroy: () => [four, five, six, secondGroup, new Promise((res) => res(thirdGroup))] }]
		])();

		for (const func of [...groups.flat(), ...functions]) {
			expect(func).toBeCalledTimes(1);
		}
	});
});
