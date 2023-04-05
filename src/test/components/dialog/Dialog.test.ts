import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import {
	ContextParent,
	createContextParentRenderer,
	fuseElementsName,
	generateActions,
	isValidComponentName,
	useRange
} from '@test-utils';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import { DialogContent, DialogDescription, DialogOverlay, DialogTitle } from '$lib';
import { ElementBinder } from '$lib/core';

const cases = [samples.Action, samples.Component];
describe('Behaviour', () => {
	it.each(cases)('Should be closed by default', async (Component) => {
		const { getByTestId } = render(Component);
		expect(() => getByTestId('dialog-content')).toThrow();
	});

	it.each(cases)('Should open', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
	});

	it.each(cases)('Should close', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
		await fireEvent.click(button);
		expect(content).not.toBeInTheDocument();
	});

	it.each(cases)('Should close by pressing Escape', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
		await fireEvent.keyDown(document, { code: 'Escape' });
		expect(content).not.toBeInTheDocument();
	});

	it.each(cases)('Should close by clicking outside DialogContent', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		const binding = getByTestId('binding-open');
		button.focus();
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
		await fireEvent.click(binding);
		expect(content).not.toBeInTheDocument();
	});

	it.each(cases)('Should focus element that opened dialog', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		button.focus(); // click does not focus this thing
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		const overlay = getByTestId('dialog-overlay');
		expect(content).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		const close = getByText('Close Me');
		await fireEvent.click(close);
		expect(button).toHaveFocus();
	});

	it.each(cases)('Should close by clicking Overlay', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		const overlay = getByTestId('dialog-overlay');
		expect(content).toBeInTheDocument();
		expect(overlay).toBeInTheDocument();
		await fireEvent.click(overlay);
		expect(content).not.toBeInTheDocument();
	});

	it.each(cases)('Should focus first element', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
		const close = getByText('Close Me');
		expect(close).toHaveFocus();
	});

	it.each(cases)('Should trap focus inside the DialogContent', async (Component) => {
		const { getByTestId, getByText } = render(Component, {
			props: { isShowingInitialFocus: true }
		});
		const button = getByText('Toggle');
		await fireEvent.click(button);
		const content = getByTestId('dialog-content');
		expect(content).toBeInTheDocument();
		const close = getByText('Close Me');
		const initialFocus = getByText('Initial Focus');
		expect(initialFocus).toHaveFocus();
		await fireEvent.keyDown(content, { code: 'Tab' });
		expect(close).toHaveFocus();
		await fireEvent.keyDown(content, { code: 'Tab', shiftKey: true });
		expect(initialFocus).toHaveFocus();
	});

	describe('Attributes', () => {
		describe('DialogContent', () => {
			it.each(cases)('Should have aria-dialog set to true', async (Component) => {
				const { getByTestId, getByText } = render(Component);
				const button = getByText('Toggle');
				await fireEvent.click(button);
				const content = getByTestId('dialog-content');
				expect(content).toBeInTheDocument();
				expect(content.ariaModal).toBe('true');
			});

			it.each(cases)('Should have role set to dialog', async (Component) => {
				const { getByTestId, getByText } = render(Component);
				const button = getByText('Toggle');
				await fireEvent.click(button);
				const content = getByTestId('dialog-content');
				expect(content).toBeInTheDocument();
				expect(content.role).toBe('dialog');
			});

			describe('aria-describedby', () => {
				it.each(cases)('Should point to the dialog description id', async (Component) => {
					const { getByTestId, getByText } = render(Component);
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const description = getByText(/Description/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-describedby', description.id);
				});

				it.each(cases)('Should be unset if there is no description', async (Component) => {
					const { getByTestId, getByText } = render(Component, {
						props: { descriptions: useRange(0) }
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					expect(content).toBeInTheDocument();
					expect(content).not.toHaveAttribute('aria-describedby');
				});

				it.each(cases)('Should include multiple descriptions', async (Component) => {
					const { getAllByText, getByText, getByTestId } = render(Component, {
						props: {
							descriptions: useRange(3)
						}
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const descriptions = getAllByText(/Description/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const range = useRange(3);
					const { getAllByText, getByTestId, getByText } = render(Component, {
						props: { descriptions: range }
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const descriptions = getAllByText(/Description/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
					await act(() => range.set(0));
					expect(content).not.toHaveAttribute('aria-describedby');
					await act(() => range.set(1));
					const title = getByText(/Description/);
					expect(content).toHaveAttribute('aria-describedby', title.id);
				});
			});

			describe('aria-labelledby', () => {
				it.each(cases)('Should point to the dialog title id', async (Component) => {
					const { getByTestId, getByText } = render(Component);
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const title = getByText(/Title/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-labelledby', title.id);
				});

				it.each(cases)('Should be unset if there is no title', async (Component) => {
					const { getByTestId, getByText } = render(Component, {
						props: { titles: useRange(0) }
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					expect(content).toBeInTheDocument();
					expect(content).not.toHaveAttribute('aria-labelledby');
				});

				it.each(cases)('Should include multiple descriptions', async (Component) => {
					const { getAllByText, getByText, getByTestId } = render(Component, {
						props: { titles: useRange(3) }
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const titles = getAllByText(/Title/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-labelledby', fuseElementsName(titles));
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const range = useRange(3);
					const { getAllByText, getByTestId, getByText } = render(Component, {
						props: { titles: range }
					});
					const button = getByText('Toggle');
					await fireEvent.click(button);
					const content = getByTestId('dialog-content');
					const titles = getAllByText(/Title/);
					expect(content).toBeInTheDocument();
					expect(content).toHaveAttribute('aria-labelledby', fuseElementsName(titles));
					await act(() => range.set(0));
					expect(content).not.toHaveAttribute('aria-labelledby');
					await act(() => range.set(1));
					const title = getByText(/Title/);
					expect(content).toHaveAttribute('aria-labelledby', title.id);
				});
			});
		});
	});
});

describe('Props', () => {
	describe('initialFocus', () => {
		it.each(cases)('Should change the first element focused upon opening', async (Component) => {
			const { getByTestId, getByText } = render(Component, {
				props: { isShowingInitialFocus: true }
			});
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const content = getByTestId('dialog-content');
			expect(content).toBeInTheDocument();
			const element = getByText('Initial Focus');
			expect(element).toHaveFocus();
		});

		it.each(cases)(
			'Should not focus elements that are outside the DialogContent',
			async (Component) => {
				const { component, getByTestId, getByText } = render(Component);
				const button = getByText('Toggle');
				await act(() => component.$set({ initialFocus: button }));
				await fireEvent.click(button);
				const content = getByTestId('dialog-content');
				expect(content).toBeInTheDocument();
				expect(button).not.toHaveFocus();
			}
		);
	});

	describe('open', () => {
		it.each(cases)('Should be false by default', async (Component) => {
			const { getByTestId } = render(Component);
			expect(() => getByTestId('dialog-content')).toThrow();
		});

		it.each(cases)(
			'Should determine whether or not the dialog is rendered or not',
			async (Component) => {
				const { getByTestId } = render(Component, { props: { open: true } });
				const content = getByTestId('dialog-content');
				expect(content).toBeInTheDocument();
			}
		);

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { open: true } });
			const content = getByTestId('dialog-content');
			expect(content).toBeInTheDocument();
			await act(() => component.$set({ open: false }));
			expect(content).not.toBeInTheDocument();
		});

		it.each(cases)('Should be a dual binding', async (Component) => {
			const { getByTestId, getByText } = render(Component);
			const button = getByText('Toggle');
			const binding = getByTestId('binding-open');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('true');
		});
	});
});

describe('Rendering', () => {
	const { Rendering } = samples;
	describe('Dialog', () => {
		it('Should be rendered as a div by default', async () => {
			const { findByTestId, getByText } = render(Rendering);
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const dialog = await findByTestId('dialog-container');

			expect(dialog).toBeInTheDocument();
			expect(hasTagName(dialog, 'div')).toBe(true);
			expect(isValidComponentName(dialog, 'dialog')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { findByTestId, getByText } = render(Rendering, { dialog: { as } });
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const dialog = await findByTestId('dialog-container');
			expect(hasTagName(dialog, as)).toBe(true);
		});

		it('Should be able to forward actions if not rendered as a slot', async () => {
			const use = generateActions(5);
			const { findByTestId, getByText } = render(Rendering, { dialog: { use } });
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const dialog = await findByTestId('dialog-container');
			for (let action of use) {
				expect(action).toHaveBeenCalledTimes(1);
				expect(action).toBeCalledWith(dialog);
			}
		});
	});

	describe.each([
		['Content', 'div'],
		['Description', 'p'],
		['Overlay', 'div'],
		['Title', 'h2']
	])('%s', (component, name) => {
		const lowerCaseComponent = component.toLowerCase();

		it(`Should be rendered as a ${name} by default`, async () => {
			const { findByText, getByText } = render(Rendering);
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const element = await findByText(component);
			expect(hasTagName(element, name)).toBe(true);
		});

		it(`Should have an appropiate dialog ${lowerCaseComponent} internal name`, async () => {
			const { findByText, getByText } = render(Rendering);
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const element = await findByText(component);
			expect(isValidComponentName(element, 'dialog', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { findByText, getByText } = render(Rendering, { [lowerCaseComponent]: { as } });
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const element = await findByText(component);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding actions if not rendered as a slot', async () => {
			const use = generateActions(5);
			const { findByText, getByText } = render(Rendering, { [lowerCaseComponent]: { use } });
			const button = getByText('Toggle');
			await fireEvent.click(button);
			const element = await findByText(component);
			for (let action of use) {
				expect(action).toHaveBeenCalledTimes(1);
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Context', () => {
	interface ContextKeys {
		isOpen: any;
		close: any;
		createDialogContent: any;
		createDialogDescription: any;
		createDialogOverlay: any;
		createDialogTitle: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'dialog');

	describe('Unset Context', () => {
		describe.each([
			['Content', DialogContent],
			['Description', DialogDescription],
			['Overlay', DialogOverlay],
			['Title', DialogTitle]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered without a Dialog Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['Content', DialogContent],
			['Description', DialogDescription],
			['Overlay', DialogOverlay],
			['Title', DialogTitle]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid Dialog Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(messages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						isOpen: null,
						close: null,
						createDialogContent: null,
						createDialogDescription: null,
						createDialogOverlay: null,
						createDialogTitle: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init(Component, {
						isOpen: { subscribe: 96 },
						close: () => null,
						createDialogContent: null,
						createDialogDescription: 'hey',
						createDialogOverlay: { binder: new ElementBinder(), action: () => null },
						createDialogTitle: null
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
