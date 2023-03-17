import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';
import { Popover, PopoverButton, PopoverOverlay, PopoverPanel } from '$lib';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import { getContextKey } from '$lib/hooks';

const cases = [samples.ActionComponent, samples.Component, samples.FragmentComponent];
describe('Behaviour', () => {
	it.each(cases)('Should be closed by default', (Component) => {
		const { getByTestId } = render(Component);
		expect(() => getByTestId('popover-overlay')).toThrow();
		expect(() => getByTestId('popover-panel')).toThrow();
		expect(getByTestId('root-is-open-text')).toHaveTextContent('false');
		expect(getByTestId('button-is-open-text')).toHaveTextContent('false');
	});

	it.each(cases)('Should toggle by clicking the Popover Button', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('popover-button');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		const overlay = getByTestId('popover-overlay');
		expect(panel).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
		expect(overlay).not.toBeInTheDocument();
	});

	it.each(cases)('Should close by clicking outside the Popover Panel', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('popover-button');
		const external = getByTestId('external-button');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		const overlay = getByTestId('popover-overlay');
		expect(panel).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		await fireEvent.click(external);
		expect(panel).not.toBeInTheDocument();
		expect(overlay).not.toBeInTheDocument();
	});

	it.each(cases)('Should close by focusing outside the Popover Panel', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('popover-button');
		const external = getByTestId('external-button');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		const overlay = getByTestId('popover-overlay');
		expect(panel).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		await act(() => external.focus());
		expect(panel).not.toBeInTheDocument();
		expect(overlay).not.toBeInTheDocument();
	});

	it.each(cases)('Should close by pressing the Escape key the Popover Panel', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('popover-button');
		const external = getByTestId('external-button');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		const overlay = getByTestId('popover-overlay');
		expect(panel).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		await fireEvent.keyDown(document, { code: 'Escape' });
		expect(panel).not.toBeInTheDocument();
		expect(overlay).not.toBeInTheDocument();
	});

	describe('Attributes', () => {
		describe('Popover Button', () => {
			describe('Aria-Controls', () => {
				it.each(cases)('Should be unset by default', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it.each(cases)('Should point to the Popover Panel ID', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					await fireEvent.click(button);
					const panel = getByTestId('popover-panel');
					const overlay = getByTestId('popover-overlay');
					expect(panel).toBeInTheDocument();
					expect(overlay).toBeInTheDocument();
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it.each(cases)(
					'Should be unset when the Popover Panel is not rendered',
					async (Component) => {
						const { getByTestId } = render(Component);
						const button = getByTestId('popover-button');
						expect(button).not.toHaveAttribute('aria-controls');
						await fireEvent.click(button);
						const panel = getByTestId('popover-panel');
						expect(panel).toBeInTheDocument();
						expect(button).toHaveAttribute('aria-controls', panel.id);
						await fireEvent.click(button);
						expect(panel).not.toBeInTheDocument();
						expect(button).not.toHaveAttribute('aria-controls');
					}
				);

				it.each(cases)(
					'Should be based on the Popover Panel render state instead of the open state',
					async (Component) => {
						const { component, getByTestId } = render(Component, {
							props: { isShowingPanel: false }
						});
						const button = getByTestId('popover-button');
						expect(button).not.toHaveAttribute('aria-controls');
						await fireEvent.click(button);
						expect(() => getByTestId('popover-panel')).toThrow();
						expect(button).not.toHaveAttribute('aria-controls');
						await act(() => component.$set({ isShowingPanel: true }));
						const panel = getByTestId('popover-panel');
						expect(panel).toBeInTheDocument();
						expect(button).toHaveAttribute('aria-controls', panel.id);
						await fireEvent.click(button);
						expect(panel).not.toBeInTheDocument();
						expect(button).not.toHaveAttribute('aria-controls');
					}
				);

				it.each(cases)('Should be reactive', async (Component) => {
					const { component, getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					let panel = getByTestId('popover-panel');
					expect(panel).toBeInTheDocument();
					expect(button).toHaveAttribute('aria-controls', panel.id);
					await act(() => component.$set({ isShowingPanel: false }));
					expect(panel).not.toBeInTheDocument();
					expect(button).not.toHaveAttribute('aria-controls');
					await act(() => component.$set({ isShowingPanel: true }));
					panel = getByTestId('popover-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});
			});

			describe('Aria-Expanded', () => {
				it.each(cases)('Should be set to false by default', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					expect(button.ariaExpanded).toBe('false');
				});

				it.each(cases)('Should be set to true when the state is open', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('popover-button');
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				});
			});
		});
	});

	it('Should work with fowarded actions', async () => {
		const { getByTestId } = render(samples.ForwardActions);
		const button = getByTestId('popover-button');
		expect(button).not.toHaveAttribute('aria-controls');
		expect(button.ariaExpanded).toBe('false');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		expect(panel).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-controls', panel.id);
		expect(button.ariaExpanded).toBe('true');
	});
});

describe('Prop', () => {
	describe('forceFocus', () => {
		it.each(cases)('Should be false by default', async (Component) => {
			const { getByTestId, getByText } = render(Component);
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const panelButton = getByText('Close Panel');
			expect(panelButton).not.toHaveFocus();
		});

		it.each(cases)(
			'Should focus the first focusable child inside the Popover Panel',
			async (Component) => {
				const { getByTestId, getByText } = render(Component, { props: { forceFocus: true } });
				const button = getByTestId('popover-button');
				await fireEvent.click(button);
				const panelButton = getByText('Close Panel');
				expect(panelButton).toHaveFocus();
			}
		);

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId, getByText } = render(Component, {
				props: { forceFocus: true }
			});
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			let panelButton = getByText('Close Panel');
			expect(panelButton).toHaveFocus();
			await fireEvent.click(panelButton);
			await act(() => component.$set({ forceFocus: false }));
			await fireEvent.click(button);
			panelButton = getByText('Close Panel');
			expect(panelButton).not.toHaveFocus();
		});

		it.each(cases)(
			'Should close the Popover Panel after focusing the Popover Button',
			async (Component) => {
				const { component, getByTestId, getByText } = render(Component, {
					props: { forceFocus: true }
				});
				const button = getByTestId('popover-button');
				await fireEvent.click(button);
				let panelButton = getByText('Close Panel');
				expect(panelButton).toHaveFocus();
				await act(() => button.focus());
				expect(panelButton).not.toBeInTheDocument();
			}
		);
	});
});

describe('Slot Props', () => {
	describe('is-open', () => {
		it.each(cases)(
			'Should expose the current open state from the Disclosre scope',
			async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('popover-button');
				const text = getByTestId('root-is-open-text');
				expect(text).toHaveTextContent('false');
				await fireEvent.click(button);
				expect(text).toHaveTextContent('true');
			}
		);

		it.each(cases)(
			'Should expose the current open state from the Popover Button scope',
			async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('popover-button');
				const text = getByTestId('button-is-open-text');
				expect(text).toHaveTextContent('false');
				await fireEvent.click(button);
				expect(text).toHaveTextContent('true');
			}
		);

		it.each(cases)('Should be reactive', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('popover-button');
			const text = getByTestId('button-is-open-text');
			expect(text).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(text).toHaveTextContent('true');
			await fireEvent.click(button);
			expect(text).toHaveTextContent('false');
		});
	});

	describe('close', () => {
		it('Should expose the close function from the Popover scope', async () => {
			const { getByTestId, getByText } = render(samples.ActionComponent);
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const closeButton = getByText('Close Panel');
			expect(button).toHaveAttribute('aria-controls');
			await fireEvent.click(closeButton);
			expect(button).not.toHaveAttribute('aria-controls');
		});

		it('Should expose the close function from the Popover Panel scope', async () => {
			const { getByTestId, getByText } = render(samples.Component);
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const closeButton = getByText('Close Panel');
			expect(button).toHaveAttribute('aria-controls');
			await fireEvent.click(closeButton);
			expect(button).not.toHaveAttribute('aria-controls');
		});
	});
});

describe('Rendering', () => {
	it('Should be possible to render the panel above the button', async () => {
		const { getByTestId } = render(samples.UpPanel);
		const button = getByTestId('popover-button');
		await fireEvent.click(button);
		const panel = getByTestId('popover-panel');
		expect(panel.nextElementSibling).toBe(button);
	});

	describe('Popover', () => {
		it('Should be rendered as a div by default', () => {
			const { getByTestId } = render(Popover, { props: { 'data-testid': 'disclosure' } });
			const root = getByTestId('disclosure');
			expect(hasTagName(root, 'div')).toBe(true);
		});

		it.each(elementTagNames)('Should be able of rendering as a %s', (as) => {
			const { getByTestId } = render(Popover, {
				props: { as, 'data-testid': 'popover' }
			});
			const popover = getByTestId('popover');
			expect(hasTagName(popover, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', () => {
			const attributes = { tabIndex: '4', title: 'a popover root' };
			const { getByTestId } = render(Popover, {
				props: { as: 'div', 'data-testid': 'popover', ...attributes }
			});
			const popover = getByTestId('popover');
			const entriesAttributes = Object.entries(attributes);
			for (const [attribute, value] of entriesAttributes) {
				expect(popover).toHaveAttribute(attribute, value);
			}
		});

		it('Should be able of forwarding actions', () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Popover, {
				props: { as: 'div', 'data-testid': 'popover-root', use: actions }
			});
			const popover = getByTestId('popover-root');
			for (const action of actions) {
				expect(action).toBeCalledWith(popover);
			}
		});
	});

	describe.each([
		['Button', 'button'],
		['Overlay', 'div'],
		['Panel', 'div']
	])('%s', (component, defaultTag) => {
		const lowerCaseComponent = component.toLowerCase();
		const testId = `popover-${lowerCaseComponent}`;

		const { Rendering } = samples;
		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering);
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag)).toBe(true);
		});

		it(`Should have a valid ${lowerCaseComponent} popover id`, async () => {
			const { getByTestId } = render(Rendering);
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'popover', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { as }
				}
			});
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: 'a popover root' };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it('Should be able to forward actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: { [lowerCaseComponent]: { use: actions } }
			});
			const button = getByTestId('popover-button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Multiple Components', () => {
	const { Multiple } = samples;

	it('Each component should have an unique valid Popover ID', async () => {
		const { getAllByText, getByText } = render(Multiple);
		const buttons = getAllByText('Popover Button');
		expect(buttons).toHaveLength(3);

		for await (const button of buttons) {
			expect(isValidComponentName(button, 'popover'));
			await fireEvent.click(button);
			const panel = getByText('Popover Panel');
			const overlay = getByText('Popover Overlay');
			expect(isValidComponentName(panel, 'popover'));
			expect(isValidComponentName(overlay, 'popover'));
		}
	});
});

// PLACING THIS BEFORE THE OTHER TESTS CORRUPTS THEIR CONTEXT
describe('Context', () => {
	interface ContextKeys {
		isOpen: any;
		createPopoverButton: any;
		createPopoverPanel: any;
		createPopoverOverlay: any;
		close: any;
	}

	const [renderContextParent, errorMessages] = createContextParentRenderer<ContextKeys>(
		ContextParent,
		'popover'
	);

	describe('Unset Context', () => {
		describe('Overlay', () => {
			it('Should throw an error if rendered without a Popover Context', () => {
				expect(() => render(PopoverOverlay)).toThrow();
			});
		});

		describe.each([
			['Button', PopoverButton],
			['Panel', PopoverPanel]
			// ['Overlay', PopoverOverlay]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered without a Popover Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(errorMessages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['Button', PopoverButton],
			['Panel', PopoverPanel],
			['Overlay', PopoverOverlay]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid Popover Context', () => {
				expect(() => renderContextParent(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => renderContextParent(Component, null)).toThrow(errorMessages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					renderContextParent(Component, {
						isOpen: null,
						createPopoverButton: null,
						createPopoverPanel: null,
						createPopoverOverlay: null,
						close: null
					})
				).toThrow(errorMessages.invalid);
				expect(() =>
					renderContextParent(Component, {
						isOpen: null,
						createPopoverButton: null,
						createPopoverPanel: null,
						createPopoverOverlay: null,
						close: null
					})
				).toThrow(errorMessages.invalid);
			});
		});
	});
});
