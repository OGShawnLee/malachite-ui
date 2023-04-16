import { useCatch } from '$lib/hooks';
import { isObject } from '$lib/predicate';

function unsafe() {
  
}

it('Should return an object', () => {
	const message = useCatch(() => 'I am with UNATCO.');
	expect(message).toBeTypeOf('object');
	expect(message !== null).toBe(true);
});

it('Should return an object { failed: false, data } when there is no error', () => {
	const message = useCatch(() => 'I am with UNATCO.');
	expect(isObject(message, ['failed', 'data'])).toBe(true);
	expect(message.failed).toBe(false);
});

describe('data', () => {
	it('Should be the value returned by the given function', () => {
		const message = useCatch(() => 'I am with UNATCO.');
		expect(message.data).toBe('I am with UNATCO.');
	});
});

it('Should return an object { failed: true, error } when the given function throws', () => {
	const message = useCatch(() => {
		if (5 == '5') throw Error('What?');
		else return 'Well done!';
	});
	expect(isObject(message, ['failed', 'error'])).toBe(true);
	expect(message.failed).toBe(true);
});

describe('error', () => {
	it('Should be the error thrown by the given function', () => {
		const message = useCatch(() => {
			if (5 == '5') throw Error('What?');
			else return 'Well done!';
		});
		expect(message.error).toStrictEqual(new Error('What?'));

		const digit = useCatch(() => {
			throw new Error('I was never properly trained in its operations.');
			return 360;
		});
		expect(digit.error).toStrictEqual(new Error('I was never properly trained in its operations.'));
	});
});
