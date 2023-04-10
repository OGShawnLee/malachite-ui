import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { Switch } from '$lib';
import { elementTagNames } from '$lib/components/render';
import { generateActions, isValidComponentName } from '@test-utils';

const cases = [samples.Component, samples.FragmentComponent];
describe('Attributes', () => {
	it.each(cases)('Should have role set to "switch"', (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('switch');
		expect(button.role).toBe('switch');
	});

	describe('aria-checked', () => {
		it.each(cases)('Should be set to false by default', (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('switch');
			expect(button.ariaChecked).toBe('false');
		});

		it.each(cases)('Should be set to true when switch is checked', (Component) => {
			const { getByTestId } = render(Component, { props: { checked: true } });
			const button = getByTestId('switch');
			expect(button.ariaChecked).toBe('true');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { checked: true } });
			const button = getByTestId('switch');
			expect(button.ariaChecked).toBe('true');
			await fireEvent.click(button);
			expect(button.ariaChecked).toBe('false');
			await act(() => component.$set({ checked: true }));
			expect(button.ariaChecked).toBe('true');
		});
	});
});

describe('Binding -> checked', () => {
	it.each(cases)('Should set the variable to false by default', (Component) => {
		const { getByTestId } = render(Component);
		const binding = getByTestId('binding-checked-global');
		expect(binding).toHaveTextContent('false');
	});

	it.each(cases)('Should be a two-way binding', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('switch');
		const binding = getByTestId('binding-checked-global');
		expect(binding).toHaveTextContent('false');
		await fireEvent.click(button);
		expect(binding).toHaveTextContent('true');
	});
});

describe('Behaviour', () => {
	it.each(cases)('Should be unchecked by default', (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('switch');
		const binding = getByTestId('binding-checked');
		expect(button.ariaChecked).toBe('false');
		expect(binding).toHaveTextContent('false');
	});

	it.each(cases)('Should toggle by clicking', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('switch');
		const binding = getByTestId('binding-checked');
		expect(button.ariaChecked).toBe('false');
		expect(binding).toHaveTextContent('false');
		await fireEvent.click(button);
		expect(button.ariaChecked).toBe('true');
		expect(binding).toHaveTextContent('true');
	});

	it.each(cases)('Should not toggle if it is disabled', async (Component) => {
		const { getByTestId } = render(Component, { props: { disabled: true } });
		const button = getByTestId('switch');
		const binding = getByTestId('binding-checked');
		expect(button.ariaChecked).toBe('false');
		expect(binding).toHaveTextContent('false');
		await fireEvent.click(button);
		expect(button.ariaChecked).toBe('false');
		expect(binding).toHaveTextContent('false');
	});
});

describe('Props', () => {
	describe('checked', () => {
		it.each(cases)('Should check it', (Component) => {
			const { getByTestId } = render(Component, { props: { checked: true } });
			const button = getByTestId('switch');
			const binding = getByTestId('binding-checked');
			expect(button.ariaChecked).toBe('true');
			expect(button).toHaveTextContent('true');
		});

		it.each(cases)('Should be false by default', (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-checked');
			expect(button.ariaChecked).toBe('false');
			expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be false by default', async (Component) => {
			const { component, getByTestId } = render(Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-checked');
			expect(button.ariaChecked).toBe('false');
			expect(binding).toHaveTextContent('false');
			await act(() => component.$set({ checked: true }));
			expect(button.ariaChecked).toBe('true');
			expect(binding).toHaveTextContent('true');
		});
	});

	describe('disabled', () => {
		it.each(cases)('Should disable it', (Component) => {
			const { getByTestId } = render(Component, { props: { disabled: true } });
			const button = getByTestId('switch');
			expect(button.disabled).toBe(true);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { disabled: true } });
			const button = getByTestId('switch');
			expect(button.disabled).toBe(true);
			await act(() => component.$set({ disabled: false }));
			expect(button.disabled).toBe(false);
		});
	});
});

describe('Slot Props', () => {
	describe('isChecked', () => {
		it.each(cases)('Should expose the checked state', (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-checked');
			expect(button.ariaChecked).toBe('false');
			expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-checked');
			expect(button.ariaChecked).toBe('false');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(button.ariaChecked).toBe('true');
			expect(binding).toHaveTextContent('true');
			await act(() => component.$set({ checked: false }));
			expect(button.ariaChecked).toBe('false');
			expect(binding).toHaveTextContent('false');
		});
	});

	describe('isDisabled', () => {
		it('Should expose the disabled state', () => {
			const { getByTestId } = render(samples.Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-disabled');
			expect(button.disabled).toBe(false);
			expect(binding).toHaveTextContent('false');
		});

		it('Should be reactive', async () => {
			const { component, getByTestId } = render(samples.Component);
			const button = getByTestId('switch');
			const binding = getByTestId('binding-disabled');
			expect(button.disabled).toBe(false);
			expect(binding).toHaveTextContent('false');
			await act(() => component.$set({ disabled: true }));
			expect(button.disabled).toBe(true);
			expect(binding).toHaveTextContent('true');
		});
	});
});

describe('Rendering', () => {
	describe('Switch', () => {
		it('Should be rendered as a button by default', () => {
			const { getByTestId } = render(Switch, { props: { 'data-testid': 'switch-root' } });
			const button = getByTestId('switch-root');
			expect(hasTagName(button, 'button')).toBe(true);
		});

		it('Should have a valid switch component id', () => {
			const { getByTestId } = render(Switch, { props: { 'data-testid': 'switch-root' } });
			const button = getByTestId('switch-root');
			expect(isValidComponentName(button, 'switch')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
			const { getByTestId } = render(Switch, {
				props: { as, 'data-testid': 'switch-root' }
			});
			const button = getByTestId('switch-root');
			expect(hasTagName(button, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', async () => {
			const attributes = { title: 'a switch root' };
			const { getByTestId } = render(Switch, {
				props: { ...attributes, 'data-testid': 'switch-root' }
			});
			const button = getByTestId('switch-root');
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(button).toHaveAttribute(attr, value);
			}
		});

		it('Should be able of forwarding actions', () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Switch, {
				props: { use: actions, 'data-testid': 'switch-root' }
			});
			const button = getByTestId('switch-root');
			for (const action of actions) {
				expect(action).toBeCalledWith(button);
			}
		});
	});
});
