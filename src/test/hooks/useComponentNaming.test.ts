import { useComponentNaming } from '$lib/hooks';
import { isFunction, isInterface, isString } from '$lib/predicate';

it('Should return an object (not null)', () => {
	const object = useComponentNaming('button');
	expect(object).toBeDefined();
	expect(object).toBeTypeOf("object");
});

it('Should return an object: { baseName: string, nameChild: function }', () => {
	const object = useComponentNaming('button');
	expect(
		isInterface<ReturnType<typeof useComponentNaming>>(object, {
			baseName: isString,
			nameChild: isFunction
		})
	);
});

describe('baseName', () => {
	it('Should be unique', () => {
		const cache = new Set<string>();
		const size = 100;
		for (let index = 0; index < size; index++) {
			cache.add(useComponentNaming('button').baseName);
		}
		expect(cache.size).toBe(size);
	});

	it('Should be formated as {prefix}-{name}-{uid}', () => {
		const { baseName } = useComponentNaming('button');
		const parts = baseName.split('-');
		expect(parts[0]).toBe('malachite');
		expect(parts[1]).toBe('button');
		expect(parts[2]).toBeTypeOf('string');
	});
});

describe('nameChild', () => {
	const { baseName, nameChild } = useComponentNaming('button');

	it('Should return a string', () => {
		const name = nameChild('label');
		expect(name).toBeTypeOf('string');
	});

	it('Should be unique', () => {
		const cache = new Set<string>();
		const size = 100;
		for (let index = 0; index < size; index++) {
			cache.add(nameChild('label'));
		}
		expect(cache.size).toBe(size);
	});

	it('Should be formated as {baseName}-{name}-{uid}', () => {
		const name = nameChild('label');
		const included = name.includes(baseName);
		expect(included).toBe(true);
		const parts = name.split(baseName)[1].split('-');
		expect(parts[1]).toBe('label');
		expect(parts[2]).toBeTypeOf('string');
	});
});

describe('Configuration', () => {
	describe('name', () => {
		it('Should change the name fragment', () => {
			const { baseName, nameChild } = useComponentNaming({ name: 'accordion' });
			expect(baseName.includes('accordion')).toBe(true);
			expect(nameChild('button').includes('accordion')).toBe(true);
		});
	});

	describe('parent', () => {
		it('Should be added before the name fragment', () => {
			const { baseName, nameChild } = useComponentNaming({ name: 'item', parent: 'accordion' });
			const fragments = baseName.split('-');
			expect(fragments[0]).toBe('accordion');
			expect(fragments[1]).toBe('item');

			const childName = nameChild('label');
			expect(childName.includes(baseName)).toBe(true);
		});
	});

	describe('overwriteWith', () => {
		it('Should overwrite baseName string completely', () => {
			const { baseName, nameChild } = useComponentNaming({
				name: 'item',
				parent: 'accordion',
				overwriteWith: 'wombo-combo'
			});
			expect(baseName).toBe('wombo-combo');
		});
	});
});
