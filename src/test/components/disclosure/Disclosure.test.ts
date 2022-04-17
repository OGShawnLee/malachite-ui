import '@testing-library/jest-dom';
import * as samples from './samples';
import { elementTagNames } from '@components/render';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/svelte';
import { hasTagName, isDisabled, isHTMLElement } from '@predicate';
import { generateActions, isValidComponentName } from '@test-utils';
import { generate } from '@utils';
import { get, writable } from 'svelte/store';
import { useDOMTraversal } from '@hooks';

afterEach(() => cleanup()); // seems like this does not work properly

describe('Behaviour', () => {
	const { Behaviour, ForwardActions } = samples;

	it('Should be closed by default', async () => {
		const { findByTestId } = render(Behaviour, { props: { panelTestId: 'unique-panel' } });
		expect(() => findByTestId('unique-panel')).rejects.toBeUndefined();
	});

	describe('Button', () => {
		it('Should toggle by clicking', async () => {
			const open = writable(false);
			const { findByText } = render(Behaviour, { props: { open } });
			const button = await findByText('Button Element');

			await fireEvent.click(button);
			expect(get(open)).toBe(true);
			await fireEvent.click(button);
			expect(get(open)).toBe(false);
		});

		describe('attributes', () => {
			describe('id', () => {
				it('Should have an appropiate disclosure id', async () => {
					const { findByText } = render(Behaviour);
					const button = await findByText('Button Element');
					expect(isValidComponentName(button, 'disclosure', 'button')).toBe(true);
				});
			});

			describe('aria-controls', () => {
				it('Should not have aria-controls by default', async () => {
					const { findByText } = render(Behaviour);
					const button = await findByText('Button Element');
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it('Should point to the panel id', async () => {
					const { findByText } = render(Behaviour, { props: { open: true } });
					const button = await findByText('Button Element');
					const panel = await findByText('Panel Element');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it('Should be based on the panel element render state rather than the open state', async () => {
					const { component, findByText } = render(Behaviour, {
						props: { open: true, showing: false }
					});
					const button = await findByText('Button Element');
					expect(button).not.toHaveAttribute('aria-controls');

					await act(() => component.$set({ showing: true }));
					const panel = await findByText('Panel Element');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it('Should be reactive', async () => {
					const { component, findByText } = render(Behaviour, { props: { open: false } });
					const button = await findByText('Button Element');
					expect(button).not.toHaveAttribute('aria-controls');

					await act(() => component.$set({ open: true }));
					let panel = await findByText('Panel Element');
					expect(button).toHaveAttribute('aria-controls', panel.id);

					await act(() => component.$set({ open: false }));
					expect(button).not.toHaveAttribute('aria-controls');
				});
			});

			describe('aria-expanded', () => {
				it('Should have aria-expanded set to false by default', async () => {
					const { findByText } = render(Behaviour);
					const button = await findByText('Button Element');
					expect(button.ariaExpanded).toBe('false');
				});

				it('Should be reactive', async () => {
					const { component, findByText } = render(Behaviour);
					const button = await findByText('Button Element');
					expect(button.ariaExpanded).toBe('false');

					await act(() => component.$set({ open: true }));
					expect(button.ariaExpanded).toBe('true');

					await act(() => component.$set({ open: false }));
					expect(button.ariaExpanded).toBe('false');
				});
			});
		});

		describe('Panel', () => {
			describe('attributes', () => {
				describe('id', () => {
					it('Should have an appropiate disclosure id', async () => {
						const { findByText } = render(Behaviour, { props: { open: true } });
						const panel = await findByText('Panel Element');
						expect(isValidComponentName(panel, 'disclosure', 'panel')).toBe(true);
					});
				});
			});
		});
	});

	const { ActionComponent, SlotComponent } = samples;
	it.each([
		[ActionComponent, 'action component'],
		[SlotComponent, 'slot component']
	])('Should work rendered as %s', async (Component) => {
		const { component, findByText } = render(Component);
		const button = await findByText('Button Element');

		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await act(() => component.$set({ open: true }));

		expect(button.ariaExpanded).toBe('true');
		const panel = await findByText('Panel Element');
		expect(button).toHaveAttribute('aria-controls', panel.id);
	});

	it('Should work with forwarded actions', async () => {
		const { component, findByText } = render(ForwardActions);
		const button = await findByText('Button');
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);
		expect(button.ariaExpanded).toBe('true');
		const panel = await findByText('Panel');
		expect(button).toHaveAttribute('aria-controls', panel.id);

		await act(() => component.$set({ open: false }));
		expect(button.ariaExpanded).toBe('false');
		expect(panel).not.toBeInTheDocument();
		expect(button).not.toHaveAttribute('aria-controls');
	});
});

describe('Props', () => {
	const { PropDisabled, PropOpen } = samples;
	describe('disabled', () => {
		it('Should disable all components', async () => {
			const { findAllByText } = render(PropDisabled, { props: { disabled: true } });
			const elements = await findAllByText('Component');
			expect(elements).toHaveLength(3);
			for (const element of elements) {
				expect(isDisabled(element)).toBe(true);
			}
		});

		it('Should be reactive', async () => {
			const { component, findAllByText } = render(PropDisabled, { props: { disabled: true } });
			const elements = await findAllByText('Component');
			expect(elements).toHaveLength(3);
			for (const element of elements) {
				expect(isDisabled(element)).toBe(true);
			}

			await act(() => component.$set({ disabled: false }));
			for (const element of elements) {
				waitFor(() => expect(isDisabled(element)).toBe(false));
			}
		});

		it('Should work with a store', async () => {
			const Disabled = writable(true);
			const { findAllByText } = render(PropDisabled, { props: { disabled: Disabled } });
			const elements = await findAllByText('Component');
			expect(elements).toHaveLength(3);
			for (const element of elements) {
				expect(isDisabled(element)).toBe(true);
			}

			Disabled.set(false);
			for (const element of elements) {
				waitFor(() => expect(isDisabled(element)).toBe(false));
			}
		});

		it('Should update each component isDisabled slot prop', async () => {
			const Disabled = writable(true);
			const { findAllByText } = render(PropDisabled, { props: { disabled: Disabled } });
			const elements = await findAllByText('Component');
			const holders = elements.map((element) => element.firstElementChild).filter(isHTMLElement);
			expect(holders).toHaveLength(3);

			for (const holder of holders) {
				expect(hasTagName(holder, 'span')).toBe(true);
				expect(holder).toHaveTextContent('true');
			}

			await act(() => Disabled.set(false));
			for (const holder of elements) {
				expect(holder).toHaveTextContent('false');
			}
		});
	});

	describe('open', () => {
		it('Should determine the component state', async () => {
			const { findByText } = render(PropOpen, { props: { open: true } });
			const button = await findByText('Button');
			const panel = await findByText('Panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});

		it('Should be reactive', async () => {
			const { component, findByText } = render(PropOpen, { props: { open: false } });
			const button = await findByText('Button');
			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');

			await act(() => component.$set({ open: true }));
			const panel = await findByText('Panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});

		it('Should work with a store', async () => {
			const Open = writable(false);
			const { findByText } = render(PropOpen, { props: { open: Open } });
			const button = await findByText('Button');
			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');

			await act(() => Open.set(true));
			const panel = await findByText('Panel');
			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
		});

		it('Should update each component isOpen slot prop', async () => {
			const Open = writable(false);
			const { container } = render(PropOpen, { props: { open: Open } });

			const holders = useDOMTraversal(container, (element) => hasTagName(element, 'span'));
			expect(holders).toHaveLength(2);
			for (const holder of holders) {
				expect(holder).toHaveTextContent('false');
			}

			await act(() => Open.set(true));
			for (const holder of holders) {
				expect(holder).toHaveTextContent('true');
			}
		});
	});
});

describe('Slot Props', () => {
	const { SlotPropAction, SlotPropClose } = samples;
	describe('close', () => {
		it.each([
			['global', false],
			['local', true]
		])('Should pass the close function from the component %s scope', async (scope, open) => {
			const receiveClose = vi.fn<[(ref?: Event | HTMLElement) => void], void>(() => {});
			const { findByText } = render(SlotPropClose, { props: { receiveClose, open } });

			expect(receiveClose.mock.calls[0][0]).toBeInstanceOf(Function);
			const ref = await findByText('Close Button');
			await act(() => receiveClose.mock.calls[0][0](ref));
			expect(ref).toHaveFocus();
		});

		it('Should close the Disclosure and focus the button', async () => {
			const { findByText } = render(SlotPropClose, { props: { open: true } });
			const button = await findByText('Close Button');
			const panel = await findByText('Close Panel');

			const closeButton = await findByText('Close Me');
			await fireEvent.click(closeButton);
			expect(panel).not.toBeInTheDocument();
			expect(button).toHaveFocus();
		});

		// * --> additional behaviour is handled in the Toggleable test
	});

	it.each(['global', 'local'])(
		'Should pass the button and panel action from the component %s scope',
		async (target) => {
			const [buttonAction, panelAction] = generate(2, () => {
				return vi.fn((element: HTMLElement, action: (element: HTMLElement) => {}) => {
					return action(element);
				});
			});

			const { findByText } = render(SlotPropAction, {
				props: { buttonAction, panelAction, target: target.toUpperCase() }
			});

			expect(buttonAction).toBeCalledTimes(1);
			expect(panelAction).toBeCalledTimes(1);

			const button = await findByText('Action Button');
			expect(buttonAction.mock.calls[0][0]).toBe(button);
			expect(buttonAction.mock.calls[0][1]).toBeInstanceOf(Function);

			const panel = await findByText('Action Panel');
			expect(panelAction.mock.calls[0][0]).toBe(panel);
			expect(panelAction.mock.calls[0][1]).toBeInstanceOf(Function);

			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);

			await fireEvent.click(button);
			expect(panel).not.toBeInTheDocument();

			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');
		}
	);
});

describe('Rendering', () => {
	const { Rendering } = samples;
	describe('Disclosure', () => {
		it('Should be rendered as a slot by default', async () => {
			const { findByText } = render(Rendering, { props: {} });
			const element = await findByText('Disclosure');
			expect(element.id).toBeFalsy();
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { findByTestId } = render(Rendering, {
				props: { as: { root: as } }
			});
			const element = await findByTestId('root');
			expect(hasTagName(element, as)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to forward attributes', async (as) => {
			const attributes = { tabIndex: '4', title: 'a disclosure root' };
			const { findByTestId } = render(Rendering, {
				props: { as: { root: as }, rest: { root: attributes } }
			});
			const element = await findByTestId('root');
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it.each(elementTagNames)('Should be able to forward actions', async (as) => {
			const actions = generate(3, (index) => {
				const action = vi.fn(() => {});
				return [action, index];
			});
			const { findByTestId } = render(Rendering, {
				props: { as: { root: as }, use: { root: actions } }
			});
			const element = await findByTestId('root');
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});

	const { SlotUpPanel } = samples;
	it('Should be able of rendering the panel above the button', async () => {
		const { findByText } = render(SlotUpPanel, { props: { open: true } });
		const button = await findByText('Button Element');
		const panel = await findByText('Up Panel');

		expect(panel.nextElementSibling).toBe(button);
		expect(button).toHaveAttribute('aria-controls', panel.id);
	});

	describe.each([
		['Button', 'button'],
		['Panel', 'div']
	])('%s', (component, defaultTag) => {
		const lowerCaseComponent = component.toLocaleLowerCase();

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { findByTestId } = render(Rendering);
			const element = await findByTestId(lowerCaseComponent);
			expect(hasTagName(element, defaultTag)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a (%s)', async (as) => {
			const { findByTestId } = render(Rendering, {
				props: { as: { [lowerCaseComponent]: as } }
			});
			const element = await findByTestId(lowerCaseComponent);
			expect(hasTagName(element, as)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to forward actions', async (as) => {
			const actions = generateActions(3);
			const { findByTestId } = render(Rendering, {
				props: { as: { [lowerCaseComponent]: as }, use: { [lowerCaseComponent]: actions } }
			});
			const element = await findByTestId(lowerCaseComponent);
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});
});
