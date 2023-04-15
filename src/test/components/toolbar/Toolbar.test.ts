import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Component, FragmentComponent, Rendering, Synergy } from './samples';
import { Toolbar, ToolbarGroup, ToolbarItem, ToolbarLabel } from '$lib';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import { fuseElementsName, generateActions, isValidComponentName, useRange } from '@test-utils';

const cases = [Component, FragmentComponent];
describe('Attributes', () => {
	describe('Toolbar', () => {
		describe('aria-labelledby', () => {
			it.each(cases)('Should point to the ToolbarLabel id', (Component) => {
				const { getByTestId } = render(Component);
				const label = getByTestId('toolbar-label');
				const toolbar = getByTestId('toolbar');
				expect(toolbar).toHaveAttribute('aria-labelledby', label.id);
			});

			it.each(cases)('Should include multiple ToolbarLabels', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(3) }
				});
				const labels = getAllByTestId('toolbar-label');
				const toolbar = getByTestId('toolbar');
				expect(toolbar).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});

			it.each(cases)('Should be undefined if there are no ToolbarLabels', (Component) => {
				const { getByTestId } = render(Component, { props: { amount: useRange(0) } });
				const toolbar = getByTestId('toolbar');
				expect(toolbar).not.toHaveAttribute('aria-labelledby');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { component, getByTestId } = render(Component, { props: { amount } });
				const toolbar = getByTestId('toolbar');
				expect(toolbar).not.toHaveAttribute('aria-labelledby');
				await act(() => amount.increment());
				const label = getByTestId('toolbar-label');
				expect(toolbar).toHaveAttribute('aria-labelledby', label.id);
			});
		});

		describe('aria-orientation', () => {
			it.each(cases)('Should default to horizontal', (Component) => {
				const { getByTestId } = render(Component);
				const toolbar = getByTestId('toolbar');
				expect(toolbar.ariaOrientation).toBe('horizontal');
			});

			it.each(cases)('Should be vertical when navigation is vertical', (Component) => {
				const { getByTestId } = render(Component, { props: { vertical: true } });
				const toolbar = getByTestId('toolbar');
				expect(toolbar.ariaOrientation).toBe('vertical');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { component, getByTestId } = render(Component);
				const toolbar = getByTestId('toolbar');
				expect(toolbar.ariaOrientation).toBe('horizontal');
				await act(() => component.$set({ vertical: true }));
				expect(toolbar.ariaOrientation).toBe('vertical');
			});
		});

		it.each(cases)("Should have role set to 'toolbar'", (Component) => {
			const { getByTestId } = render(Component);
			const toolbar = getByTestId('toolbar');
			expect(toolbar.role).toBe('toolbar');
		});

		it.each('Should tabIndex set to -1', (Component) => {
			const { getByTestId } = render(Component);
			const toolbar = getByTestId('toolbar');
			expect(toolbar.tabIndex).toBe(-1);
		});
	});

	describe('ToolbarLabel', () => {
		it.each(cases)('Should have for pointing to the Toolbar id', (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const labels = getAllByTestId('toolbar-label');
			const toolbar = getByTestId('toolbar');
			for (const label of labels) {
				expect(label.for).toBe(toolbar.id);
			}
		});
	});
});

describe('Behaviour', () => {
	describe('Navigation', () => {
		describe.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const vertical = orientation === 'Vertical';

			it.each(cases)('Should be horizontal by default', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
				expect(items[0]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
				expect(items[1]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: 'ArrowLeft' });
				expect(items[0]).toHaveFocus();
			});

			it.each(cases)('Should be infinite by default', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: previousKey });
				expect(items[4]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: nextKey });
				expect(items[0]).toHaveFocus();
			});

			it.each(cases)(`Should focus the next Item by pressing ${nextKey}`, async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: nextKey });
				expect(items[0]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: nextKey });
				expect(items[1]).toHaveFocus();
			});

			it.each(cases)(`Should focus the previous Item by pressing ${nextKey}`, async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: previousKey });
				expect(items[4]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: previousKey });
				expect(items[3]).toHaveFocus();
			});

			it.each(cases)('Should focus the last Item by pressing End', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: 'End' });
				expect(items[4]).toHaveFocus();
			});

			it.each(cases)('Should focus the first Item by pressing Home', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: 'End' });
				expect(items[4]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: 'Home' });
				expect(items[0]).toHaveFocus();
			});

			it.each(cases)(
				`Should focus the last Item by pressing ${nextKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
					const toolbar = getByTestId('toolbar');
					const items = getAllByTestId('toolbar-item');
					await fireEvent.keyDown(toolbar, { code: nextKey, ctrlKey: true });
					expect(items[4]).toHaveFocus();
				}
			);

			it.each(cases)(
				`Should focus the first Item by pressing ${previousKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { vertical } });
					const toolbar = getByTestId('toolbar');
					const items = getAllByTestId('toolbar-item');
					await fireEvent.keyDown(toolbar, { code: 'End' });
					expect(items[4]).toHaveFocus();
					await fireEvent.keyDown(toolbar, { code: previousKey, ctrlKey: true });
					expect(items[0]).toHaveFocus();
				}
			);

			it.each(cases)('Should skip disabled Items', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { disabled: true, vertical }
				});
				const toolbar = getByTestId('toolbar');
				const items = getAllByTestId('toolbar-item');
				await fireEvent.keyDown(toolbar, { code: nextKey });
				expect(items[1]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: nextKey });
				expect(items[3]).toHaveFocus();
				await fireEvent.keyDown(toolbar, { code: previousKey });
				expect(items[1]).toHaveFocus();
			});
		});
	});
});

describe('Props', () => {
	describe('vertical', () => {
		it.each(cases)('Should turn the navigation vertical', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { vertical: true } });
			const items = getAllByTestId('toolbar-item');
			const toolbar = getByTestId('toolbar');
			await fireEvent.keyDown(toolbar, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowDown' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowUp' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be false by default (horizontal)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const items = getAllByTestId('toolbar-item');
			const toolbar = getByTestId('toolbar');
			await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const items = getAllByTestId('toolbar-item');
			const toolbar = getByTestId('toolbar');
			await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();

			await act(() => component.$set({ vertical: true }));

			await fireEvent.keyDown(toolbar, { code: 'ArrowDown' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowDown' });
			expect(items[2]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: 'ArrowUp' });
			expect(items[1]).toHaveFocus();
		});
	});
});

describe('Slot Props', () => {
	describe('ToolbarItem', () => {
		describe('isDisabled', () => {
			it('Should be false by default', () => {
				const { getAllByTestId } = render(Component);
				const bindings = getAllByTestId('binding-disabled');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
			});

			it('Should be true when the ToolbarItem is disabled', () => {
				const { getAllByTestId } = render(Component, { props: { disabled: true } });
				const bindings = getAllByTestId('binding-disabled');
				expect(bindings[0]).toHaveTextContent('true');
				expect(bindings[1]).toHaveTextContent('false');
				expect(bindings[2]).toHaveTextContent('true');
				expect(bindings[3]).toHaveTextContent('false');
				expect(bindings[4]).toHaveTextContent('true');
			});

			it('Should be reactive', async () => {
				const { component, getAllByTestId } = render(Component);
				const bindings = getAllByTestId('binding-disabled');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
				await act(() => component.$set({ disabled: true }));
				expect(bindings[0]).toHaveTextContent('true');
				expect(bindings[1]).toHaveTextContent('false');
				expect(bindings[2]).toHaveTextContent('true');
				expect(bindings[3]).toHaveTextContent('false');
				expect(bindings[4]).toHaveTextContent('true');
			});
		});
	});
});

// Button: index 0 - 2
// MenuButton: index 3
// RadioGroupOption: index 4 - 7

describe('Synergy', () => {
	describe.each([
		['Horizontal', 'ArrowRight', 'ArrowLeft'],
		['Vertical', 'ArrowDown', 'ArrowUp']
	])('%s', (orientation, nextKey, previousKey) => {
		const vertical = orientation === 'Vertical';

		it('Should automatically include Button components in the navigation', async () => {
			const { getAllByTestId, getByTestId } = render(Synergy, { props: { vertical } });
			const buttons = getAllByTestId('button');
			const toolbar = getByTestId('toolbar');
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(buttons[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(buttons[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(buttons[2]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: previousKey });
			expect(buttons[1]).toHaveFocus();
		});

		it('Should automatically include MenuButton components in the navigation', async () => {
			const { getAllByTestId, getByTestId } = render(Synergy, { props: { vertical } });
			const buttons = getAllByTestId('button');
			const menuButton = getByTestId('menu-button');
			const toolbar = getByTestId('toolbar');
			await act(() => buttons[2].focus());
			expect(buttons[2]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(menuButton).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: previousKey });
			expect(buttons[2]).toHaveFocus();
		});

		it('Should automatically include RadioGroupOption components in the navigation', async () => {
			const { getAllByTestId, getByTestId } = render(Synergy, { props: { vertical } });
			const menuButton = getByTestId('menu-button');
			const radioGroupOptions = getAllByTestId('radio-group-option');
			const toolbar = getByTestId('toolbar');
			await fireEvent.click(menuButton);
			await fireEvent.click(menuButton);
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(radioGroupOptions[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(radioGroupOptions[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(radioGroupOptions[2]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: previousKey });
			expect(radioGroupOptions[1]).toHaveFocus();
		});

		it('Should automatically turn manual a RadioGroup', async () => {
			const { getAllByTestId, getByTestId } = render(Synergy, { props: { vertical } });
			const menuButton = getByTestId('menu-button');
			const radioGroupOptions = getAllByTestId('radio-group-option');
			const textAlignBinding = getByTestId('text-align-value');
			const toolbar = getByTestId('toolbar');
			await fireEvent.click(menuButton);
			await fireEvent.click(menuButton);
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(textAlignBinding).toHaveTextContent('text-left');
			expect(radioGroupOptions[0]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(radioGroupOptions[1]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: nextKey });
			expect(radioGroupOptions[2]).toHaveFocus();
			await fireEvent.keyDown(toolbar, { code: previousKey });
			expect(radioGroupOptions[1]).toHaveFocus();
			expect(textAlignBinding).toHaveTextContent('text-left');
		});
	});

	it('Should allow navigating only through the RadioGroup options by pressing the opposite navigation keys', async () => {
		const { component, getAllByTestId, getByTestId } = render(Synergy); // horizontal
		const buttons = getAllByTestId('button');
		const radioGroup = getByTestId('radio-group');
		const radioGroupOptions = getAllByTestId('radio-group-option');
		const toolbar = getByTestId('toolbar');
		await fireEvent.keyDown(toolbar, { code: 'End' });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowUp', ctrlKey: true });
		expect(radioGroupOptions[0]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowDown', ctrlKey: true });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowDown' });
		expect(radioGroupOptions[0]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowUp' });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(toolbar, { code: 'ArrowRight' });
		expect(buttons[0]).toHaveFocus();

		await act(() => component.$set({ vertical: true })); // vertical
		await fireEvent.keyDown(toolbar, { code: 'End' });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowLeft', ctrlKey: true });
		expect(radioGroupOptions[0]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowRight', ctrlKey: true });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowRight' });
		expect(radioGroupOptions[0]).toHaveFocus();
		await fireEvent.keyDown(radioGroup, { code: 'ArrowLeft' });
		expect(radioGroupOptions[3]).toHaveFocus();
		await fireEvent.keyDown(toolbar, { code: 'ArrowDown' });
		expect(buttons[0]).toHaveFocus();
	});

	it('Should allow opening a Menu by pressing vertical keys if Toolbar is horizontal', async () => {
		const { getAllByTestId, getByTestId } = render(Synergy);
		const danger = () => getByTestId('menu-panel');
		const menuButton = getByTestId('menu-button');
		await fireEvent.keyDown(menuButton, { code: 'ArrowDown' });
		expect(danger).not.toThrow();
		await fireEvent.click(menuButton);
		expect(danger).toThrow();
		await fireEvent.keyDown(menuButton, { code: 'ArrowUp' });
		expect(danger).not.toThrow();
	});

	it('Should not allow opening a Menu by pressing vertical keys if Toolbar is vertical', async () => {
		const { getAllByTestId, getByTestId } = render(Synergy, { props: { vertical: true } });
		const danger = () => getByTestId('menu-panel');
		const menuButton = getByTestId('menu-button');
		await fireEvent.keyDown(menuButton, { code: 'ArrowDown' });
		expect(danger).toThrow();
		await fireEvent.keyDown(menuButton, { code: 'ArrowUp' });
		expect(danger).toThrow();
	});
});

describe('Rendering', () => {
	describe.each([
		['Group', 'fragment', ToolbarGroup],
		['Toolbar', 'div', Toolbar]
	])('%s', (name, defaultTag, Component) => {
		const isFragment = defaultTag === 'fragment';
		if (isFragment) {
			it('Should be rendered as a fragment by default', () => {
				const { getByTestId } = render(Component, {
					props: { 'data-testid': 'toolbar-element' }
				});
				const danger = () => getByTestId('toolbar-element');
				expect(danger).toThrow();
			});
		} else {
			it(`Should be rendered as a ${defaultTag} by default`, () => {
				const { getByTestId } = render(Component, {
					props: { 'data-testid': 'toolbar-element' }
				});
				const element = getByTestId('toolbar-element');
				expect(hasTagName(element, defaultTag)).toBe(true);
			});
		}

		it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
			const { getByTestId } = render(Component, {
				props: { as, 'data-testid': 'toolbar-element' }
			});
			const element = getByTestId('toolbar-element');
			expect(hasTagName(element, as)).toBe(true);
		});
	});

	describe.each([
		['Toolbar', 'div'],
		['Item', 'button'],
		['Label', 'label']
	])('Radio%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testid = 'toolbar-' + lowerCaseComponent;

		it(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testid);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} toolbar id`, async () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testid);
			expect(isValidComponentName(element, 'toolbar')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const element = getByTestId(testid);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', async () => {
			const attributes = { title: `a toolbar ${lowerCaseComponent}` };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});
			const element = getByTestId(testid);
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
			const element = getByTestId(testid);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});
