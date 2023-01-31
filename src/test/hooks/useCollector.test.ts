import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';
import { useCollector } from '$lib/hooks';

it('Should return a function', () => {
	const free = useCollector({ init: () => [] });
	expect(free).toBeTypeOf('function');
});

it("Should call every property function except 'beforeCollection'", () => {
	const [afterInit, beforeInit, beforeCollection, init] = generateSpyFunctions(4);
	useCollector({ afterInit, beforeCollection, beforeInit, init });
	expect(afterInit).toBeCalledTimes(1);
	expect(beforeInit).toBeCalledTimes(1);
	expect(beforeCollection).not.toBeCalled();
	expect(init).toBeCalledTimes(1);
});

it('Should call every function in the correct order', () => {
	const order: number[] = [];
	useCollector({
		beforeInit: () => {
			order.push(0);
		},
		init: () => {
			order.push(1);
		},
		afterInit: () => {
			order.push(2);
		}
	});
	expect(order).toEqual([0, 1, 2]);
});

it('Should not throw if given nulllable boolean values', () => {
	const nonCollectable = [null, true, undefined, false];
	expect(() => {
		useCollector({
			beforeInit: () => nonCollectable,
			init: () => nonCollectable,
			afterInit: () => nonCollectable
		});
	}).not.toThrow();
});

it('Should not call any given collectable value unless the returned function is called', () => {
	const toCollect = generateSpyFunctions(3);

	const free = useCollector({
		beforeInit: () => [toCollect[0]],
		init: () => [toCollect[1]],
		afterInit: () => [toCollect[2]]
	});
	for (const fn of toCollect) expect(fn).not.toBeCalled();

	free();
	for (const fn of toCollect) {
		expect(fn).toBeCalledTimes(1);
	}
});

it('Should run beforeCollection after calling the returned function', () => {
	const beforeCollection = vi.fn(() => {});
	useCollector({ init: () => [], beforeCollection })();
	expect(beforeCollection).toBeCalledTimes(1);
});

it('Should be able to call functions', () => {
	const functions = generateSpyFunctions(3);
	useCollector({
		beforeInit: () => functions[0],
		init: () => functions[1],
		afterInit: () => functions[2]
	})();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
	}
});

it('Should work with an array of functions', () => {
	const groups = generate(3, () => generateSpyFunctions(3));
	useCollector({
		beforeInit: () => [groups[0]],
		init: () => [groups[1]],
		afterInit: () => [groups[2]]
	})();
	for (const func of groups.flat()) {
		expect(func).toBeCalledTimes(1);
	}
});

it('Should work with action-like values', () => {
	const functions = generateSpyFunctions(3);
	const actions = generate(3, (index) => {
		return { destroy: functions[index] };
	});
	useCollector({
		beforeInit: () => actions[0],
		init: () => actions[1],
		afterInit: () => actions[2]
	})();
	for (const func of functions) {
		expect(func).toBeCalledTimes(1);
	}
});

describe('Recursion', () => {
	it('Should work with nested arrays', () => {
		const arrays = generate(6, () => generateSpyFunctions(3));
		useCollector({
			beforeInit: () => [arrays[0], [arrays[1]]],
			init: () => [arrays[2], [arrays[3]]],
			afterInit: () => [arrays[4], arrays[5]]
		})();
		for (const func of arrays.flat()) {
			expect(func).toBeCalledTimes(1);
		}
	});

	it('Should work with complex structures', async () => {
		const functions = generateSpyFunctions(5);
		useCollector({
			beforeInit: () => [functions[0], { destroy: functions[1] }],
			init: () => [functions[2], { destroy: functions[3] }],
			afterInit: () => [functions[4], { destroy: functions[5] }]
		})();
		for (const func of functions) {
			expect(func).toBeCalledTimes(1);
		}
	});
});
