import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import { render } from '@testing-library/svelte';
import { SwitchGroup } from '$lib/components';
import { ActionComponent, Behaviour } from './samples';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import { fuseElementsName, generateActions } from '@test-utils';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	const group = result.getByTestId('switch-group');
	const button = result.getByRole('switch');

	function getAllDescriptions(textContent = 'Switch Description') {
		return result.getAllByText(textContent);
	}

	function getAllLabels(textContent = 'Switch Label') {
		return result.getAllByText(textContent);
	}

	return { ...result, button, getAllDescriptions, getAllLabels, group };
}

describe('Behaviour', () => {
	describe('Description and Label', () => {
		it.each([
			['allow rendering them outside of the switch', Behaviour],
			['expose their actions', ActionComponent]
		])('Should %s', (message, Component) => {
			const { button, getAllDescriptions, getAllLabels } = initComponent(Component);
			const descriptions = getAllDescriptions();
			const labels = getAllLabels();

			expect(descriptions).toHaveLength(3);
			expect(labels).toHaveLength(3);

			expect(button).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
			expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a slot by default', () => {
		const { getByTestId } = render(SwitchGroup, { props: { 'data-testid': 'switch-group' } });
		expect(() => getByTestId('switch-group')).toThrow();
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(SwitchGroup, { props: { as, 'data-testid': 'switch-group' } });
		const group = getByTestId('switch-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'a switch group' };
		const { getByTestId } = render(SwitchGroup, {
			props: {
				as: 'div',
				'data-testid': 'switch-group',
				...attributes
			}
		});
		const group = getByTestId('switch-group');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(SwitchGroup, {
			props: { as: 'div', use: actions, 'data-testid': 'switch-group' }
		});
		const group = getByTestId('switch-group');
		for (const [action, parameter] of actions) {
			expect(action).toBeCalledWith(group, parameter);
		}
	});
});

// TODO: TEST isChecked slot prop
