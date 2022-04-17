import { elementTagNames } from '@components/render';
import { hasTagName } from '@predicate';
import { findElement } from '@utils';
import {
	fuseElementsName,
	generateActions,
	getAllByComponentName,
	isValidComponentName,
	useRange
} from '@test-utils';
import '@testing-library/jest-dom';
import { act, cleanup, render, fireEvent } from '@testing-library/svelte';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';

afterEach(() => cleanup());

async function renderOpenDialog(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	const button = await result.findByText('Toggle');
	await fireEvent.click(button);
	return { ...result, button };
}

describe('Behaviour', () => {
	const { Behaviour } = samples;

	it('Should be closed by default', async () => {
		const { container } = render(Behaviour);
		const content = findElement(container, (element) => element.textContent === 'Dialog Content');
		expect(content).toBeUndefined();
	});

	it('Should be toggled by clicking on a button', async () => {
		const { findByText, button } = await renderOpenDialog(Behaviour);
		const content = await findByText('Dialog Content');

		await fireEvent.click(button);
		expect(content).not.toBeInTheDocument();
	});

	it('Should be closed by clicking on the overlay', async () => {
		const { findByTestId } = await renderOpenDialog(Behaviour);
		const overlay = await findByTestId('dialog-overlay');

		await fireEvent.click(overlay);
		expect(overlay).not.toBeInTheDocument();
	});

	describe('Focus Management', () => {
		const { InitialFocus } = samples;
		enum initialFocusTarget {
			External = 'EXTERNAL',
			Dialog = 'DIALOG',
			Overlay = 'OVERLAY',
			Valid = 'VALID'
		}

		describe('initialFocus', () => {
			it('Should focus the first focusable element inside the content', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus);
				const firstFocusableElement = getByText('Close');
				expect(firstFocusableElement).toHaveFocus();
			});

			it('Should focus the given initialFocus', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus, {
					initialFocusTarget: initialFocusTarget.Valid
				});
				const initialFocus = getByText('Initial Focus');
				expect(initialFocus).toHaveFocus();
			});

			it('should not focus elements inside the overlay', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus, {
					initialFocusTarget: initialFocusTarget.Overlay
				});

				const validElement = getByText('Close');
				expect(validElement).toHaveFocus();
			});

			it('should not focus elements inside the dialog but outside the content', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus, {
					initialFocusTarget: initialFocusTarget.Dialog
				});

				const validElement = getByText('Close');
				expect(validElement).toHaveFocus();
			});

			it('should only focus elements inside the dialog content', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus, {
					initialFocusTarget: initialFocusTarget.External
				});

				const validElement = getByText('Close');
				expect(validElement).toHaveFocus();
			});
		});

		describe('Focus Trap', () => {
			it('Should trap focus inside the dialog content', async () => {
				const { getByText } = await renderOpenDialog(InitialFocus, {
					initialFocusTarget: initialFocusTarget.Valid
				});

				const initialFocus = getByText('Initial Focus');
				const button = getByText('Close');
				expect(initialFocus).toHaveFocus();
				await fireEvent.keyDown(window, { code: 'Tab' });
				expect(button).toHaveFocus();

				// this needs more testing
			});
		});
	});

	describe('Dialog', () => {
		describe('attributes', () => {
			describe('id', () => {
				it('Should have an appropiate disclosure id', async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour);
					const dialog = await findByTestId('dialog-root');
					expect(isValidComponentName(dialog, 'dialog'));
				});
			});

			describe('aria-modal', () => {
				it('Should have aria-modal set to true', async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour);
					const dialog = await findByTestId('dialog-root');
					expect(dialog.ariaModal).toBe('true');
				});
			});

			describe('role', () => {
				it('Should have role set to dialog', async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour);
					const dialog = await findByTestId('dialog-root');
					expect(dialog).toHaveAttribute('role', 'dialog');
				});
			});

			const noPlural = (str: string) => str.substring(0, str.length - 1);

			describe.each([
				['labelledby', 'Titles'],
				['describedby', 'Descriptions']
			])('aria-%s', (attribute, components) => {
				const name = noPlural(components).toLowerCase();

				test(`Should be set if there are ${name} components`, async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour);
					const dialog = await findByTestId('dialog-root');
					expect(dialog).toHaveAttribute(`aria-${attribute}`);
				});

				it(`Should not have aria-${attribute} if there are no ${name} components`, async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour, {
						[components]: useRange(0)
					});
					const dialog = await findByTestId('dialog-root');
					expect(dialog).not.toHaveAttribute(`aria-${attribute}`);
				});

				it(`Should point to all the ids of the ${name} components`, async () => {
					const { findByTestId } = await renderOpenDialog(Behaviour, {
						[components]: useRange(6)
					});
					const dialog = await findByTestId('dialog-root');
					const elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});

					expect(elements).toHaveLength(6);
					expect(dialog).toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));
				});

				it('Should be reactive', async () => {
					const Range = useRange(0, { min: 0, max: 10 });
					const { findByTestId } = await renderOpenDialog(Behaviour, { [components]: Range });
					const dialog = await findByTestId('dialog-root');
					expect(dialog).not.toHaveAttribute(`aria-${attribute}`);

					await act(() => Range.increment());
					let elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});
					expect(elements).toHaveLength(1);
					expect(dialog).toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));

					await act(() => Range.increment());
					elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});
					expect(elements).toHaveLength(2);
					expect(dialog).toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));

					await act(() => Range.set(6));
					elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});
					expect(elements).toHaveLength(6);
					expect(dialog).toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));

					await act(() => Range.set(3));
					elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});
					expect(elements).toHaveLength(3);
					expect(dialog).toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));

					await act(() => Range.reset());
					elements = getAllByComponentName('dialog', {
						container: dialog,
						predicate: ({ id }) => id.includes(name)
					});
					expect(elements).toHaveLength(0);
					expect(dialog).not.toHaveAttribute(`aria-${attribute}`, fuseElementsName(elements));
				});
			});
		});
	});
});

describe('Rendering', () => {
	const { Rendering } = samples;
	describe('Dialog', () => {
		it('Should be rendered as a div by default', async () => {
			const { findByTestId } = await renderOpenDialog(Rendering);
			const dialog = await findByTestId('dialog--root');

			expect(dialog).toBeInTheDocument();
			expect(hasTagName(dialog, 'div')).toBe(true);
			expect(isValidComponentName(dialog, 'dialog')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { findByTestId } = await renderOpenDialog(Rendering, { dialog: { as } });
			const dialog = await findByTestId('dialog--root');
			expect(hasTagName(dialog, as)).toBe(true);
		});

		it('Should be able to forward actions if not rendered as a slot', async () => {
			const use = generateActions(5);
			const { findByTestId } = await renderOpenDialog(Rendering, { dialog: { use } });
			const dialog = await findByTestId('dialog--root');
			for (let [action, param] of use) {
				expect(action).toHaveBeenCalledTimes(1);
				expect(action).toBeCalledWith(dialog, param);
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
			const element = await findByText(`${component}`);
			expect(hasTagName(element, name)).toBe(true);
		});

		it(`Should have an appropiate dialog ${lowerCaseComponent} internal name`, async () => {
			const { findByText } = await renderOpenDialog(Rendering);
			const element = await findByText(`${component}`);
			expect(isValidComponentName(element, 'dialog', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { findByText } = await renderOpenDialog(Rendering, { [lowerCaseComponent]: { as } });
			const element = await findByText(`${component}`);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able to forward actions if not rendered as a slot', async () => {
			const use = generateActions(5);
			const { findByText } = await renderOpenDialog(Rendering, { [lowerCaseComponent]: { use } });
			const element = await findByText(`${component}`);
			for (let [action, param] of use) {
				expect(action).toHaveBeenCalledTimes(1);
				expect(action).toBeCalledWith(element, param);
			}
		});
	});
});
