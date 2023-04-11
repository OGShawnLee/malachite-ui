import '@testing-library/jest-dom';
import * as samples from './samples';
import { SwitchDescription, SwitchGroup, SwitchLabel } from '$lib/components';
import { act, fireEvent, render } from '@testing-library/svelte';
import {
	ContextParent,
	createContextParentRenderer,
	fuseElementsName,
	generateActions,
	useRange
} from '@test-utils';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';

const cases = [samples.Component, samples.FragmentComponent];
describe('Attributes', () => {
	describe('Switch', () => {
		describe('aria-describedby', () => {
			it.each(cases)("Should point to all SwitchDescriptions id's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const descriptions = getAllByTestId('switch-description');
				const button = getByTestId('switch');
				expect(button).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
			});

			it.each(cases)('Should be undefined if there are no SwitchDescriptions', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const button = getByTestId('switch');
				expect(button).not.toHaveAttribute('aria-describedby');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const button = getByTestId('switch');
				expect(button).not.toHaveAttribute('aria-describedby');
				await act(() => amount.increment());
				const descriptions = getAllByTestId('switch-description');
				expect(button).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
			});
		});

		describe('aria-labelledby', () => {
			it.each(cases)("Should point to all SwitchLabels id's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const labels = getAllByTestId('switch-label');
				const button = getByTestId('switch');
				expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});

			it.each(cases)('Should be undefined if there are no SwitchLabels', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const button = getByTestId('switch');
				expect(button).not.toHaveAttribute('aria-labelledby');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const button = getByTestId('switch');
				expect(button).not.toHaveAttribute('aria-labelledby');
				await act(() => amount.increment());
				const labels = getAllByTestId('switch-label');
				expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});
		});
	});

	describe('SwitchLabel', () => {
		it.each(cases)('Should have for pointing to the Switch id', (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('switch');
			const labels = getAllByTestId('switch-label');
			for (const label of labels) {
				expect(label.for).toBe(button.id);
			}
		});
	});
});

describe('Behaviour', () => {
	describe('SwitchLabel', () => {
		it.each(cases)('Should toggle the Switch by clicking it', async (Component) => {
			const { getByTestId } = render(Component, { props: { amount: useRange(1) } });
			const button = getByTestId('switch');
			const label = getByTestId('switch-label');
			expect(button.ariaChecked).toBe('false');
			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('true');
		});

		it.each(cases)('Should not toggle the Switch if it is disabled', async (Component) => {
			const { getByTestId } = render(Component, { props: { amount: useRange(1), disabled: true } });
			const button = getByTestId('switch');
			const label = getByTestId('switch-label');
			expect(button.ariaChecked).toBe('false');
			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('false');
		});

		it.each(cases)('Should not toggle the Switch if SwitchLabel is passive', async (Component) => {
			const { getByTestId } = render(Component, { props: { amount: useRange(1), passive: true } });
			const button = getByTestId('switch');
			const label = getByTestId('switch-label');
			expect(button.ariaChecked).toBe('false');
			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('false');
		});
	});
});

describe('Props', () => {
	describe('SwitchLabel', () => {
		describe('Passive', () => {
			it.each(cases)(
				'Should prevent toggling the Switch by clicking the SwitchLabel',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { passive: true } });
					const button = getByTestId('switch');
					const labels = getAllByTestId('switch-label');
					for (const label of labels) {
						await fireEvent.click(label);
						expect(button.ariaChecked).toBe('false');
					}
				}
			);

			it.each(cases)('Should be reactive', async (Component) => {
				const { component, getByTestId } = render(Component, {
					props: { amount: useRange(1) }
				});
				const button = getByTestId('switch');
				const label = getByTestId('switch-label');
				expect(button.ariaChecked).toBe('false');
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('true');
				await act(() => component.$set({ passive: true }));
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('true');
			});
		});
	});
});

describe('Slot Props', () => {
	describe('isChecked', () => {
		describe.each(['Description', 'Group', 'Label', 'Switch'])('From Switch%s scope', (scope) => {
			it.each(cases)('Should expose the Switch checked state', async (Component) => {
				const { getAllByTestId } = render(Component);
				const bindings = getAllByTestId('binding-checked-' + scope.toLowerCase());
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const bindings = getAllByTestId('binding-checked-' + scope.toLowerCase());
				const button = getByTestId('switch');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
				await fireEvent.click(button);
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('true');
				}
			});
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(SwitchGroup, { props: { 'data-testid': 'switch-group' } });
		const group = getByTestId('switch-group');
		expect(hasTagName(group, 'div')).toBe(true);
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
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});
});

// // TODO: TEST isChecked slot prop

describe('Context', () => {
	interface ContextKeys {
		isChecked: any;
		isPassive: any;
		button: any;
		labels: any;
		descriptions: any;
		createSwitchDescription: any;
		createSwitchLabel: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'switch-group');

	describe('Unset Context', () => {
		describe.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it('Should throw an error if not rendered with a SwichGroup Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid SwitchGroup Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(messages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						isChecked: null,
						isPassive: null,
						button: null,
						labels: null,
						descriptions: null,
						createSwitchDescription: null,
						createSwitchLabel: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init(Component, {
						isChecked: { subscribe: null },
						isPassive: { subscribe: null },
						button: () => 64,
						labels: () => 360,
						descriptions: null,
						createSwitchDescription: null,
						createSwitchLabel: null
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
