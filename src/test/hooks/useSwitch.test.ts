import { useSwitch } from '$lib/hooks';
import { isWritable } from '$lib/predicate';

const isChecked = useSwitch(false);

it('Should return a valid writable store', () => {
	expect(isWritable(isChecked)).toBe(true);
});

describe('method -> toggle', () => {
	it('Should have a toggle method', () => {
		expect(isChecked).toHaveProperty('toggle');
		expect(isChecked.toggle).toBeTypeOf('function');
	});

	it('Should toggle the store value', () => {
		const isChecked = useSwitch(false);
		expect(isChecked.value).toBe(false);
		isChecked.toggle();
		expect(isChecked.value).toBe(true);
	});
});

describe('getter and setter -> value', () => {
	it('Should have a value getter', () => {
		expect(isChecked).toHaveProperty('value');
	});

	it('Should return the current store value', () => {
		const isChecked = useSwitch(false);
		expect(isChecked.value).toBe(false);
		isChecked.toggle();
		expect(isChecked.value).toBe(true);
	});

	it('Should set the current store value', () => {
		const isChecked = useSwitch(false);
		expect(isChecked.value).toBe(false);
		isChecked.value = true;
		expect(isChecked.value).toBe(true);
	});
});
