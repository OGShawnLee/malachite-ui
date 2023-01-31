import '@testing-library/jest-dom';
import * as samples from './samples';
import type { SvelteComponent } from 'svelte';
import { Menu, MenuButton, MenuItems } from '$lib';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName,
	waitAWhile
} from '@test-utils';
import { Bridge } from '$lib/stores';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	const button = result.getByText('Toggle');

	function getPanel() {
		return result.getByTestId('menu-panel');
	}

	function getAllItems() {
		return result.getAllByText(/Item/);
	}

	async function open() {
		await fireEvent.click(button);
		return result.findByTestId('menu-panel');
	}

	return { ...result, button, getPanel, getAllItems, open };
}

function initItem(props: {
	disabled?: boolean;
	target?: 'ACTION' | 'COMPONENT';
	handleClick?: (event: MouseEvent) => void;
}) {
	const result = render(Item, { props });
	const button = result.getByText('Toggle');

	async function open() {
		await fireEvent.click(button);
		return result.getByText('Item');
	}

	return { ...result, button, open };
}

const { Behaviour, DisabledNavigation, Item } = samples;
describe.skip('Behaviour', () => {
	it.skip('Should be closed by default', () => {
		const { getPanel } = initComponent(Behaviour);
		expect(getPanel).toThrow();
	});

	describe.skip('Button', () => {
		it.skip('Should toggle the Panel on click', async () => {
			const { button, getByTestId } = initComponent(Behaviour);
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');

			await fireEvent.click(button);
			expect(panel).not.toBeInTheDocument();
		});
	});

	describe.skip('Button-Panel', () => {
		describe.skip('Click Opening', () => {
			it.skip('Should not select any Item upon opening with a click', async () => {
				const { open } = initComponent(Behaviour);
				const panel = await open();
				expect(panel).not.toHaveAttribute('aria-activedescendant');
			});

			it.each([
				['ArrowDown', false],
				['ArrowRight', true],
				['Home', false]
			])(
				'Should select the first non-disabled item upon pressing %s',
				async (nextKey, horizontal) => {
					const { open, getByText } = initComponent(DisabledNavigation, { horizontal });
					const panel = await open();
					const { id } = getByText('Item 2');

					await waitAWhile(25);

					await fireEvent.keyDown(panel, { code: nextKey });
					await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', id));
				}
			);

			it.each([
				['ArrowDown', false],
				['ArrowRight', true]
			])(
				'Should select the last non-disabled item upon pressing ctrlKey + %s',
				async (nextKey, horizontal) => {
					const { open, getByText } = initComponent(DisabledNavigation, { horizontal });
					const panel = await open();
					const { id } = getByText('Item 6');

					await waitAWhile(25);

					await fireEvent.keyDown(panel, { code: nextKey, ctrlKey: true });
					await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', id));
				}
			);

			it.each([
				['ArrowUp', false],
				['ArrowLeft', true],
				['End', false]
			])(
				'Should select the last non-disabled item upon pressing %s',
				async (previousKey, horizontal) => {
					const { open, getByText } = initComponent(DisabledNavigation, { horizontal });
					const panel = await open();
					const { id } = getByText('Item 6');

					await waitAWhile(25);

					await fireEvent.keyDown(panel, { code: previousKey });
					await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', id));
				}
			);

			it.each([
				['ArrowUp', false],
				['ArrowLeft', true]
			])(
				'Should select the first non-disabled item upon pressing ctrlKey + %s',
				async (previousKey, horizontal) => {
					const { open, getByText } = initComponent(DisabledNavigation, { horizontal });
					const panel = await open();
					const { id } = getByText('Item 2');

					await waitAWhile(25);

					await fireEvent.keyDown(panel, { code: previousKey, ctrlKey: true });
					await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', id));
				}
			);
		});

		describe.skip.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('Button Keyboard Opening - %s', (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';
			const Component = DisabledNavigation;

			it.skip(`Should open and select the first non-disabled Item upon pressing ${nextKey}`, async () => {
				const { button, findByTestId, getAllItems } = initComponent(Component, { horizontal });
				await fireEvent.keyDown(button, { code: nextKey });
				const panel = await findByTestId('menu-panel');
				const items = getAllItems();
				await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[1].id));
			});

			it.skip(`Should open and select the last non-disabled Item upon pressing ctrl + ${nextKey}`, async () => {
				const { button, findByTestId, getAllItems } = initComponent(Component, { horizontal });
				await fireEvent.keyDown(button, { code: nextKey, ctrlKey: true });
				const panel = await findByTestId('menu-panel');
				const items = getAllItems();
				await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[5].id));
			});

			it.skip(`Should open and select the last non-disabled item upon pressing ${previousKey}`, async () => {
				const { button, findByTestId, getAllItems } = initComponent(Component, { horizontal });
				await fireEvent.keyDown(button, { code: previousKey });
				const panel = await findByTestId('menu-panel');
				const items = getAllItems();
				await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[5].id));
			});

			it.skip(`Should open and select the first non-disabled item upon pressing ctrl + ${previousKey}`, async () => {
				const { button, findByTestId, getAllItems } = initComponent(Component, { horizontal });
				await fireEvent.keyDown(button, { code: previousKey, ctrlKey: true });
				const panel = await findByTestId('menu-panel');
				const items = getAllItems();
				await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[1].id));
			});
		});

		const Component = DisabledNavigation;
		it.skip('Should open and select the first non-disabled Item upon pressing Enter', async () => {
			const { button, findByTestId, getAllItems } = initComponent(Component);
			await fireEvent.keyDown(button, { code: 'Enter' });
			const panel = await findByTestId('menu-panel');
			const items = getAllItems();
			await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[1].id));
		});

		it.skip('Should open and select the first Item upon pressing Space', async () => {
			const { button, findByTestId, getAllItems } = initComponent(Component);
			await fireEvent.keyDown(button, { code: 'Space' });
			const panel = await findByTestId('menu-panel');
			const items = getAllItems();
			await waitFor(() => expect(panel).toHaveAttribute('aria-activedescendant', items[1].id));
		});
	});

	describe.skip('Panel', () => {
		it.skip('Should close by clicking outside', async () => {
			const { getByText, open } = initComponent(Behaviour);
			const panel = await open();
			const element = getByText('External');
			await fireEvent.click(element);
			expect(panel).not.toBeInTheDocument();
		});

		it.skip('Should close by pressing Escape', async () => {
			const { container, open } = initComponent(Behaviour);
			const panel = await open();
			await fireEvent.keyDown(container, { code: 'Escape' });
			expect(panel).not.toBeInTheDocument();
		});

		it.skip('Should close by focusing an element outside', async () => {
			const { getByText, open } = initComponent(Behaviour);
			const panel = await open();
			const element = getByText('External');
			await act(() => element.focus());
			expect(panel).not.toBeInTheDocument();
		});

		it.skip('Should be focused upon opening', async () => {
			const { open } = initComponent(Behaviour);
			const panel = await open();
			expect(panel).toHaveFocus();
		});
	});

	describe.skip('Item', () => {
		describe.skip.each(['Action Component', 'Component'])('%s', (mode) => {
			const target = mode === 'Action Component' ? 'ACTION' : 'COMPONENT';
			it.skip('Should close the Panel upon click', async () => {
				const { button, open } = initItem({ target });
				const item = await open();

				await fireEvent.click(item);
				expect(item).not.toBeInTheDocument();
				expect(button.ariaExpanded).toBe('false');
			});

			it.skip('Should not close the Panel upon click if the Item is disabled', async () => {
				const { button, open } = initItem({ disabled: true, target });
				const item = await open();

				await fireEvent.click(item);
				expect(item).toBeInTheDocument();
				expect(button.ariaExpanded).toBe('true');
			});
		});
	});

	describe.skip('Attributes', () => {
		describe.skip('Button', () => {
			describe.skip('aria-controls', () => {
				it.skip('Should not be set by default', () => {
					const { button } = initComponent(Behaviour);
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it.skip('Should point to the Panel id', async () => {
					const { button, open } = initComponent(Behaviour);
					const panel = await open();
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
					expect(button.ariaExpanded).toBe('false');

					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');

					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				});
			});

			describe.skip('aria-hasPopup', async () => {
				it.skip('Should have be set to true', () => {
					const { button } = initComponent(Behaviour);
					expect(button.ariaHasPopup).toBe('true');
				});
			});
		});

		describe.skip('Panel', () => {
			describe.skip('aria-activedescendant', () => {
				it.skip('Should not be set if Panel was opened by a Button click', async () => {
					const { open } = initComponent(Behaviour);
					const panel = await open();
					expect(panel).not.toHaveAttribute('aria-activedescendant');
				});
			});

			describe.skip('aria-labelledby', () => {
				it.skip('Should point to the Button id', async () => {
					const { button, open } = initComponent(Behaviour);
					const panel = await open();
					expect(panel).toHaveAttribute('aria-labelledby', button.id);
				});
			});

			describe.skip('aria-orientation', () => {
				it.skip('Should be vertical by default', async () => {
					const { open } = initComponent(Behaviour);
					const panel = await open();
					expect(panel.ariaOrientation).toBe('vertical');
				});

				it.skip('Should be horizontal when horizontal mode is set', async () => {
					const { open } = initComponent(Behaviour, { horizontal: true });
					const panel = await open();
					expect(panel.ariaOrientation).toBe('horizontal');
				});

				it.skip('Should be reactive', async () => {
					const { component, open } = initComponent(Behaviour);
					const panel = await open();
					expect(panel.ariaOrientation).toBe('vertical');

					await act(() => component.$set({ horizontal: true }));
					expect(panel.ariaOrientation).toBe('horizontal');

					await act(() => component.$set({ horizontal: false }));
					expect(panel.ariaOrientation).toBe('vertical');
				});
			});

			describe.skip('role', () => {
				it.skip('Should be set to menu', async () => {
					const { open } = initComponent(Behaviour);
					const panel = await open();
					expect(panel).toHaveAttribute('role', 'menu');
				});
			});
		});

		describe.skip('Item', () => {
			it.skip('Should have role set to menuitem', async () => {
				const { open, getAllItems } = initComponent(Behaviour);
				await open();
				for (const item of getAllItems()) {
					expect(item).toHaveAttribute('role', 'menuitem');
				}
			});

			it.skip('Should have tabIndex set to -1', async () => {
				const { open, getAllItems } = initComponent(Behaviour);
				await open();
				for (const item of getAllItems()) {
					expect(item).toHaveAttribute('tabIndex', '-1');
				}
			});
		});
	});

	describe.skip('Navigation', () => {
		const Navigation = DisabledNavigation;

		describe.skip.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';

			it.skip(`Should move to the next Item by pressing ${nextKey}`, async () => {
				const { getAllItems, open } = initComponent(Behaviour, { horizontal });
				const panel = await open();
				const items = getAllItems();

				await waitAWhile(25);

				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			});

			it.skip(`Should move to the previous Item by pressing ${previousKey}`, async () => {
				const { getAllItems, open } = initComponent(Behaviour, { horizontal });
				const panel = await open();
				const items = getAllItems();

				await waitAWhile(25);

				await fireEvent.keyDown(panel, { code: 'End' });
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			});

			it.skip(`Should skip disabled Items ${previousKey}`, async () => {
				const { getAllItems, open } = initComponent(Navigation, { horizontal });
				const panel = await open();
				const items = getAllItems();

				await waitAWhile(25);

				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[4].id);

				await fireEvent.keyDown(panel, { code: 'End' });
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[4].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			});
		});

		const { KeyMatch } = samples;
		describe.skip('Keyboard KeyMatch', () => {
			it.skip('Should select the Item that matches the key letter', async () => {
				const { getByText, open } = initComponent(KeyMatch);
				const panel = await open();

				await waitAWhile(25);

				await fireEvent.keyDown(panel, { code: 'B' });
				await fireEvent.keyUp(panel);
				const item = getByText('B Item');
				expect(panel).toHaveAttribute('aria-activedescendant', item.id);
			});
		});
	});

	const { ActionComponent, SlotComponent } = samples;
	it.each([
		['Action Component', ActionComponent],
		['Slot Component', SlotComponent]
	])('Should work rendered as an %s', async (name, Component) => {
		const finite = writable(false);
		const horizontal = writable(false);

		const { button, getAllItems, getPanel } = initComponent(Component, { finite, horizontal });
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');

		await fireEvent.click(button);

		const panel = getPanel();
		expect(panel).not.toHaveAttribute('aria-activedescendant');
		expect(panel).toHaveAttribute('aria-labelledby', button.id);
		expect(panel).toHaveAttribute('role', 'menu');
		expect(panel.ariaOrientation).toBe('vertical');

		expect(button.ariaExpanded).toBe('true');
		expect(button).toHaveAttribute('aria-controls', panel.id);

		const items = getAllItems();
		for (const item of items) {
			expect(item).toHaveAttribute('role', 'menuitem');
			expect(item).toHaveAttribute('tabIndex', '-1');
		}

		await waitAWhile(25);

		await fireEvent.keyDown(panel, { code: 'Home' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

		await fireEvent.keyDown(panel, { code: 'ArrowDown' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);

		await fireEvent.keyDown(panel, { code: 'ArrowUp' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

		await fireEvent.keyDown(panel, { code: 'ArrowUp' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[3].id);

		await act(() => finite.set(true));

		await fireEvent.keyDown(panel, { code: 'Home' });
		await fireEvent.keyDown(panel, { code: 'ArrowUp' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

		await act(() => horizontal.set(true));

		await fireEvent.keyDown(panel, { code: 'Home' });
		await fireEvent.keyDown(panel, { code: 'ArrowRight' });
		expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);

		await fireEvent.keyDown(window, { code: 'Escape' });
		expect(panel).not.toBeInTheDocument();
		expect(button.ariaExpanded).toBe('false');
		expect(button).not.toHaveAttribute('aria-controls');
	});
});

describe.skip('Events', () => {
	describe.skip('Item', () => {
		describe.skip('Click', () => {
			it.skip('Should be able of forwarding a click listener', async () => {
				const handleClick = vi.fn<[MouseEvent]>(() => {});
				const { open } = initItem({ handleClick });
				const item = await open();

				await fireEvent.click(item);
				expect(handleClick).toBeCalled();
				expect(handleClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
			});

			it.skip('Should not be called if the Item is disabled', async () => {
				const handleClick = vi.fn<[MouseEvent]>(() => {});
				const { open } = initItem({ disabled: true, handleClick });
				const item = await open();

				await fireEvent.click(item);
				expect(handleClick).not.toBeCalled();
			});
		});
	});
});

describe.skip('Props', () => {
	describe.skip('Finite', () => {
		it.each([
			['Vertical', 'ArrowDown', 'ArrowUp'],
			['Horizontal', 'ArrowRight', 'ArrowLeft']
		])(
			'Should prevent returning to the first/last Item after hitting an edge - %s',
			async (orientation, nextKey, previousKey) => {
				const horizontal = orientation === 'Horizontal';
				const { getAllItems, open } = initComponent(Behaviour, { finite: true, horizontal });
				const panel = await open();
				const items = getAllItems();

				await waitAWhile(25);

				await fireEvent.keyDown(panel, { code: 'End' });
				expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);

				await fireEvent.keyDown(panel, { code: 'Home' });
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			}
		);

		it.each([
			['Vertical', 'ArrowDown', 'ArrowUp'],
			['Horizontal', 'ArrowRight', 'ArrowLeft']
		])('Should be set to false by default - %s', async (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';
			const { getAllItems, open } = initComponent(Behaviour, { horizontal });
			const panel = await open();
			const items = getAllItems();

			await waitAWhile(25);

			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);
			await fireEvent.keyDown(panel, { code: nextKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: previousKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);
		});

		it.each([
			['Vertical', 'ArrowDown', 'ArrowUp'],
			['Horizontal', 'ArrowRight', 'ArrowLeft']
		])('Should be reactive - %s', async (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';
			const { component, getAllItems, open } = initComponent(Behaviour, {
				finite: true,
				horizontal
			});
			const panel = await open();
			const items = getAllItems();

			await waitAWhile(25);

			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);
			await fireEvent.keyDown(panel, { code: nextKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);

			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: previousKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await act(() => component.$set({ finite: false }));
			await fireEvent.keyDown(panel, { code: previousKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);

			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', items.at(-1)?.id);
			await fireEvent.keyDown(panel, { code: nextKey });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
		});

	describe.skip('Horizontal', () => {
		it.skip('Should only allow to Navigate with ArrowRight - ArrowLeft', async () => {
			const { open, getAllItems } = initComponent(Behaviour, { horizontal: true });
			const panel = await open();
			const items = getAllItems();

			await waitAWhile(25);

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).not.toHaveAttribute('aria-activedescendant');

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);

			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
		});

		it.skip('Should be set to false by default', async () => {
			const { open, getAllItems } = initComponent(Behaviour);
			const panel = await open();
			const items = getAllItems();

			await waitAWhile(25);

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).not.toHaveAttribute('aria-activedescendant');

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);

			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
		});

		it.skip('Should be reactive', async () => {
			const { component, open, getAllItems } = initComponent(Behaviour);
			const panel = await open();
			const items = getAllItems();

			await waitAWhile(25);

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).not.toHaveAttribute('aria-activedescendant');

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await act(() => component.$set({ horizontal: true }));

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
		});
	});
});

describe.skip('Rendering', () => {
	it.skip('Should be rendered as a slot by default', () => {
		const { getByTestId } = render(Menu, { props: { 'data-testid': 'menu-root' } });
		expect(() => getByTestId('menu-root')).toThrow();
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(Menu, { props: { as, 'data-testid': 'menu-root' } });
		const group = getByTestId('menu-root');
		expect(hasTagName(group, as)).toBe(true);
	});

	it.skip('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'a menu root' };
		const { getByTestId } = render(Menu, {
			props: {
				...attributes,
				as: 'div',
				'data-testid': 'menu-root'
			}
		});
		const group = getByTestId('menu-root');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it.skip('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(Menu, {
			props: { use: actions, as: 'div', 'data-testid': 'menu-root' }
		});
		const group = getByTestId('menu-root');
		for (const [action, parameter] of actions) {
			expect(action).toBeCalledWith(group, parameter);
		}
	});

	const { Rendering } = samples;
	describe.skip.each([
		['Button', 'button'],
		['Items', 'ul'],
		['Item', 'li']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = `menu-${lowerCaseComponent}`;

		async function open(getByTestId: (matcher: string) => HTMLElement) {
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
		}

		it.skip(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering);

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it.skip(`Should have a valid ${lowerCaseComponent} menu id`, async () => {
			const { getByTestId } = render(Rendering);

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'menu', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it.skip('Should be able of forwarding attributes', async () => {
			const attributes = { tabIndex: '4', title: `a menu ${lowerCaseComponent}` };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it.skip('Should be able of forwarding actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { use: actions }
				}
			});

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});
});

describe.skip('Slot Props', () => {
	describe.skip('isOpen', () => {
		it.each(['global', 'button'])(
			'Should expose the current open state from the %s scope',
			async (scope) => {
				const { open, getByTestId } = initComponent(Behaviour);
				const holder = getByTestId(`${scope}-isOpen`);
				expect(holder).toHaveTextContent('false');

				await open();
				expect(holder).toHaveTextContent('true');
			}
		);

		it.each(['global', 'button'])('Should be reactive', async (scope) => {
			const { button, getByTestId } = initComponent(Behaviour);
			const holder = getByTestId(`${scope}-isOpen`);
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('false');
		});
	});

	describe.skip('isSelected', () => {
		function isUniqueSelectedItem(items: HTMLElement[]) {
			const hash = new Map<HTMLElement, number>();

			for (const item of items) {
				if (hash.has(item)) return false;
				if (item.textContent === 'true') hash.set(item, hash.size);
			}

			return true;
		}

		it.skip('Should expose the current Item selected state', async () => {
			const { getAllByTestId, open } = initComponent(Behaviour);
			const panel = await open();
			const items = getAllByTestId('isSelected-holder');

			await waitAWhile(25);

			for (const item of items) expect(item).toHaveTextContent('false');

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(items[0]).toHaveTextContent('true');
			expect(isUniqueSelectedItem(items)).toBe(true);

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(items[1]).toHaveTextContent('true');
			expect(isUniqueSelectedItem(items)).toBe(true);

			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(items[2]).toHaveTextContent('true');
			expect(isUniqueSelectedItem(items)).toBe(true);

			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(items[0]).toHaveTextContent('true');
			expect(isUniqueSelectedItem(items)).toBe(true);
		});
	});
});

describe.skip('Context', () => {
	interface ContextKeys {
		Open: any;
		button: any;
		items: any;
		initItem: any;
		close: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'menu');

	describe.skip('Unset Context', () => {
		describe.skip.each([
			['Button', MenuButton],
			['Items', MenuItems]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered without a Menu Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe.skip('Invalid Context', () => {
		describe.skip.each([
			['Button', MenuButton],
			['Items', MenuItems]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered with an invalid Menu Context', () => {
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
						items: null,
						initItem: null,
						close: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init.skip(Component, {
						Open: { subscribe: 96 },
						button: { Proxy: new Bridge(), action: () => null },
						items: null,
						initItem: 'hey',
						close: () => null
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
