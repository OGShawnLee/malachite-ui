import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';
import { Accordion } from '$lib';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import { generateActions, isValidComponentName } from '@test-utils';
import { act, fireEvent, render } from '@testing-library/svelte';
import { writable } from 'svelte/store';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	return {
		...result,
		accordion: result.getByTestId('accordion'),
		headers: result.getAllByTestId('header'),
		buttons: result.getAllByTestId('button'),
		getAllPanels() {
			return result.getAllByTestId('panel');
		},
		getIsOpenHolders() {
			return {
				item: result.getByTestId('item-isOpen'),
				header: result.getByTestId('header-isOpen'),
				button: result.getByTestId('button-isOpen')
			};
		},
		getPanel(index: number) {
			return result.getByText(`Panel ${index}`);
		}
	};
}

const { Behaviour, DisabledNavigation, Rendering } = samples;
describe('Behaviour', () => {
	it('Should not render any open Item by default', () => {
		const { getAllPanels } = initComponent(Behaviour);
		expect(() => getAllPanels()).toThrow();
	});

	it('Should render one open Item at once', async () => {
		const { buttons, getAllPanels } = initComponent(Behaviour, { open: true });
		let panels = getAllPanels();
		expect(panels).toHaveLength(1);
		expect(panels[0]).toHaveTextContent('Panel 2');

		await fireEvent.click(buttons[0]);
		panels = getAllPanels();
		expect(panels).toHaveLength(1);
		expect(panels[0]).toHaveTextContent('Panel 1');

		await fireEvent.click(buttons[2]);
		panels = getAllPanels();
		expect(panels).toHaveLength(1);
		expect(panels[0]).toHaveTextContent('Panel 3');
	});

	describe('Navigation', () => {
		it('Should not work if the no Button is focused', async () => {
			const { accordion } = initComponent(Behaviour);
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(document.body).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(document.body).toHaveFocus();
		});

		it('Should be vertical', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'ArrowRight' });
			expect(buttons[0]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowLeft' });
			expect(buttons[0]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[1]).toHaveFocus();
		});

		it('Should move focus to the previous/next Button', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();
		});

		it('Should move to the previous Button by pressing ArrowUp', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();
		});

		it('Should move to the first Button by pressing ctrl + ArrowUp or Home', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp', ctrlKey: true });
			expect(buttons[0]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'End' });
			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(buttons[0]).toHaveFocus();
		});

		it('Should move to the next Button by pressing ArrowDown', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
		});

		it('Should move to the last Button by pressing ctrl + ArrowDown or End', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'Home' });
			await fireEvent.keyDown(accordion, { code: 'ArrowDown', ctrlKey: true });
			expect(buttons[2]).toHaveFocus();
		});

		it('Should skip disabled buttons', async () => {
			const { accordion, buttons } = initComponent(DisabledNavigation);
			await act(() => buttons[1].focus());

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[3]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[3]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown', ctrlKey: true });
			expect(buttons[3]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowUp', ctrlKey: true });
			expect(buttons[1]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[3]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(buttons[1]).toHaveFocus();
		});
	});

	describe('Item', () => {
		it('Should be closed by default', () => {
			const { buttons, getPanel } = initComponent(Behaviour);
			expect(buttons[0].ariaExpanded).toBe('false');
			expect(() => getPanel(0)).toThrow();
		});
	});

	describe('Button', () => {
		it('Should toggle its Panel via clicking', async () => {
			const { buttons, getPanel } = initComponent(Behaviour);
			await fireEvent.click(buttons[0]);
			const panel = getPanel(1);
			await fireEvent.click(buttons[0]);
			expect(panel).not.toBeInTheDocument();
		});
	});

	describe('Attributes', () => {
		describe('Button', () => {
			describe('aria-disabled', () => {
				it('Should be unset by default', () => {
					const { buttons } = initComponent(Behaviour);
					for (const button of buttons) expect(button.ariaDisabled).toBe(null);
				});

				it('Should be set to true if the Panel is visible and the Button is disabled', () => {
					const { buttons } = initComponent(Behaviour, { open: true, disabled: true });
					expect(buttons[1].ariaDisabled).toBe('true');
				});

				it('Should be reactive', async () => {
					const { component, buttons } = initComponent(Behaviour, { open: true, disabled: true });
					expect(buttons[1].ariaDisabled).toBe('true');
					await act(() => component.$set({ disabled: false }));
					expect(buttons[1].ariaDisabled).toBe(null);
				});
			});

			describe('aria-controls', () => {
				it('Should not be by default', () => {
					const { buttons } = initComponent(Behaviour);
					expect(buttons[0]).not.toHaveAttribute('aria-controls');
				});

				it('Should point to the panel id', async () => {
					const { buttons, getPanel } = initComponent(Behaviour);
					await fireEvent.click(buttons[0]);
					const panel = getPanel(1);
					expect(buttons[0]).toHaveAttribute('aria-controls', panel.id);
				});

				it('Should be based on the Panel render state', async () => {
					const { buttons, component, getPanel } = initComponent(Behaviour, { showPanel: false });
					const button = buttons[0];
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
					expect(button).not.toHaveAttribute('aria-controls');

					await act(() => component.$set({ showPanel: true }));
					const panel = getPanel(1);
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});
			});

			describe('aria-expanded', () => {
				it('Should be false by default', () => {
					const { buttons } = initComponent(Behaviour);
					expect(buttons[0].ariaExpanded).toBe('false');
				});

				it('Should be reactive', async () => {
					const { buttons } = initComponent(Behaviour);
					await fireEvent.click(buttons[0]);
					expect(buttons[0].ariaExpanded).toBe('true');
				});
			});
		});

		describe('Header', () => {
			describe('role', () => {
				it.each(elementTagNames)(
					'Should be set to heading if the element is not rendered as a heading (h1-h6)',
					(as) => {
						const { getByTestId } = render(Rendering, { props: { header: { as } } });
						const heading = getByTestId('header');
						expect(hasTagName(heading, as));
						expect(heading).toHaveAttribute('role');
					}
				);

				it.each(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])(
					'Should not be set if the element is a heading (%s)',
					(as) => {
						const { getByTestId } = render(Rendering, { props: { header: { as } } });
						const heading = getByTestId('header');
						expect(hasTagName(heading, as));
						expect(heading).not.toHaveAttribute('role');
					}
				);

				it('Should be overwritten', async () => {
					const { findByTestId } = render(Rendering, {
						props: { header: { as: 'div', rest: { role: 'random' } } }
					});
					const heading = await findByTestId('header');
					expect(heading).toHaveAttribute('role', 'heading');
				});
			});

			describe('level', () => {
				it('Should have aria-level set to 2 by default', () => {
					const { headers } = initComponent(Behaviour);
					for (const header of headers) {
						expect(header.ariaLevel).toBe('2');
					}
				});

				it.each(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])(
					'Should automatically take the heading level from the %s tagName',
					(tagName) => {
						const level = tagName[1];
						const { getByTestId } = render(Rendering, { props: { header: { as: tagName } } });
						expect(getByTestId('header').ariaLevel).toBe(level);
					}
				);
			});
		});

		describe('Panel', () => {
			describe('aria-labelledby', () => {
				it('Should point to its Button id', () => {
					const { buttons, getPanel } = initComponent(Behaviour, { open: true });
					const panel = getPanel(2);
					expect(panel).toHaveAttribute('aria-labelledby', buttons[1].id);
				});
			});

			describe('role', () => {
				it('Should be region as long as the amount of items is less than 6', () => {
					const { getPanel } = initComponent(Behaviour, { open: true });
					const panel = getPanel(2);
					expect(panel).toHaveAttribute('role', 'region');
				});
			});
		});
	});

	const { ActionComponent, SlotComponent } = samples;
	it.each([
		['Action Component', ActionComponent],
		['SlotComponent', SlotComponent]
	])('Should work rendered as a %s', async (name, Component) => {
		const { accordion, buttons, getAllPanels } = initComponent(Component);

		for (const button of buttons) {
			const header = button.parentElement!;
			expect(header).not.toHaveAttribute('role', 'heading');
			expect(header.ariaLevel).toBe(header.tagName[1]);

			expect(button.ariaExpanded).toBe('false');
			expect(button).not.toHaveAttribute('aria-controls');

			await fireEvent.click(button);
			const panel = getAllPanels()[0];

			expect(button.ariaExpanded).toBe('true');
			expect(button).toHaveAttribute('aria-controls', panel.id);
			expect(panel).toHaveAttribute('role', 'region');
			expect(panel).toHaveAttribute('aria-labelledby', button.id);
		}

		await act(() => buttons[0].focus());
		expect(buttons[0]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
		expect(buttons[1]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
		expect(buttons[2]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'Home' });
		expect(buttons[0]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'End' });
		expect(buttons[2]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'ArrowUp', ctrlKey: true });
		expect(buttons[0]).toHaveFocus();

		await fireEvent.keyDown(accordion, { code: 'ArrowDown', ctrlKey: true });
		expect(buttons[2]).toHaveFocus();
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(Accordion, { props: { 'data-testid': 'accordion' } });
		const element = getByTestId('accordion');
		expect(hasTagName(element, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(Accordion, { props: { as, 'data-testid': 'accordion' } });
		const group = getByTestId('accordion');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'an accordion root' };
		const { getByTestId } = render(Accordion, {
			props: {
				...attributes,
				as: 'div',
				'data-testid': 'accordion'
			}
		});
		const group = getByTestId('accordion');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(Accordion, {
			props: { use: actions, as: 'div', 'data-testid': 'accordion' }
		});
		const group = getByTestId('accordion');
		for (const [action, parameter] of actions) {
			expect(action).toBeCalledWith(group, parameter);
		}
	});

	describe.each([
		['Item', 'div'],
		['Header', 'h2'],
		['Button', 'button'],
		['Panel', 'div']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = lowerCaseComponent;

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} accordion id`, async () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);

			if (lowerCaseComponent === 'item') return;

			expect(isValidComponentName(element, 'accordion', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', async () => {
			const attributes = { tabIndex: '4', title: `an accordion ${lowerCaseComponent}` };
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
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});
});

describe('Props', () => {
	describe('Finite', () => {
		it('Should make the navigation finite', async () => {
			const { accordion, buttons } = initComponent(Behaviour, { finite: true });
			await act(() => buttons[0].focus());

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'End' });
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[2]).toHaveFocus();
		});

		it('Should be set to false by default', async () => {
			const { accordion, buttons } = initComponent(Behaviour);
			await act(() => buttons[0].focus());

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
		});

		it('Should work with an store', async () => {
			const finite = writable(false);
			const { accordion, buttons } = initComponent(Behaviour, { finite });
			await act(() => buttons[0].focus());

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[2]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();

			await act(() => finite.set(true));

			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();

			await fireEvent.keyDown(accordion, { code: 'End' });
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[2]).toHaveFocus();
		});
	});

	describe('Item', () => {
		describe('open', () => {
			it('Show change the Item state to open', () => {
				const { buttons, getAllPanels } = initComponent(Behaviour, { open: true });
				const panel = getAllPanels()[0];
				expect(buttons[1].ariaExpanded).toBe('true');
				expect(buttons[1]).toHaveAttribute('aria-controls', panel.id);
			});

			it('Should only allow to open one panel', () => {
				const { buttons, getAllPanels, getPanel } = initComponent(Behaviour, { open: true });
				const panel = getAllPanels()[0];
				expect(buttons[1].ariaExpanded).toBe('true');
				expect(buttons[1]).toHaveAttribute('aria-controls', panel.id);
				expect(buttons[2].ariaExpanded).toBe('false');
				expect(() => getPanel(3)).toThrow();
			});
		});
	});

	const { Level } = samples;
	describe('Header', () => {
		describe('level', () => {
			it('Should set the given value', () => {
				const { getByText } = render(Level, { props: { level: 3 } });
				const header = getByText('Header 1');
				expect(header.ariaLevel).toBe('3');
			});

			it('Should be reactive', async () => {
				const { component, getByText } = render(Level, { props: { level: 3 } });
				const header = getByText('Header 1');
				expect(header.ariaLevel).toBe('3');

				await act(() => component.$set({ level: 6 }));
				expect(header.ariaLevel).toBe('6');
			});

			it('Should work using the action', async () => {
				const { component, getByText } = render(Level, { props: { level: 3 } });
				const header = getByText('Header 2');
				expect(header.ariaLevel).toBe('3');

				await act(() => component.$set({ level: 6 }));
				expect(header.ariaLevel).toBe('6');
			});
		});
	});
});

describe('Slot Props', () => {
	describe('isOpen', () => {
		describe.each(['Item', 'Header', 'Button'])('%s Scope', (scope) => {
			const target = scope.toLowerCase() as 'item' | 'header' | 'button';
			it(`Should be exposed from ${scope}`, () => {
				const { getIsOpenHolders } = initComponent(Behaviour);
				const holder = getIsOpenHolders()[target];
				expect(holder).toHaveTextContent('false');
			});

			it('Should be reactive', async () => {
				const { getIsOpenHolders } = initComponent(Behaviour);
				const holder = getIsOpenHolders()[target];
				const button = holder.parentElement!;
				expect(holder).toHaveTextContent('false');

				await fireEvent.click(button);
				expect(holder).toHaveTextContent('true');

				await fireEvent.click(button);
				expect(holder).toHaveTextContent('false');
			});
		});
	});

	describe('close', () => {
		describe.each([
			['Item', 0],
			['Panel', 1]
		])('%s Scope', (scope, buttonIndex) => {
			const textContent = `Close ${scope}`;

			it(`Should be exposed from the ${scope} scope`, async () => {
				const { buttons, getByText, getAllPanels } = initComponent(Behaviour);
				const button = buttons[buttonIndex];

				await fireEvent.click(button);
				const panel = getAllPanels()[0];

				const closeButton = getByText(textContent);
				await fireEvent.click(closeButton);
				expect(panel).not.toBeInTheDocument();
			});
		});
	});
});
