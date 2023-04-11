import { computed, readonly, ref, watch } from '$lib/utils/store-management';
import { derived, get, readable, writable } from 'svelte/store';
import { isStore, isReadableRef, isWritable } from '$lib/predicate';

describe('computed', () => {
	it('Should return a valid readable store', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		expect(isStore(double)).toBe(true);
	});

	describe('value()', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		it('Should have a value method', () => {
			expect(double).toHaveProperty('value');
			expect(double.value).toBeTypeOf('function');
		});

		it('Should return the current ref value', () => {
			expect(double.value()).toBe(20);
			count.set(20);
			expect(double.value()).toBe(40);
			count.set(40);
			expect(double.value()).toBe(80);
		});
	});

	it('Should compute when created', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		expect(double.value()).toBe(20);
	});

	it('Should compute when the original store value is updated', () => {
		const name = ref('Vincent');
		const fullName = computed(name, (name) => name + ' Law');
		expect(fullName.value()).toBe('Vincent Law');
		name.set('Raul');
		expect(fullName.value()).toBe('Raul Law');
		name.update((name) => name.toUpperCase());
		expect(fullName.value()).toBe('RAUL Law');
	});

	it('Should work with another computed store', () => {
		const count = ref(2);
		const double = computed(count, (count) => count * 2);
		const quadruple = computed(double, (double) => double * 2);
		expect(quadruple.value()).toBe(8);
		count.set(10);
		expect(quadruple.value()).toBe(40);
		count.update((count) => count * 2);
		expect(quadruple.value()).toBe(80);
	});

	it('Should work with an array of composables', () => {
		const count = ref(2);
		const double = computed(count, (count) => count * 2);
		const quadruple = computed(double, (double) => double * 2);
		const doubleStr = computed([count, double], ([count, double]) => {
			return `${count} x 2 = ${double}`;
		});
		const megaNumberStr = computed(
			[double, quadruple],
			([double, quadruple]) => `${double} x ${quadruple} = ${double * quadruple}`
		);

		expect(doubleStr.value()).toBe('2 x 2 = 4');
		expect(megaNumberStr.value()).toBe('4 x 8 = 32');
		count.set(4);
		expect(doubleStr.value()).toBe('4 x 2 = 8');
		expect(megaNumberStr.value()).toBe('8 x 16 = 128');
		count.update((count) => count * 10);
		expect(doubleStr.value()).toBe('40 x 2 = 80');
		expect(megaNumberStr.value()).toBe('80 x 160 = 12800');

		const name = ref('Vincent');
		const lastName = ref('Law');
		const fullName = computed([name, lastName], ([name, lastName]) => {
			return `${name} ${lastName}`;
		});
		const uppercase = computed(fullName, (fullName) => fullName.toUpperCase());

		expect(fullName.value()).toBe('Vincent Law');
		expect(uppercase.value()).toBe('VINCENT LAW');
		name.set('James');
		expect(fullName.value()).toBe('James Law');
		expect(uppercase.value()).toBe('JAMES LAW');
		lastName.set('Cena');
		expect(fullName.value()).toBe('James Cena');
		expect(uppercase.value()).toBe('JAMES CENA');
		name.update((name) => name.toLowerCase());
		expect(fullName.value()).toBe('james Cena');
		expect(uppercase.value()).toBe('JAMES CENA');
		lastName.update((lastName) => lastName.toLowerCase());
		expect(fullName.value()).toBe('james cena');
		expect(uppercase.value()).toBe('JAMES CENA');
	});
});

describe('readonly', () => {
	const count = writable(0);
	const double = derived(count, (count) => count * 2);
	const name = ref('James');
	const upperName = computed(name, (name) => name.toUpperCase());
	const readCount = readonly(count);
	const readDouble = readonly(double);
	const readName = readonly(name);
	const readUpperName = readonly(upperName);
	const readInstances = [readCount, readDouble, readName, readUpperName];

	it('Should return an object (no null)', () => {
		for (const read of readInstances) {
			expect(typeof read === 'object').toBe(true);
			expect(read !== null).toBe(true);
		}
	});

	it('Should return a readable store if passed svelte stores', () => {
		expect(isStore(readCount));
		expect(isStore(readDouble));
		expect(isReadableRef(readCount)).toBe(false);
		expect(isReadableRef(readDouble)).toBe(false);
	});

	it('Should return a readable ref if passed a computed or a ref', () => {
		expect(isReadableRef(readName)).toBe(true);
		expect(isReadableRef(readUpperName)).toBe(true);
	});

	it('Should return a new object', () => {
		expect(readCount).not.toBe(count);
		expect(readDouble).not.toBe(double);
		expect(readName).not.toBe(name);
		expect(readUpperName).not.toBe(upperName);
	});
});

describe('ref', () => {
	it('Should return a valid writable store', () => {
		const name = ref('Jack');
		expect(isWritable(name)).toBe(true);
	});

	describe('value()', () => {
		const count = ref(10);
		it('Should have a value method', () => {
			expect(count).toHaveProperty('value');
			expect(count.value).toBeTypeOf('function');
		});

		it('Should return the current ref value', () => {
			expect(count.value()).toBe(10);
			count.set(20);
			expect(count.value()).toBe(20);
			count.set(40);
			expect(count.value()).toBe(40);
		});
	});
});

describe('watch', () => {
	it('Should return void', () => {
		const count = ref(10);
		const result = watch(count, () => {});
		expect(result).not.toBeDefined();
	});

	it('Should call the given callback when the store value changes', () => {
		const count = ref(10);
		const fn = vi.fn(() => {});
		watch(count, fn);
		expect(fn).not.toBeCalled();
		count.set(20);
		expect(fn).toBeCalledTimes(1);
		expect(fn).toBeCalledWith(20);
		count.update((count) => count * 2);
		expect(fn).toBeCalledTimes(2);
		expect(fn).toBeCalledWith(40);
	});

	it('Should work with computed', () => {
		const count = ref(10);
		const double = computed(count, (count) => count * 2);
		const fn = vi.fn(() => {});
		watch(double, fn);
		expect(fn).not.toBeCalled();
		count.set(5);
		expect(fn).toBeCalledTimes(1);
		expect(fn).toBeCalledWith(10);
		count.set(20);
		expect(fn).toBeCalledTimes(2);
		expect(fn).toBeCalledWith(40);
	});
});
