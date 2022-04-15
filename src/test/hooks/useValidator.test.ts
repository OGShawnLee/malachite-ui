import { useValidator } from '@hooks';
import { get, writable } from 'svelte/store';
import { useCleaner } from '@test-utils';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('useValidator', () => {
	const Main = writable('Mexico');
	const Validator = writable(false);
	const loop = useValidator(Main, Validator);

	it('Should return a function', () => {
		expect(loop).toBeInstanceOf(Function);
	});

	it('Should take a callback and return an unsubscriber', () => {
		const Name = writable('James');
		const Validator = writable(true);
		const loop = useValidator(Name, Validator);
		const func = vi.fn(() => {});
		const destroy = loop(func);

		expect(destroy).toBeInstanceOf(Function);
		expect(func).toBeCalledTimes(1);
		expect(func).toBeCalledWith('James');

		destroy();
		Name.set('Smith');
		expect(func).toBeCalledTimes(1);
	});

	it('Should only run the callback if the Validator is true', () => {
		const fn = vi.fn(() => {});
		add(loop(fn));
		expect(fn).not.toBeCalled();

		Validator.set(true);
		expect(fn).toBeCalledTimes(1);
	});

	it('Should pass the current value of the main store', () => {
		Validator.set(true);
		const fn = vi.fn(() => {});
		add(loop(fn));

		expect(fn).toBeCalledTimes(1);
		expect(fn).toBeCalledWith(get(Main));

		Main.set('Canada');
		expect(fn).toBeCalledTimes(2);
		expect(fn).toBeCalledWith('Canada');

		Main.set('Taiwan');
		expect(fn).toBeCalledTimes(3);
		expect(fn).toBeCalledWith('Taiwan');
	});

	it('Should run the callback when the Validator is false if useFalse is true', () => {
		const Main = writable(14);
		const Validator = writable(false);
		const loop = useValidator(Main, Validator, true);

		const fn = vi.fn(() => {});
		add(loop(fn));
		expect(fn).toBeCalledTimes(1);

		Main.update((age) => age * 2);
		expect(fn).toBeCalledTimes(2);

		Main.set(100);
		expect(fn).toBeCalledTimes(3);
		expect(fn).toBeCalledWith(100);

		Validator.set(true);
		Main.set(200);
		expect(fn).toBeCalledTimes(3);
	});
});
