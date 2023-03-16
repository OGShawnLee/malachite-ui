import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Disclosure, DisclosureButton, DisclosurePanel } from '$lib';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';

const cases = [samples.ActionComponent, samples.Component, samples.FragmentComponent];
describe('Behaviour', () => {
	it.each(cases)('Should be closed by default', (Component) => {
		const { getByTestId } = render(Component);
		expect(() => getByTestId('disclosure-panel')).toThrow();
		expect(getByTestId('root-isOpen-text')).toHaveTextContent('false');
		expect(getByTestId('button-isOpen-text')).toHaveTextContent('false');
	});

	it.each(cases)('Should toggle by clicking the Disclosure Button', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('disclosure-button');
		await fireEvent.click(button);
		const panel = getByTestId('disclosure-panel');
		expect(panel).toBeInTheDocument();
		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
	});

	describe('Attributes', () => {
		describe('Disclosure Button', () => {
			describe('Aria-Controls', () => {
				it.each(cases)('Should be unset by default', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it.each(cases)('Should point to the Disclosure Panel ID', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					await fireEvent.click(button);
					const panel = getByTestId('disclosure-panel');
					expect(panel).toBeInTheDocument();
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it.each(cases)(
					'Should be unset when the Disclosure Panel is not rendered',
					async (Component) => {
						const { getByTestId } = render(Component);
						const button = getByTestId('disclosure-button');
						expect(button).not.toHaveAttribute('aria-controls');
						await fireEvent.click(button);
						const panel = getByTestId('disclosure-panel');
						expect(panel).toBeInTheDocument();
						expect(button).toHaveAttribute('aria-controls', panel.id);
						await fireEvent.click(button);
						expect(panel).not.toBeInTheDocument();
						expect(button).not.toHaveAttribute('aria-controls');
					}
				);

				it.each(cases)(
					'Should be based on the Disclosure Panel render state instead of the open state',
					async (Component) => {
						const { component, getByTestId } = render(Component, {
							props: { isShowingPanel: false }
						});
						const button = getByTestId('disclosure-button');
						expect(button).not.toHaveAttribute('aria-controls');
						await fireEvent.click(button);
						expect(() => getByTestId('disclosure-panel')).toThrow();
						expect(button).not.toHaveAttribute('aria-controls');
						await act(() => component.$set({ isShowingPanel: true }));
						const panel = getByTestId('disclosure-panel');
						expect(panel).toBeInTheDocument();
						expect(button).toHaveAttribute('aria-controls', panel.id);
						await fireEvent.click(button);
						expect(panel).not.toBeInTheDocument();
						expect(button).not.toHaveAttribute('aria-controls');
					}
				);

				it.each(cases)('Should be reactive', async (Component) => {
					const { component, getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					let panel = getByTestId('disclosure-panel');
					expect(panel).toBeInTheDocument();
					expect(button).toHaveAttribute('aria-controls', panel.id);
					await act(() => component.$set({ isShowingPanel: false }));
					expect(panel).not.toBeInTheDocument();
					expect(button).not.toHaveAttribute('aria-controls');
					await act(() => component.$set({ isShowingPanel: true }));
					panel = getByTestId('disclosure-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});
			});

			describe('Aria-Expanded', () => {
				it.each(cases)('Should be set to false by default', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					expect(button.ariaExpanded).toBe('false');
				});

				it.each(cases)('Should be set to true when the state is open', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('disclosure-button');
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				});
			});
		});
	});

	describe('Binding -> open', () => {
		it.each(cases)('Should set the binding to false by default', (Component) => {
			const { getByTestId } = render(Component);
			const bindingText = getByTestId('isOpen-binding');
			expect(bindingText).toHaveTextContent('false');
		});

		it.each(cases)('Should be a two-way binding', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { open: true } });
			const bindingText = getByTestId('isOpen-binding');
			const button = getByTestId('disclosure-button');
			const panel = getByTestId('disclosure-panel');
			expect(bindingText).toHaveTextContent('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
			await fireEvent.click(button);
			expect(bindingText).toHaveTextContent('false');
			expect(button).not.toHaveAttribute('aria-controls');
			await act(() => component.$set({ open: true }));
			expect(bindingText).toHaveTextContent('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});
	});

	it('Should work with fowarded actions', async () => {
		const { getByTestId } = render(samples.ForwardedActions);
		const button = getByTestId('disclosure-button');
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');
		await fireEvent.click(button);
		const panel = getByTestId('disclosure-panel');
		expect(panel).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-controls', panel.id);
		expect(button.ariaExpanded).toBe('true');
	});
});

describe('Rendering', () => {
	describe('Disclosure', () => {
		it('Should be rendered as a div by default', () => {
			const { getByTestId } = render(Disclosure, { props: { 'data-testid': 'disclosure' } });
			const root = getByTestId('disclosure');
			expect(hasTagName(root, 'div')).toBe(true);
		});

		it.each(elementTagNames)('Should be able of rendering as a %s', (as) => {
			const { getByTestId } = render(Disclosure, {
				props: { as, 'data-testid': 'disclosure' }
			});
			const disclosure = getByTestId('disclosure');
			expect(hasTagName(disclosure, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', () => {
			const attributes = { tabIndex: '4', title: 'a disclosure root' };
			const { getByTestId } = render(Disclosure, {
				props: { as: 'div', 'data-testid': 'disclosure', ...attributes }
			});
			const disclosure = getByTestId('disclosure');
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
			for (const action of actions) {
				expect(action).toBeCalledWith(disclosure);
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
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} Disclosure ID`, () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'disclosure', lowerCaseComponent));
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: `a disclosure ${lowerCaseComponent}` };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});
			const element = getByTestId(testId);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it('Should be able of forwarding actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { use: actions }
				}
			});
			const element = getByTestId(testId);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Slot Props', () => {
	describe('isOpen', () => {
		it.each(cases)(
			'Should expose the current open state from the Disclosre scope',
			async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('disclosure-button');
				const text = getByTestId('root-isOpen-text');
				expect(text).toHaveTextContent('false');
				await fireEvent.click(button);
				expect(text).toHaveTextContent('true');
			}
		);

		it.each(cases)(
			'Should expose the current open state from the Disclosure Button scope',
			async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('disclosure-button');
				const text = getByTestId('button-isOpen-text');
				expect(text).toHaveTextContent('false');
				await fireEvent.click(button);
				expect(text).toHaveTextContent('true');
			}
		);

		it.each(cases)('Should be reactive', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('disclosure-button');
			const text = getByTestId('button-isOpen-text');
			expect(text).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(text).toHaveTextContent('true');
			await fireEvent.click(button);
			expect(text).toHaveTextContent('false');
		});
	});

	describe('close', () => {
		it.each(cases)(
			'Should expose the close function from the Disclosure scope',
			async (Component) => {
				const { getByTestId, getByText } = render(Component);
				const button = getByTestId('disclosure-button');
				const closeButton = getByText('Close Disclosure');
				await fireEvent.click(button);
				expect(button).toHaveAttribute('aria-controls');
				await fireEvent.click(closeButton);
				expect(button).not.toHaveAttribute('aria-controls');
			}
		);

		it.each(cases)(
			'Should expose the close function from the Disclosure Panel scope',
			async (Component) => {
				const { getByTestId, getByText } = render(Component, { props: { open: true } });
				const button = getByTestId('disclosure-button');
				const closeButton = getByText('Close Panel');
				expect(button).toHaveAttribute('aria-controls');
				await fireEvent.click(closeButton);
				expect(button).not.toHaveAttribute('aria-controls');
			}
		);
	});
});

describe('Context', () => {
	interface ContextKeys {
		isOpen: any;
		button: any;
		panel: any;
		close: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'disclosure');

	describe('Unset Context', () => {
		describe.each([
			['Button', DisclosureButton],
			['Panel', DisclosurePanel]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered without a Disclosure Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['Button', DisclosureButton],
			['Panel', DisclosurePanel]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid Disclosure Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(messages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						isOpen: null,
						button: null,
						panel: null,
						close: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init(Component, {
						isOpen: { subscribe: 64 },
						button: {},
						panel: {},
						close: () => 64
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
