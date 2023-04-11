import '@testing-library/jest-dom';
import { ActionComponent, Component, FragmentComponent } from './samples';
import { PopoverGroup } from '$lib';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import { generateActions } from '@test-utils';

const cases = [ActionComponent, Component, FragmentComponent];
describe('Behaviour', () => {
	it.each(cases)(
		'Should allow focusing other PopoverButtons without closing the current open Popover',
		async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const buttons = getAllByTestId('popover-button');
			for (let index = 0; index < buttons.length; index++) {
				const previousButton = buttons[(index || buttons.length) - 1];
				const button = buttons[index];
				await fireEvent.click(button);
				const panel = getByTestId('popover-panel');
				await act(() => previousButton.focus());
				expect(previousButton).toHaveFocus();
				expect(panel).toBeInTheDocument();
			}
		}
	);
	it.each(cases)(
		'Should not allow focusing other PopoverButtons without closing the current open Popover if it has forceFocus enabled',
		async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { forceFocus: true } });
			const buttons = getAllByTestId('popover-button');
			await fireEvent.click(buttons[2]);
			const panel = getByTestId('popover-panel');
			expect(panel).toBeInTheDocument();
			await act(() => buttons[0].focus());
			expect(panel).not.toBeInTheDocument();
		}
	);
});

describe('Slot Props', () => {
	describe('isOpen', () => {
		it.each(cases)('Should be false by default', (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-group');
			expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be true when a Popover is open', async (Component) => {
			const { getByTestId, getAllByTestId } = render(Component);
			const button = getAllByTestId('popover-button')[0];
			const binding = getByTestId('binding-open-group');
			await fireEvent.click(button);
			const panel = getByTestId('popover-panel');
			expect(panel).toBeInTheDocument();
			expect(binding).toHaveTextContent('true');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getByTestId, getAllByTestId } = render(Component);
			const button = getAllByTestId('popover-button')[0];
			const binding = getByTestId('binding-open-group');
			await fireEvent.click(button);
			const panel = getByTestId('popover-panel');
			expect(panel).toBeInTheDocument();
			expect(binding).toHaveTextContent('true');
			await fireEvent.click(button);
			expect(panel).not.toBeInTheDocument();
			expect(binding).toHaveTextContent('false');
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(PopoverGroup, { props: { 'data-testid': 'popover-group' } });
		const group = getByTestId('popover-group');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(PopoverGroup, {
			props: { as, 'data-testid': 'popover-group' }
		});
		const group = getByTestId('popover-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should forward attributes', () => {
		const attributes = { tabIndex: 4, title: 'a popover group' };
		const { getByTestId } = render(PopoverGroup, {
			props: { 'data-testid': 'popover-group', ...attributes }
		});

		const group = getByTestId('popover-group');
		for (const [attribute, value] of Object.entries(attributes)) {
			expect(group).toHaveAttribute(attribute, value.toString());
		}
	});

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(PopoverGroup, { 'data-testid': 'popover-group', use: actions });
		const group = getByTestId('popover-group');
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});
});
