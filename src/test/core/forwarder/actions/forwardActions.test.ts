import Sample from './__forwardActions.svelte';
import { act, render } from '@testing-library/svelte';
import { generateActions, generateSpyFunctions } from '@test-utils';
import { generate } from '$lib/utils';

describe('onDestroy', () => {
	it('Should call all the actions destroy method', async () => {
		const destroyFunctions = generateSpyFunctions(3);
		const actions = generate(3, (index) => {
			return vi.fn(() => ({ destroy: destroyFunctions[index] }));
		});
		const { component, getByTestId } = render(Sample, { props: { actions } });
		const element = getByTestId('element');
		for (const action of actions) {
			expect(action).toBeCalledTimes(1);
			expect(action).toBeCalledWith(element);
		}
		await act(() => component.$set({ isShowing: false }));
		for (const destroy of destroyFunctions) {
			expect(destroy).toBeCalledTimes(1);
		}
	});

	it('Should only call the destroy method of the current actions', async () => {
		const initialDestroyFunctions = generateSpyFunctions(3);
		const initialActions = generate(3, (index) => {
			return vi.fn(() => ({ destroy: initialDestroyFunctions[index] }));
		});
		const currentDestroyFunctions = generateSpyFunctions(3);
		const currentActions = generate(3, (index) => {
			return vi.fn(() => ({ destroy: currentDestroyFunctions[index] }));
		});
		const { component, getByTestId } = render(Sample, { props: { actions: initialActions } });
		await act(() => component.$set({ actions: currentActions }));
		await act(() => component.$set({ isShowing: false }));
		for (let index = 0; index < initialActions.length; index++) {
			const initialDestroy = initialDestroyFunctions[index];
			const currentDestroy = currentDestroyFunctions[index];
			expect(initialDestroy).toBeCalledTimes(1);
			expect(currentDestroy).toBeCalledTimes(1);
		}
	});
});

describe('onMount', () => {
	it('Should call all the given actions once', () => {
		const actions = generateActions(4);
		const { getByTestId } = render(Sample, { props: { actions } });
		const element = getByTestId('element');
		for (const action of actions) {
			expect(action).toBeCalledTimes(1);
		}
	});

	it('Should pass the element', () => {
		const actions = generateActions(4);
		const { getByTestId } = render(Sample, { props: { actions } });
		const element = getByTestId('element');
		for (const action of actions) {
			expect(action).toBeCalledTimes(1);
			expect(action).toBeCalledWith(element);
		}
	});

	it('Should not call the actions if the element is not rendered', () => {
		const actions = generateActions(4);
		render(Sample, { props: { isShowing: false, actions } });
		for (const action of actions) {
			expect(action).not.toBeCalled();
		}
	});

	it('Should not call the destroy method', () => {
		const destroy = vi.fn(() => {});
		const action = () => ({ destroy });
		render(Sample, { props: { actions: [action] } });
		expect(destroy).not.toBeCalled();
	});

	it('Should call the actions everytime the element is rendered', async () => {
		const actions = generateActions(4);
		const { component, getByTestId } = render(Sample, { props: { actions } });
		const element = getByTestId('element');
		for (const action of actions) {
			expect(action).toBeCalledTimes(1);
		}

		await act(() => component.$set({ isShowing: false }));
		await act(() => component.$set({ isShowing: true }));
		for (const action of actions) {
			expect(action).toBeCalledTimes(2);
		}

		await act(() => component.$set({ isShowing: false }));
		await act(() => component.$set({ isShowing: true }));
		for (const action of actions) {
			expect(action).toBeCalledTimes(3);
		}
	});
});

describe('onUpdate', () => {
	it('Should call all the new actions', async () => {
		const initialActions = generateSpyFunctions(3);
		const currentActions = generateSpyFunctions(3);
		const { component, getByTestId } = render(Sample, { props: { actions: initialActions } });
		await act(() => component.$set({ actions: currentActions }));
		for (let index = 0; index < currentActions.length; index++) {
			const currentAction = currentActions[index];
			expect(currentAction).toBeCalledTimes(1);
		}
	});

	it('Should call the destroy method of deleted actions', async () => {
		const initialDestroyFunctions = generateSpyFunctions(3);
		const initialActions = generate(3, (index) => {
			return vi.fn(() => ({ destroy: initialDestroyFunctions[index] }));
		});
		const currentActions = generateSpyFunctions(3);
		const { component, getByTestId } = render(Sample, { props: { actions: initialActions } });
		await act(() => component.$set({ actions: currentActions }));
		for (let index = 0; index < currentActions.length; index++) {
			const initialDestroy = initialDestroyFunctions[index];
			expect(initialDestroy).toBeCalledTimes(1);
		}
	});

	it('Should not call the actions again that have not been deleted', async () => {
		const initialActions = generateSpyFunctions(3);
		const { component, getByTestId } = render(Sample, { props: { actions: initialActions } });
		const currentActions = generateSpyFunctions(2);
		const preservedAction = initialActions[2];
		currentActions.push(preservedAction);
		await act(() => component.$set({ actions: currentActions }));
		expect(preservedAction).toBeCalledTimes(1);
	});
});
