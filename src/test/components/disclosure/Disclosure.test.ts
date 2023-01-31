import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';
import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib/components';
import { act, fireEvent, render } from '@testing-library/svelte';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';

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
describe.skip('behaviour', () => {
	it.skip('Should be closed by default', () => {
		const { getByTestId } = render(Disclosure, { props: { 'data-testid': 'disclosure-root' } });
		expect(() => getByTestId('disclosure-panel')).toThrow();
	});

	it.skip('Should toggle by clicking the Button', async () => {
		const { button, getByTestId } = initComponent(Behaviour);
		await fireEvent.click(button);
		const panel = getByTestId('disclosure-panel');
		expect(panel).toBeInTheDocument();

		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
	});

	describe.skip('attributes', () => {
		describe.skip('aria-controls', () => {
			it.skip('Should be unset by default', () => {
				const { button } = initComponent(Behaviour);
				expect(button).not.toHaveAttribute('aria-controls');
			});

			it.skip('Should point to the panel id', async () => {
				const { button, open } = initComponent(Behaviour);
				const panel = await open();
				expect(button).toHaveAttribute('aria-controls', panel.id);
			});

			it.skip('Should be based on the panel render state rather than the open state', async () => {
				const { button, component, open } = initComponent(Behaviour);
				const panel = await open();
				expect(button).toHaveAttribute('aria-controls', panel.id);

				await act(() => component.$set({ showPanel: false }));
				expect(panel).not.toBeInTheDocument();
				expect(button).not.toHaveAttribute('aria-controls');
			});

			it.skip('Should be reactive', async () => {
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

		describe.skip('aria-expanded', () => {
			it.skip('Should be false by default', () => {
				const { button } = initComponent(Behaviour);
				expect(button.ariaExpanded).toBe('false');
			});

			it.skip('Should be reactive', async () => {
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
	it.skip('Should work with forwarded actions', async () => {
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

const { BindOpen } = samples;
describe.skip('Binding', () => {
	async function initBinding(props: { open?: boolean } = {}) {
		const result = render(BindOpen, { props });
		const button = result.getByText('Button');
		const bindHolder = await result.findByTestId('open-bind-holder');

		async function open() {
			await fireEvent.click(button);
			return await result.findByText('Panel');
		}

		function getPanel() {
			return result.findByText('Panel');
		}

		return { ...result, bindHolder, button, open, getPanel };
	}

	it.skip('Should set the bound variable to false by default', async () => {
		const { bindHolder } = await initBinding();
		expect(bindHolder).toHaveTextContent('false');
	});

	it.skip('Should update the bound variable with each state change', async () => {
		const { bindHolder, button, open } = await initBinding();
		expect(bindHolder).toHaveTextContent('false');

		const panel = await open();
		expect(panel).toHaveTextContent('Panel');
		expect(bindHolder).toHaveTextContent('true');

		await fireEvent.click(button);
		expect(bindHolder).toHaveTextContent('false');

		await fireEvent.click(button);
		expect(bindHolder).toHaveTextContent('true');
	});

	it.skip('Should be a two-way data binding', async () => {
		const { component, bindHolder, getPanel } = await initBinding({ open: true });
		expect(bindHolder).toHaveTextContent('true');
		const panel = await getPanel();
		expect(panel).toBeInTheDocument();

		await act(() => component.$set({ open: false }));
		expect(panel).not.toBeInTheDocument();
		expect(bindHolder).toHaveTextContent('false');
	});
});

describe.skip('Props', () => {
	describe.skip('open', () => {
		it.skip('Should be false by default', () => {
			const { button, getByTestId } = initComponent(Behaviour);
			expect(button.ariaExpanded).toBe('false');
			expect(() => getByTestId('disclosure-panel')).toThrow();
		});

		it.skip('Should determine the current open state', () => {
			const { button, getByTestId } = initComponent(Behaviour, { open: true });
			const panel = getByTestId('disclosure-panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});

		it.skip('Should be reactive', async () => {
			const { button, component, getByTestId } = initComponent(Behaviour, { open: true });
			const panel = getByTestId('disclosure-panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);

			await act(() => component.$set({ open: false }));
			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');
			expect(panel).not.toBeInTheDocument();
		});
	});
});

describe.skip('Rendering', () => {
	describe.skip('Disclosure', () => {
		it.skip('Should be rendered as a slot by default', () => {
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

		it.skip('Should be able of forwarding attributes', () => {
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

		it.skip('Should be able of forwarding actions', () => {
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
	describe.skip.each([
		['Button', 'button'],
		['Panel', 'div']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = `disclosure-${lowerCaseComponent}`;

		it.skip(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = initComponent(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it.skip(`Should have a valid ${lowerCaseComponent} Disclosure id`, () => {
			const { getByTestId } = initComponent(Rendering);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'disclosure', lowerCaseComponent));
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = initComponent(Rendering, { [lowerCaseComponent]: { as } });
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it.skip('Should be able to forward attributes', async () => {
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

		it.skip('Should be able of forwarding actions', async () => {
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

describe.skip('Slot Props', () => {
	describe.skip('isOpen', () => {
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

	describe.skip('close', () => {
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

describe.skip('Context', () => {
	interface ContextKeys {
		Open: any;
		button: any;
		panel: any;
		close: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'disclosure');

	describe.skip('Unset Context', () => {
		describe.skip.each([
			['Button', DisclosureButton],
			['Panel', DisclosurePanel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered without a Disclosure Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe.skip('Invalid Context', () => {
		describe.skip.each([
			['Button', DisclosureButton],
			['Panel', DisclosurePanel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered with an invalid Disclosure Context', () => {
				expect(() => init.skip(Component, null)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => init.skip(Component, null)).toThrow(messages.invalid);
			});

			it.skip('Should validate the context value thoroughly', () => {
				expect(() =>
					init.skip(Component, {
						Open: null,
						button: null,
						panel: null,
						close: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init.skip(Component, {
						Open: { subscribe: 64 },
						button: {},
						panel: {},
						close: () => 64
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
