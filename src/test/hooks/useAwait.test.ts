import { useAwait } from '$lib/hooks';
import { isObject } from '$lib/predicate';

it('Should return a promise', () => {
	const promise = useAwait(() => {
		return new Promise((resolve) => resolve('I am with UNATCO.'));
	});
	expect(promise instanceof Promise).toBe(true);
});

it('Should resolve to an object', async () => {
	const good = await useAwait(() => {
		return new Promise((resolve) => resolve('I am with UNATCO.'));
	});
	expect(good).toBeTypeOf('object');
	expect(good !== null).toBe(true);

	const bad = await useAwait(() => {
		return new Promise((resolve, reject) => {
			if (5 == '5') reject('What?');
			else resolve('Well done!');
		});
	});

	expect(bad).toBeTypeOf('object');
	expect(bad !== null).toBe(true);
});

it('Should return an object { failed: false, data } when the given fn resolves', async () => {
	const message = await useAwait(() => {
		return new Promise((resolve) => resolve('I am with UNATCO.'));
	});
	expect(isObject(message, ['failed', 'data'])).toBe(true);
	expect(message.failed).toBe(false);
});

describe('data', () => {
	it('Should be the value the given fn resolves to', async () => {
		const message = await useAwait(() => {
			return new Promise((resolve) => resolve('I am with UNATCO.'));
		});
		expect(message.data).toBe('I am with UNATCO.');
	});
});

it('Should return an object { failed: true, error } when the given fn rejects', async () => {
	const message = await useAwait(() => {
		return new Promise((resolve, reject) => {
			if (5 == '5') reject('What?');
			else resolve('Well done!');
		});
	});
	expect(isObject(message, ['failed', 'error'])).toBe(true);
	expect(message.failed).toBe(true);
});

it('Should catch errors', async () => {
	const digit = await useAwait(async () => {
		throw new Error('I was never properly trained in its operations.');
		return 360;
	});
	expect(digit.failed).toBe(true);
});

describe('error', () => {
	it('Should be the value the given fn rejected with', async () => {
		const message = await useAwait(() => {
			return new Promise((resolve, reject) => {
				if (5 == '5') reject('What?');
				else resolve('Well done!');
			});
		});
		expect(message.error).toBe('What?');

		const digit = await useAwait(async () => {
			throw new Error('I was never properly trained in its operations.');
			return new Promise((resolve) => resolve(360));
		});
		expect(digit.error).toStrictEqual(new Error('I was never properly trained in its operations.'));
	});
});
