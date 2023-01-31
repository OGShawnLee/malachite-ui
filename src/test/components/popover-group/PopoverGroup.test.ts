import '@testing-library/jest-dom';
import { Behaviour, Overlay } from './samples';
import { elementTagNames } from '$lib/components/render';
import { PopoverGroup, PopoverOverlay } from '$lib/components';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { ContextParent, createContextParentRenderer, generateActions } from '@test-utils';
import { useDOMTraversal } from '$lib/hooks';
import { findElement } from '$lib/utils';
import type { SvelteComponent } from 'svelte';

function initComponent(Component: typeof SvelteComponent, props: { expanded?: boolean } = {}) {
	const result = render(Component, { props });
	const buttons = result.getAllByText('Toggle');
	return { ...result, buttons };
}

describe.skip('Behaviour', () => {
	it.skip('Should render its children', async () => {
		const { buttons } = initComponent(Behaviour);
		for (const button of buttons) {
			expect(button).toBeInTheDocument();
		}
	});

	it.skip('Should prevent the open popover from closing after focusing another poopver button', async () => {
		const { buttons, getByTestId } = initComponent(Behaviour);
		const [first, second, third] = buttons;

		await fireEvent.click(first);
		const panel = getByTestId('popover-panel');

		await act(() => second.focus());
		expect(panel).toBeInTheDocument();

		await act(() => third.focus());
		expect(panel).toBeInTheDocument();
	});

	/* 
		onMount hook does not run (if they were declared in ts files) while testing 
		therefore many tests will fail unless I change my codebase just for this, 
		which is annoying... guess it is what it is
	*/
	it.skip('Should close the popovers after clicking outside of any popover', async () => {
		const { buttons, findByTestId, getByText } = initComponent(Behaviour);
		const external = getByText('External');
		for (const button of buttons) {
			await fireEvent.click(button);
			const panel = await findByTestId('popover-panel');
			await fireEvent.click(external);
			expect(panel).not.toBeInTheDocument();
		}
	});

	it.skip('Should close the popovers after pressing Escape', async () => {
		const { buttons, getByTestId } = initComponent(Behaviour);
		for (const button of buttons) {
			await fireEvent.click(button);
			const panel = getByTestId('popover-panel');
			await fireEvent.keyDown(window, { code: 'Escape' });
			expect(panel).not.toBeInTheDocument();
		}
	});

	describe.skip('Group Overlay', () => {
		it.skip('Should close all popovers by clicking on it', async () => {
			const { buttons, getByText } = initComponent(Overlay);
			for (const button of buttons) {
				await fireEvent.click(button);
				const panel = getByText('Popover Panel');
				const groupOverlay = getByText('Group Overlay');
				await fireEvent.click(groupOverlay);
				expect(panel).not.toBeInTheDocument();
			}
		});

		it.skip('Should work if all popovers panels are open', async () => {
			const { buttons, getByText, getAllByText } = initComponent(Overlay, { expanded: true });
			for (const button of buttons) await fireEvent.click(button);
			const panels = getAllByText('Popover Panel');
			expect(panels).toHaveLength(3);

			const groupOverlay = getByText('Group Overlay');
			await fireEvent.click(groupOverlay);
			for (const panel of panels) {
				expect(panel).not.toBeInTheDocument();
			}
		});
	});
});

describe.skip('Props', () => {
	const textContent = {
		external: 'External',
		groupOverlay: 'Group Overlay',
		overlay: 'Popover Overlay',
		button: 'Toggle',
		panel: 'Popover Panel',
		close: 'Close Me'
	};

	it.skip('Should allow rendering all the popovers at the same time', async () => {
		const { buttons, getAllByText } = initComponent(Overlay, { expanded: true });
		for (const button of buttons) await fireEvent.click(button);
		const panels = getAllByText(textContent.panel);
		expect(panels).toHaveLength(3);
	});

	it.skip('Should be set to false by default', async () => {
		const { buttons, getAllByText } = initComponent(Overlay);
		for (const button of buttons) await fireEvent.click(button);
		const panels = getAllByText(textContent.panel);
		expect(panels).toHaveLength(1);
	});

	it.skip('Should not allow rendering any popover overlay', async () => {
		const { buttons, container } = initComponent(Overlay, { expanded: true });
		for (const button of buttons) await fireEvent.click(button);
		const overlays = useDOMTraversal(container, (element) => {
			return element.textContent === textContent.overlay;
		});
		expect(overlays).toHaveLength(0);
	});

	it.skip('Should allow rendering popover overlays when set to false', async () => {
		const { buttons, getAllByText } = initComponent(Overlay);
		for (const button of buttons) {
			await fireEvent.click(button);
			const overlays = getAllByText(textContent.overlay);
			expect(overlays).toHaveLength(1);
		}
	});

	describe.skip('PopoverOverlay as Group Overlay', () => {
		it.skip('Should only be rendered when there is at least one open popover', async () => {
			const { buttons, container, getByText } = initComponent(Overlay);
			let overlay = findElement(container, (element) => {
				return element.textContent === textContent.groupOverlay;
			});

			expect(overlay).toBeUndefined();

			for (const button of buttons) {
				await fireEvent.click(button);
				overlay = getByText(textContent.groupOverlay);
				expect(overlay).toBeInTheDocument();
				await fireEvent.click(button);
				expect(overlay).not.toBeInTheDocument();
			}
		});

		it.skip('Should be rendered even in expanded mode', async () => {
			const { buttons, getByText } = initComponent(Overlay, { expanded: true });
			for (const button of buttons) await fireEvent.click(button);
			const overlay = getByText(textContent.groupOverlay);
			expect(overlay).toBeInTheDocument();
		});
	});

	describe.skip('Focus Management', () => {
		describe.skip('Closing', () => {
			it.skip('Should focus the last opened popover button', async () => {
				const { buttons, getByText } = initComponent(Overlay, { expanded: true });
				for (const button of buttons) await fireEvent.click(button);
				const groupOverlay = getByText(textContent.groupOverlay);
				await fireEvent.click(groupOverlay);
				expect(buttons[2]).toHaveFocus();
			});

			it.skip('Should focus the button of the popover with focus within', async () => {
				const { buttons, getAllByText, getByText } = initComponent(Overlay, { expanded: true });
				for (const button of buttons) await fireEvent.click(button);
				const closeButtons = getAllByText('Close Me');

				await act(() => closeButtons[1].focus());
				const groupOverlay = getByText(textContent.groupOverlay);
				await fireEvent.click(groupOverlay);
				expect(buttons[1]).toHaveFocus();
			});

			it.skip('Should focus the button of the last popover that received a click within', async () => {
				const { buttons, getAllByText, getByText } = initComponent(Overlay, { expanded: true });
				for (const button of buttons) await fireEvent.click(button);
				const panels = getAllByText(textContent.panel);

				await fireEvent.click(panels[0]);
				const groupOverlay = getByText(textContent.groupOverlay);
				await fireEvent.click(groupOverlay);
				expect(buttons[0]).toHaveFocus();
			});

			it.skip('Should not focus any button after clicking or focusing an external element', async () => {
				const { buttons, getByText } = initComponent(Overlay, { expanded: true });
				for (const button of buttons) await fireEvent.click(button);

				const external = getByText(textContent.external);

				await act(() => external.focus());
				await fireEvent.click(external);
				expect(external).toHaveFocus();

				for (const button of buttons) await fireEvent.click(button);
				await act(() => external.focus());
				expect(external).toHaveFocus();
			});
		});
	});
});

describe.skip('Rendering', () => {
	it.skip('Should be rendered as a div by default', () => {
		const { getByTestId } = render(PopoverGroup, { props: { 'data-testid': 'popover-group' } });
		const group = getByTestId('popover-group');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(PopoverGroup, {
			props: { as, 'data-testid': 'popover-group' }
		});
		const group = getByTestId('popover-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it.skip('Should forward attributes', () => {
		const attributes = { tabIndex: 4, title: 'a popover group' };
		const { getByTestId } = render(PopoverGroup, {
			props: { 'data-testid': 'popover-group', ...attributes }
		});

		const group = getByTestId('popover-group');
		for (const [attribute, value] of Object.entries(attributes)) {
			expect(group).toHaveAttribute(attribute, value.toString());
		}
	});

	it.skip('Should be able to forward actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(PopoverGroup, { 'data-testid': 'popover-group', use: actions });
		const group = getByTestId('popover-group');
		for (const [action, index] of actions) {
			expect(action).toBeCalledWith(group, index);
		}
	});
});

describe.skip('Slot Props', () => {
	const holderTestiId = {
		isOpen: 'group-isOpen-holder',
		allOpen: 'group-allOpen-holder',
		allClosed: 'group-allClosed-holder'
	};

	describe.skip('allClosed', () => {
		const testId = holderTestiId.allClosed;
		it.skip('Should be set to true by default', () => {
			const { getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(testId);
			expect(holder).toHaveTextContent('true');
		});

		it.skip('Should be false when at least one popover is open', async () => {
			const { buttons, getByTestId } = initComponent(Behaviour, { expanded: true });
			const holder = getByTestId(testId);
			await fireEvent.click(buttons[0]);
			expect(holder).toHaveTextContent('false');
		});

		it.skip('Should be reactive', async () => {
			const { buttons, getByTestId, getByText } = initComponent(Behaviour, { expanded: true });
			const holder = getByTestId(testId);

			await fireEvent.click(buttons[0]);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(buttons[0]);
			expect(holder).toHaveTextContent('true');

			for (const button of buttons) await fireEvent.click(button);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(buttons[2]);
			expect(holder).toHaveTextContent('false');

			const external = getByText('External');
			await fireEvent.click(external);
			expect(holder).toHaveTextContent('true');
		});
	});

	describe.skip('allOpen', () => {
		const testId = holderTestiId.allOpen;
		it.skip('Should be set to false by default', () => {
			const { getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(testId);
			expect(holder).toHaveTextContent('false');
		});

		it.skip('Should be true when all popovers are open', async () => {
			const { buttons, getByTestId } = initComponent(Behaviour, { expanded: true });
			for (const button of buttons) await fireEvent.click(button);
			const holder = getByTestId(testId);
			expect(holder).toHaveTextContent('true');
		});

		it.skip('Should be reactive', async () => {
			const { buttons, getByTestId, getByText } = initComponent(Behaviour, { expanded: true });
			const holder = getByTestId(testId);
			expect(holder).toHaveTextContent('false');

			for (const button of buttons) await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(buttons[1]);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(buttons[1]);
			expect(holder).toHaveTextContent('true');
		});
	});

	describe.skip('isOpen', () => {
		const testId = holderTestiId.isOpen;
		it.skip('Should be set to false by default', async () => {
			const { getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(testId);
			expect(holder).toHaveTextContent('false');
		});

		it.skip('Should be true when at least a popover is open', async () => {
			const { buttons, getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(testId);
			const [first, second] = buttons;

			await fireEvent.click(first);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(first);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(second);
			expect(holder).toHaveTextContent('true');
		});

		it.skip('Should be reactive', async () => {
			const { buttons, getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(testId);
			const [first, second, third] = buttons;
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(first);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(first);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(second);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(third);
			expect(holder).toHaveTextContent('true');
		});
	});
});

describe.skip('Context', () => {
	describe.skip('Unset Context', () => {
		describe.skip('Overlay', () => {
			interface ContextKeys {
				Open: any;
				initClient: any;
				overlay: any;
			}
			const [init, messages] = createContextParentRenderer<ContextKeys>(
				ContextParent,
				'popover-group'
			);

			it.skip('Should throw an error if rendered without a PopoverGroup Context', () => {
				expect(() => render(PopoverOverlay)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => render(PopoverOverlay)).toThrow(messages.unset);
			});

			it.skip('Should throw an error if given an invalid PopoverGroup Context', () => {
				expect(() => init.skip(PopoverOverlay, null)).toThrow();
			});

			it.skip('Should throw an specific error if given an invalid PopoverGroup Context', () => {
				expect(() => init.skip(PopoverOverlay, null)).toThrow(messages.invalid);
			});

			it.skip('Should validate the context thoroughly', () => {
				expect(() =>
					init.skip(PopoverOverlay, { Open: null, initClient: null, overlay: null })
				).toThrow(messages.invalid);
				expect(() =>
					init.skip(PopoverOverlay, {
						Open: { subscribe: () => 64 },
						initClient: () => 64,
						overlay: null
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
