import '@testing-library/jest-dom';
import * as samples from './samples';
import type { SvelteComponent } from 'svelte';
import { act, cleanup, fireEvent, render } from '@testing-library/svelte';
import { findElement } from '$lib/utils';
import { writable } from 'svelte/store';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import { generateActions, isValidComponentName } from '@test-utils';

afterEach(() => cleanup());

async function initOpenPopover(Component: typeof SvelteComponent, props = {}) {
	const instance = render(Component, { props });
	const button = instance.getByText('Button');
	await fireEvent.click(button);
	const panel = instance.getByTestId('popover-panel');
	return { ...instance, button, panel };
}

describe('Behaviour', () => {
	const { ActionComponent, Behaviour, ForwardActions, SlotComponent } = samples;

	it('Should be closed by default', () => {
		const { container } = render(Behaviour);
		const element = findElement(container, (element) => element.textContent === 'Close Me');
		expect(element).toBe(undefined);
	});

	it('Should close upon clicking outside the panel', async () => {
		const { panel } = await initOpenPopover(Behaviour);
		await fireEvent.click(document.body);
		expect(panel).not.toBeInTheDocument();
	});

	it('Should close upon clicking on the overlay', async () => {
		const { getByTestId } = await initOpenPopover(Behaviour);
		const overlay = getByTestId('popover-overlay');
		await fireEvent.click(overlay);
		expect(overlay).not.toBeInTheDocument();
	});

	it('Should close after pressing Escape', async () => {
		const { panel } = await initOpenPopover(Behaviour);
		await fireEvent.keyDown(window, { code: 'Escape' });
		expect(panel).not.toBeInTheDocument();
	});

	it('Should close after losing focus', async () => {
		const { getByText, panel } = await initOpenPopover(samples.ForceFocus);
		const external = getByText('External');

		await act(() => external.focus());
		expect(panel).not.toBeInTheDocument();
	});

	describe('Button', () => {
		it('Should toggle the popover by clicking', async () => {
			const { getByText, getByTestId } = render(Behaviour);
			const button = getByText('Button');

			await fireEvent.click(button);
			const panel = getByTestId('popover-panel');
			expect(panel).toBeInTheDocument();

			await fireEvent.click(button);
			expect(panel).not.toBeInTheDocument();
		});

		describe('attributes', () => {
			describe('aria-expanded', () => {
				it('Should be set to false by default', () => {
					const { getByText } = render(Behaviour);
					const button = getByText('Button');
					expect(button.ariaExpanded).toBe('false');
				});

				it('Should be reactive', async () => {
					const { getByText } = render(Behaviour);
					const button = getByText('Button');
					expect(button.ariaExpanded).toBe('false');

					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');

					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				});
			});

			describe('aria-controls', () => {
				it('Should not have aria-controls by default', () => {
					const { getByText } = render(Behaviour);
					const button = getByText('Button');
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it('Should point to the panel id', async () => {
					const { button, panel } = await initOpenPopover(Behaviour);
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it('Should be reactive', async () => {
					const { getByTestId, getByText } = render(Behaviour);
					const button = getByText('Button');
					expect(button).not.toHaveAttribute('aria-controls');

					await fireEvent.click(button);
					const panel = getByTestId('popover-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);

					await fireEvent.click(button);
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it('Should be based on the panel render state rather than the open state', async () => {
					const { button, component, panel } = await initOpenPopover(Behaviour);
					expect(button).toHaveAttribute('aria-controls', panel.id);

					await act(() => component.$set({ showPanel: false }));
					expect(button).not.toHaveAttribute('aria-controls');
				});
			});
		});
	});

	it.each([
		['action component', ActionComponent],
		['slot component', SlotComponent]
	])('Should work rendered as a %s', async (name, Component) => {
		const { getByText, getByTestId } = render(Component);
		const button = getByText('Button');
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);
		let panel = getByTestId('popover-panel');
		let focusedButton = getByText('Close Me');
		expect(focusedButton).toHaveFocus();
		expect(button.ariaExpanded).toBe('true');
		expect(button).toHaveAttribute('aria-controls', panel.id);

		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);
		panel = getByTestId('popover-panel');
		focusedButton = getByText('Close Me');

		await fireEvent.click(focusedButton);
		expect(panel).not.toBeInTheDocument();
	});

	it('Should work with forwarded actions', async () => {
		const { getByText, getByTestId } = render(ForwardActions);
		const button = getByText('Button');
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);
		let panel = getByTestId('popover-panel');
		let focusedButton = getByText('Close Me');
		expect(focusedButton).toHaveFocus();
		expect(button.ariaExpanded).toBe('true');
		expect(button).toHaveAttribute('aria-controls', panel.id);

		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);
		panel = getByTestId('popover-panel');
		focusedButton = getByText('Close Me');

		await fireEvent.click(focusedButton);
		expect(panel).not.toBeInTheDocument();
	});
});

describe('Multiple Components', () => {
	const { Multiple } = samples;

	it('Each component should have an unique valid popover id', async () => {
		const { findByText, getAllByText, getByText } = render(Multiple);

		const popovers = getAllByText('Popover');
		expect(popovers).toHaveLength(3);

		popovers.forEach((popover) => {
			expect(isValidComponentName(popover, 'popover'));
		});

		const buttons = getAllByText('Button');
		expect(buttons).toHaveLength(3);

		const panelIds = new Set<string>();
		const overlayIds = new Set<string>();

		for (const button of buttons) {
			expect(isValidComponentName(button, 'popover', 'button')).toBe(true);
			await fireEvent.click(button);

			const panel = await findByText('Panel');
			panelIds.add(panel.id);
			expect(isValidComponentName(panel, 'popover', 'panel'));

			const overlay = getByText('Overlay');
			overlayIds.add(overlay.id);
			expect(isValidComponentName(overlay, 'popover', 'overlay'));

			await fireEvent.click(overlay);
			expect(overlay).not.toBeInTheDocument();
		}

		expect(panelIds.size).toBe(3);
		expect(overlayIds.size).toBe(3);
	});
});

describe('Props', () => {
	const { ForceFocus } = samples;
	describe('forceFocus', async () => {
		it('Should focus the first focusable element inside the panel upon opening', async () => {
			const { getByText } = await initOpenPopover(ForceFocus);
			const targetButton = getByText('Close Me');
			expect(targetButton).toHaveFocus();
		});

		it('Should be reactive', async () => {
			const { button, component, getByText } = await initOpenPopover(ForceFocus);
			const targetButton = getByText('Close Me');
			expect(targetButton).toHaveFocus();

			await fireEvent.click(button);
			component.$set({ forceFocus: false });
			await fireEvent.click(button);
			expect(targetButton).not.toHaveFocus();
		});

		it('Should work with a store', async () => {
			const forceFocus = writable(true);
			const { button, getByText } = await initOpenPopover(ForceFocus, { forceFocus });
			const targetButton = getByText('Close Me');
			expect(targetButton).toHaveFocus();

			await fireEvent.click(button);
			forceFocus.set(false);
			await fireEvent.click(button);
			expect(targetButton).not.toHaveFocus();
		});

		it('Should not focus elements inside the overlay', async () => {
			const { getByText } = await initOpenPopover(ForceFocus);
			const invalid = getByText('Overlay Button');
			expect(invalid).not.toHaveFocus();
		});

		it('Should close after focusing the popover button', async () => {
			const { button, panel } = await initOpenPopover(ForceFocus);
			await act(() => button.focus());
			expect(panel).not.toBeInTheDocument();
		});
	});
});

describe('Rendering', () => {
	const { Multiple, Rendering, UpPanel } = samples;
	describe('Popover', () => {
		it('Should be rendered as a div by default', async () => {
			const { getByTestId } = render(Rendering, { props: {} });
			const popover = getByTestId('popover-root');
			expect(hasTagName(popover, 'div')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
			const { getByTestId } = render(Rendering, {
				props: { popover: { as } }
			});
			const element = getByTestId('popover-root');
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should forward attributes', async () => {
			const attributes = { tabIndex: '4', title: 'a popover root' };
			const { getByTestId } = render(Rendering, {
				props: { popover: { rest: attributes } }
			});
			const popover = getByTestId('popover-root');
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(popover).toHaveAttribute(attr, value);
			}
		});

		it('Should be able to forward actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: { popover: { use: actions } }
			});
			const popover = getByTestId('popover-root');
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(popover, index);
			}
		});
	});

	it('Should be possible to render the panel above the button', async () => {
		const { panel, button } = await initOpenPopover(UpPanel);
		expect(panel.nextElementSibling).toBe(button);
	});

	describe.each([
		['Button', 'button'],
		['Overlay', 'div'],
		['Panel', 'div']
	])('%s', (component, defaultTag) => {
		const lowerCaseComponent = component.toLowerCase();
		const testId = `popover-${lowerCaseComponent}`;

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = await initOpenPopover(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag)).toBe(true);
		});

		it(`Should have a valid ${lowerCaseComponent} popover id`, async () => {
			const { getByTestId } = await initOpenPopover(Rendering);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'popover', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = await initOpenPopover(Rendering, {
				[lowerCaseComponent]: { as }
			});
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: 'a popover root' };
			const { getByTestId } = await initOpenPopover(Rendering, {
				[lowerCaseComponent]: { rest: attributes }
			});
			const element = getByTestId(testId);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it('Should be able to forward actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = await initOpenPopover(Rendering, {
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
	const { Behaviour } = samples;
	describe('close', () => {
		it.each([
			['global scope', 'Global Close'],
			['panel scope', 'Close Me']
		])('Should expose the function from the %s scope', async (name, buttonText) => {
			const { getByText, panel } = await initOpenPopover(Behaviour);

			const button = getByText(buttonText);
			await fireEvent.click(button);

			expect(panel).not.toBeInTheDocument();
		});

		// * --> additional behaviour is covered in the Toggleable test
	});

	describe('isOpen', () => {
		it.each(['global', 'button'])(
			'Should expose the current open state from the %s scope',
			async (scope) => {
				const { getByText, getByTestId } = render(Behaviour);
				const holder = getByTestId(`${scope}-isOpen-holder`);
				expect(holder).toHaveTextContent('false');

				const button = getByText('Button');
				await fireEvent.click(button);
				expect(holder).toHaveTextContent('true');
			}
		);

		it.each(['global', 'button'])('Should be reactive', async (scope) => {
			const { getByText, getByTestId } = render(Behaviour);
			const holder = getByTestId(`${scope}-isOpen-holder`);
			expect(holder).toHaveTextContent('false');

			const button = getByText('Button');
			await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');
		});
	});
});
