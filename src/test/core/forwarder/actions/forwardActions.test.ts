import Component from './__forwardActions.svelte';
import { generateActions, generateSpyFunctions } from '@test-utils';
import { act, cleanup, render } from '@testing-library/svelte';
import { generate } from '@utils';

afterEach(() => cleanup());

describe('onMount', () => {
	it('Should forward all the given actions', async () => {
		const actions = generateActions(4);
		render(Component, { props: { use: actions } });
		for (const [action] of actions) {
			expect(action).toBeCalledTimes(1);
		}
	});

	it('Should pass the element and the given parameter', async () => {
		const actions = generateActions(3, 'Twenty One');
		const { findByText } = render(Component, { props: { use: actions } });
		const element = await findByText('Container');

		for (const [action, parameter] of actions) {
			expect(action).toBeCalledWith(element, parameter);
		}
	});

	it('Should not call the actions if the element is not rendered', () => {
		const actions = generateActions(3);
		render(Component, { props: { showing: false, use: actions } });
		for (const [action] of actions) {
			expect(action).not.toBeCalled();
		}
	});

	it('Should not call the destroy and update action methods', () => {
		const [update, destroy] = generateSpyFunctions(2);
		const action = () => ({ update, destroy });
		render(Component, { use: [[action]] });
		expect(update).not.toBeCalled();
		expect(destroy).not.toBeCalled();
	});

	it('Should call the actions everytime the element is rendered', async () => {
		const actions = generateActions(5);
		const { component } = render(Component, { use: actions });

		for (const [action] of actions) {
			expect(action).toBeCalledTimes(1);
		}

		await act(() => component.$set({ showing: false }));
		await act(() => component.$set({ showing: true }));
		for (const [action] of actions) {
			expect(action).toBeCalledTimes(2);
		}

		await act(() => component.$set({ showing: false }));
		await act(() => component.$set({ showing: true }));
		for (const [action] of actions) {
			expect(action).toBeCalledTimes(3);
		}
	});
});

describe('onUpdate', () => {
	it('Should call all the actions update methods', async () => {
		const functions = generateSpyFunctions(2);
		const first = () => ({ update: functions[0] });
		const second = () => ({ update: functions[1] });
		const { component } = render(Component, { props: { first, second } });

		await act(() => component.$set({ firstParam: 'Smith' }));
		expect(functions[0]).toBeCalledWith('Smith');
		await act(() => component.$set({ secondParam: 30 }));
		expect(functions[1]).toBeCalledWith(30);
	});

	it('Should not call the update method if the argument has not changed', async () => {
		const update = generateSpyFunctions(2);
		const first = () => ({ update: update[0] });
		const second = () => ({ update: update[1] });
		const { component } = render(Component, { props: { first, second } });

		await act(() => component.$set({ firstParam: 'Jet' }));
		expect(update[0]).toBeCalledTimes(1);

		await act(() => component.$set({ firstParam: 'Jet' }));
		expect(update[0]).toBeCalledTimes(1);

		expect(update[1]).toBeCalledTimes(0);
	});

	it('Should add and call the new actions', async () => {
		const [one, two] = generateSpyFunctions(2);
		const [three, four] = generateSpyFunctions(2);
		const { component, findByText } = render(Component, { props: { use: [[one], [two]] } });
		const element = await findByText('Container');

		await act(() =>
			component.$set({
				use: [
					[three, false],
					[four, true]
				]
			})
		);
		expect(three).toBeCalledWith(element, false);
		expect(four).toBeCalledWith(element, true);
	});

	it('Should remove and run the destroy method of the removed actions', async () => {
		const destroy = generateSpyFunctions(4);
		const actions = generate(4, (index) => () => ({ destroy: destroy[index] }));
		const { component } = render(Component, { use: [[actions[0]], [actions[1]]] });

		await act(() => component.$set({ use: [[actions[2]], [actions[3]]] }));
		expect(destroy[0]).toBeCalled();
		expect(destroy[1]).toBeCalled();
	});
});

describe('onDestroy', () => {
	it('Should call all the actions destroy methods', async () => {
		const functions = generateSpyFunctions(2);
		const foo = () => ({ destroy: functions[0] });
		const bar = () => ({ destroy: functions[1] });
		const { component } = render(Component, { use: [[foo], [bar]] });

		await act(() => component.$set({ showing: false }));
		for (const destroy of functions) {
			expect(destroy).toBeCalledTimes(1);
		}
	});

	it('Should only call the current actions and not the removed ones during update', async () => {
		const [fooFn, barFn] = generateSpyFunctions(4);
		const foo = () => ({ destroy: fooFn });
		const bar = () => ({ destroy: barFn });
		const { component } = render(Component, { use: [[foo]] });

		await act(() => component.$set({ use: [[bar]] }));
		expect(fooFn).toBeCalledTimes(1);

		await act(() => component.$set({ showing: false }));
		expect(fooFn).toBeCalledTimes(1);
		expect(barFn).toBeCalledTimes(1);
	});
});
