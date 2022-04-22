import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';
import { Disclosure } from '$lib/components';
import { act, fireEvent, render } from '@testing-library/svelte';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import { generateActions, isValidComponentName, useToggle } from '@test-utils';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	const button = result.getByText('Toggle');

	async function open(panelTestId = 'disclosure-panel') {
		await fireEvent.click(button);
		const panel = result.getByTestId(panelTestId);
		return panel;
	}

	function getHolder(holderTestId = 'disclosure-isOpen-holder') {
		return result.getByTestId(holderTestId);
	}

	return { ...result, button, getHolder, open };
}

const { Behaviour } = samples;
describe('behaviour', () => {
	it('Should be closed by default', () => {
		const { getByTestId } = render(Disclosure, { props: { 'data-testid': 'disclosure-root' } });
		expect(() => getByTestId('disclosure-panel')).toThrow();
	});

	it('Should toggle by clicking the Button', async () => {
		const { button, getByTestId } = initComponent(Behaviour);
		await fireEvent.click(button);
		const panel = getByTestId('disclosure-panel');
		expect(panel).toBeInTheDocument();

		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
	});

	describe('attributes', () => {
		describe('aria-controls', () => {
			it('Should be unset by default', () => {
				const { button } = initComponent(Behaviour);
				expect(button).not.toHaveAttribute('aria-controls');
			});

			it('Should point to the panel id', async () => {
				const { button, open } = initComponent(Behaviour);
				const panel = await open();
				expect(button).toHaveAttribute('aria-controls', panel.id);
			});

			it('Should be based on the panel render state rather than the open state', async () => {
				const { button, component, open } = initComponent(Behaviour);
				const panel = await open();
				expect(button).toHaveAttribute('aria-controls', panel.id);

				await act(() => component.$set({ showPanel: false }));
				expect(panel).not.toBeInTheDocument();
				expect(button).not.toHaveAttribute('aria-controls');
			});

			it('Should be reactive', async () => {
				const { button, open } = initComponent(Behaviour);
				expect(button).not.toHaveAttribute('aria-controls');

				const panel = await open();
				expect(button).toHaveAttribute('aria-controls', panel.id);

				await fireEvent.click(button);
				expect(button).not.toHaveAttribute('aria-controls');

				await fireEvent.click(button);
				expect(button).toHaveAttribute('aria-controls', panel.id);
			});
		});

		describe('aria-expanded', () => {
			it('Should be false by default', () => {
				const { button } = initComponent(Behaviour);
				expect(button.ariaExpanded).toBe('false');
			});

			it('Should be reactive', async () => {
				const { button } = initComponent(Behaviour);
				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('true');

				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('false');

				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('true');
			});
		});
	});

	const { ActionComponent, SlotComponent } = samples;
	it.each([
		['action component', ActionComponent],
		['slot component', SlotComponent]
	])('Should work rendered as a %s', async (name, Component) => {
		const { button, open } = initComponent(Component);
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');

		const panel = await open();
		expect(button).toHaveAttribute('aria-controls', panel.id);
		expect(button.ariaExpanded).toBe('true');

		await fireEvent.click(button);
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');
		expect(panel).not.toBeInTheDocument();
	});

	const { ForwardedActions } = samples;
	it('Should work with forwarded actions', async () => {
		const { button, open } = initComponent(ForwardedActions);
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');

		const panel = await open();
		expect(button).toHaveAttribute('aria-controls', panel.id);
		expect(button.ariaExpanded).toBe('true');

		await fireEvent.click(button);
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');
		expect(panel).not.toBeInTheDocument();
	});
});

describe('Props', () => {
	describe('open', () => {
		it('Should be false by default', () => {
			const { button, getByTestId } = initComponent(Behaviour);
			expect(button.ariaExpanded).toBe('false');
			expect(() => getByTestId('disclosure-panel')).toThrow();
		});

		it('Should determine the current open state', () => {
			const { button, getByTestId } = initComponent(Behaviour, { open: true });
			const panel = getByTestId('disclosure-panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});

		it('Should be reactive', async () => {
			const { button, component, getByTestId } = initComponent(Behaviour, { open: true });
			const panel = getByTestId('disclosure-panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);

			await act(() => component.$set({ open: false }));
			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');
			expect(panel).not.toBeInTheDocument();
		});

		it('Should work with a store', async () => {
			const [open, toggle] = useToggle(true);
			const { button, getByTestId } = initComponent(Behaviour, { open });
			const panel = getByTestId('disclosure-panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);

			await act(() => toggle());
			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');
			expect(panel).not.toBeInTheDocument();

			await act(() => toggle());
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});
	});
});

describe('Rendering', () => {
	describe('Disclosure', () => {
		it('Should be rendered as a slot by default', () => {
			const { getByTestId } = render(Disclosure, { props: { 'data-testid': 'disclosure-root' } });
			expect(() => getByTestId('disclosure-root')).toThrow();
		});

		it.each(elementTagNames)('Should be able of rendering as a %s', (as) => {
			const { getByTestId } = render(Disclosure, {
				props: { as, 'data-testid': 'disclosure-root' }
			});
			const disclosure = getByTestId('disclosure-root');
			expect(hasTagName(disclosure, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', () => {
			const attributes = { tabIndex: '4', title: 'a disclosure root' };
			const { getByTestId } = render(Disclosure, {
				props: { as: 'div', 'data-testid': 'disclosure-root', ...attributes }
			});
			const disclosure = getByTestId('disclosure-root');
			const entriesAttributes = Object.entries(attributes);
			for (const [attribute, value] of entriesAttributes) {
				expect(disclosure).toHaveAttribute(attribute, value);
			}
		});

		it('Should be able of forwarding actions', () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Disclosure, {
				props: { as: 'div', 'data-testid': 'disclosure-root', use: actions }
			});
			const disclosure = getByTestId('disclosure-root');
			for (const [action, parameter] of actions) {
				expect(action).toBeCalledWith(disclosure, parameter);
			}
		});
	});

	const { Rendering } = samples;
	describe.each([
		['Button', 'button'],
		['Panel', 'div']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = `disclosure-${lowerCaseComponent}`;

		it(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = initComponent(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} Disclosure id`, () => {
			const { getByTestId } = initComponent(Rendering);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'disclosure', lowerCaseComponent));
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = initComponent(Rendering, { [lowerCaseComponent]: { as } });
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: `a disclosure ${lowerCaseComponent}` };
			const { getByTestId } = initComponent(Rendering, {
				[lowerCaseComponent]: { rest: attributes }
			});
			const element = getByTestId(testId);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it('Should be able of forwarding actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = initComponent(Rendering, {
				[lowerCaseComponent]: { use: actions }
			});
			const element = getByTestId(testId);
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});
});

describe('Slot Props', () => {
	describe('isOpen', () => {
		it.each(['disclosure', 'button'])(
			'Should expose the current open state from the %s scope',
			(scope) => {
				const { getHolder } = initComponent(Behaviour);
				const holder = getHolder(`${scope}-isOpen-holder`);
				expect(holder).toHaveTextContent('false');
			}
		);

		it.each(['disclosure', 'button'])('Should be reactive', async (scope) => {
			const { button, getHolder } = initComponent(Behaviour);
			const holder = getHolder(`${scope}-isOpen-holder`);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('false');
		});
	});

	function capitalize(str: string) {
		return str[0].toUpperCase() + str.substring(1);
	}

	describe('close', () => {
		it.each(['disclosure', 'panel'])(
			'Should expose a close function from the %s scope',
			async (scope) => {
				const { button, getByTestId, getByText } = initComponent(Behaviour);
				await fireEvent.click(button);
				const panel = getByTestId('disclosure-panel');
				const holder = getByText(`Close ${capitalize(scope)}`);

				await fireEvent.click(holder);
				expect(panel).not.toBeInTheDocument();
			}
		);

		// -> close function behaviour is covered in the Toggleable test suite
	});
});
