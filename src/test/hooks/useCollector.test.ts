import { generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';
import { useCollector } from '$lib/hooks';

it('Should return an async function', () => {
	const func = useCollector({ init: () => [] });
	expect(func).toBeInstanceOf(Function);
	expect(func()).toBeInstanceOf(Promise);
});

it('Should run every function except beforeCollection', () => {
	const [beforeInit, afterInit, beforeCollection] = generateSpyFunctions(3);
	const init = vi.fn(() => []);

	useCollector({ beforeCollection, beforeInit, init, afterInit });

	expect(beforeInit).toBeCalledTimes(1);
	expect(init).toBeCalledTimes(1);
	expect(afterInit).toBeCalledTimes(1);
	expect(beforeCollection).not.toBeCalledTimes(1);
});

it('Should run every function in the correct order', () => {
	const order: number[] = [];
	useCollector({
		beforeInit: () => {
			order.push(0);
		},
		init: () => {
			return order.push(1), [];
		},
		afterInit: () => {
			order.push(2);
		}
	});
	expect(order).toEqual([0, 1, 2]);
});

it('Should not throw if given nulllable boolean values', () => {
	const nonCollectable = [null, true, undefined, []];
	function check() {
		useCollector({
			beforeInit: () => nonCollectable,
			init: () => nonCollectable,
			afterInit: () => nonCollectable
		});
	}
	expect(check).not.toThrow();
});

it('Should not destroy if not called', () => {
	const toCollect = generateSpyFunctions(3);
	useCollector({
		beforeInit: () => [toCollect[0]],
		init: () => [toCollect[1]],
		afterInit: () => [toCollect[2]]
	});
	for (const fn of toCollect) {
		expect(fn).not.toBeCalled();
	}
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

it('Should run beforeCollection when destroying', () => {
	const beforeCollection = vi.fn(() => {});
	useCollector({ init: () => [], beforeCollection })();
	expect(beforeCollection).toBeCalledTimes(1);
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

describe('recursion', () => {
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

	it('Should work with functions that return collectable values', () => {});

	it('Should work with promises that return collectable values', () => {});

	it('Should work with complex structures', async () => {
		const functions = generateSpyFunctions(9);
		await useCollector({
			beforeInit: () => [
				functions[0],
				new Promise((res) => res(functions[1])),
				{ destroy: functions[2] }
			],
			init: () => [
				functions[3],
				new Promise((res) => res(functions[4])),
				{ destroy: functions[5] }
			],
			afterInit: () => [
				functions[6],
				new Promise((res) => res(functions[7])),
				{ destroy: functions[8] }
			]
		})();
		for (const func of functions) {
			expect(func).toBeCalledTimes(1);
		}
	});
});
