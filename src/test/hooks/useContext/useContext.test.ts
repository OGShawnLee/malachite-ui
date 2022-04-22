import Parent from './__parent.svelte';
import Child from './__child.svelte';
import { useContext } from '$lib/hooks';
import { isObject, isString } from '$lib/predicate';
import { cleanup, render } from '@testing-library/svelte';

afterEach(() => cleanup());

const context = useContext({
	component: 'disclosure',
	predicate: (val): val is { name: string } => isObject(val, ['name'])
});

it('Should return an object', () => {
	expect(context).toBeInstanceOf(Object);
});

it('Should have a getMethod method', () => {
	expect(context).toHaveProperty('getContext');
	expect(context.getContext).toBeInstanceOf(Function);
});

it('Should have a setContext method', () => {
	expect(context).toHaveProperty('setContext');
	expect(context.setContext).toBeInstanceOf(Function);
});

describe('options', () => {
	const predicate = vi.fn((val: unknown): val is { age: number } => isObject(val, ['age']));
	const { getContext, setContext } = useContext({
		component: 'cowboy bebop',
		predicate: predicate as unknown as (val: unknown) => val is { age: number }
	});

	describe('component', () => {
		it('Should use it to create the key of the context', () => {
			function danger() {
				render(Parent, { props: { Child, getContext, setContext } });
			}

			expect(danger).toThrow('Invalid Malachite-Cowboy-Bebop Context');
		});
	});

	describe('predicate', () => {
		it('Should call the predicate function to determine if the context is valid or not', () => {
			const contextValue = { age: 24 };
			render(Parent, {
				props: { Child, getContext, setContext: () => setContext(contextValue) }
			});

			expect(predicate).toBeCalledWith(contextValue);
			expect(predicate).toHaveReturnedWith(true);
		});
	});
});

it('Should set the context with setContext and get it with getContext', () => {
	const receiveContext = vi.fn(() => {});
	const value = { name: 'James' };
	render(Parent, {
		props: {
			Child,
			getContext: context.getContext,
			receiveContext,
			setContext: () => context.setContext(value)
		}
	});

	expect(receiveContext).toBeCalledWith(value);
});

it('Should throw an specific error if the context was not set', () => {
	const { getContext } = useContext({
		component: 'dialog',
		predicate: (val: unknown): val is string => isString(val)
	});
	function danger() {
		render(Parent, { props: { Child, getContext } });
	}
	expect(danger).toThrow('Unable to Find Malachite-Dialog Context');
});
