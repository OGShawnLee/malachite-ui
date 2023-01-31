import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import { render } from '@testing-library/svelte';
import { SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';
import { ActionComponent, Behaviour } from './samples';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import {
	ContextParent,
	createContextParentRenderer,
	fuseElementsName,
	generateActions
} from '@test-utils';

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

describe.skip('Behaviour', () => {
	describe.skip('Description and Label', () => {
		it.each([
			['allow rendering them outside of the switch', Behaviour],
			['expose their actions', ActionComponent]
		])('Should %s', (message, Component) => {
			const { button, getAllDescriptions, getAllLabels } = initComponent(Component);
			const descriptions = getAllDescriptions();
			const labels = getAllLabels();

			expect(descriptions).toHaveLength(3);
			expect(labels).toHaveLength(3);

			expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));
			expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
		});
	});
});

describe.skip('Rendering', () => {
	it.skip('Should be rendered as a slot by default', () => {
		const { getByTestId } = render(SwitchGroup, { props: { 'data-testid': 'switch-group' } });
		expect(() => getByTestId('switch-group')).toThrow();
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(SwitchGroup, { props: { as, 'data-testid': 'switch-group' } });
		const group = getByTestId('switch-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it.skip('Should be able of forwarding attributes', async () => {
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

	it.skip('Should be able of forwarding actions', () => {
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

describe.skip('Context', () => {
	interface ContextKeys {
		Checked: any;
		initDescription: any;
		initLabel: any;
		InitDescription: any;
		InitLabel: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'switch-group');

	describe.skip('Unset Context', () => {
		describe.skip.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if not rendered with a SwichGroup Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe.skip('Invalid Context', () => {
		describe.skip.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered with an invalid SwitchGroup Context', () => {
				expect(() => init.skip(Component, null)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => init.skip(Component, null)).toThrow(messages.invalid);
			});

			it.skip('Should validate the context value thoroughly', () => {
				expect(() =>
					init.skip(Component, {
						Checked: null,
						initDescription: null,
						initLabel: null,
						InitDescription: null,
						InitLabel: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init.skip(Component, {
						Checked: { subscribe: null },
						initDescription: () => 64,
						initLabel: () => 360,
						InitDescription: { subscribe: null },
						InitLabel: { subscribe: null }
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
