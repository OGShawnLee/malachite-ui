import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib/components';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });

	const tabList = result.getByTestId('tablist');
	const tabs = result.getAllByText(/Tab/);
	const tabPanels = result.getByTestId('tabpanels');
	const panel = getPanel();

	function getPanel() {
		return result.getByText(/Panel/);
	}

	function getTabPair(index: number) {
		const tab = result.getByText(`Tab ${index}`);
		const panel = result.getByText(`Panel ${index}`);
		return { tab, panel };
	}

	return { ...result, tabList, tabPanels, tabs, panel, getPanel, getTabPair };
}

const { Behaviour, Disabled } = samples;
describe.skip('Behaviour', () => {
	it.skip('Should select the first tab by default', () => {
		const { panel, tabs } = initComponent(Behaviour);
		expect(panel).toHaveTextContent('Panel 1');
		expect(tabs[0].ariaSelected).toBe('true');
	});

	const { ActionDisabled } = samples;
	it.skip('Should not select the first tab by default if it is disabled and rendered as an Action Component', async () => {
		const { findAllByText } = render(ActionDisabled);
		const tabs = await findAllByText(/Tab/);
		expect(tabs[0].ariaSelected).toBe('false');
		expect(tabs[1].ariaSelected).toBe('true');
		const panels = await findAllByText(/Panel/);
		expect(panels[0]).toHaveTextContent('Panel 2');
	});

	it.skip('Should not select the given tab if it is disabled and rendered as an Action Component', async () => {
		const { findAllByText } = render(ActionDisabled, { props: { index: 2 } });
		const tabs = await findAllByText(/Tab/);
		expect(tabs[2].ariaSelected).toBe('false');
		expect(tabs[3].ariaSelected).toBe('true');
		const panels = await findAllByText(/Panel/);
		expect(panels[0]).toHaveTextContent('Panel 4');
	});

	describe.skip('Tab', () => {
		it.skip('Should select the current tab upon click', async () => {
			const { tabs } = initComponent(Behaviour);
			await fireEvent.click(tabs[1]);
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.click(tabs[2]);
			expect(tabs[2].ariaSelected).toBe('true');

			await fireEvent.click(tabs[0]);
			expect(tabs[0].ariaSelected).toBe('true');
		});

		it.skip('Should not select a disabled tab upon clicking it', async () => {
			const { tabs } = initComponent(Behaviour, { disabled: true });
			await fireEvent.click(tabs[1]);
			expect(tabs[1]).toBeDisabled();
			expect(tabs[1].ariaSelected).toBe('false');
		});

		it.skip('Should select the next valid tab upon being disabled', async () => {
			const { component, tabs } = initComponent(Behaviour, { index: 1 });
			expect(tabs[1].ariaSelected).toBe('true');

			await act(() => component.$set({ disabled: true }));
			expect(tabs[1]).toBeDisabled();
			expect(tabs[1].ariaSelected).toBe('false');
			expect(tabs[2].ariaSelected).toBe('true');
		});

		it.skip('Should search the previous valid tab if no next valid tab exists', async () => {
			const { component, tabs } = initComponent(Disabled, { index: 6 });
			expect(tabs[6].ariaSelected).toBe('true');

			await act(() => component.$set({ disabledEdges: true }));
			expect(tabs[5].ariaSelected).toBe('true');
		});
	});

	it.skip('Should only render one TabPanel at once', async () => {
		const { getAllByText, getByText, tabs } = initComponent(Behaviour);
		let panels = getAllByText(/Panel/);
		let currentPanel = getByText('Panel 1');
		expect(panels).toHaveLength(1);

		await fireEvent.click(tabs[1]);
		panels = getAllByText(/Panel/);
		currentPanel = getByText('Panel 2');
		expect(panels).toHaveLength(1);

		await fireEvent.click(tabs[2]);
		panels = getAllByText(/Panel/);
		currentPanel = getByText('Panel 3');
		expect(panels).toHaveLength(1);
		expect(currentPanel).toBeInTheDocument();
	});

	describe.skip('Navigation', () => {
		it.skip('Should be automatic by default', async () => {
			const { getPanel, tabs, tabList } = initComponent(Behaviour);

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			const panel = getPanel();
			expect(tabs[1].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 2');
		});

		it.skip('Should be horizontal by default', async () => {
			const { tabs, tabList } = initComponent(Behaviour);
			expect(tabList.ariaOrientation).toBe('horizontal');
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');
		});

		describe.skip.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (mode, nextKey, previousKey) => {
			const vertical = mode === 'Vertical';

			it.skip(`Should move to the next tab by pressing ${nextKey}`, async () => {
				const { tabs, tabList } = initComponent(Behaviour, { vertical });
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: nextKey });
				expect(tabs[1].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: nextKey });
				expect(tabs[2].ariaSelected).toBe('true');
			});

			it.skip(`Should move to the previous tab by pressing ${previousKey}`, async () => {
				const { tabs, tabList } = initComponent(Behaviour, { index: 2, vertical });
				expect(tabs[2].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: previousKey });
				expect(tabs[1].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: previousKey });
				expect(tabs[0].ariaSelected).toBe('true');
			});

			it.skip(`Should move to the last tab upon pressing End or ctrlKey + ${nextKey}`, async () => {
				const { tabs, tabList } = initComponent(Behaviour, { vertical });
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: nextKey, ctrlKey: true });
				expect(tabs[2].ariaSelected).toBe('true');

				await fireEvent.click(tabs[0]);
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: 'End' });
				expect(tabs[2].ariaSelected).toBe('true');
			});

			it.skip(`Should move to the first tab upon pressing Home or ctrlKey + ${previousKey} `, async () => {
				const { tabs, tabList } = initComponent(Behaviour, { index: 2, vertical });
				expect(tabs[2].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: previousKey, ctrlKey: true });
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.click(tabs[2]);
				expect(tabs[2].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: 'Home' });
				expect(tabs[0].ariaSelected).toBe('true');
			});

			it.skip('Should work in manual mode', async () => {
				const { panel, tabs, tabList } = initComponent(Behaviour, { manual: true });

				await fireEvent.keyDown(tabList, { code: nextKey });
				expect(panel).toBeInTheDocument();
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: nextKey });
				expect(panel).toBeInTheDocument();
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: previousKey });
				expect(panel).toBeInTheDocument();
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: previousKey });
				expect(panel).toBeInTheDocument();
				expect(tabs[0].ariaSelected).toBe('true');
			});

			it.skip('Should be infinite', async () => {
				const { tabList, tabs } = initComponent(Behaviour, { vertical });
				await fireEvent.keyDown(tabList, { code: previousKey });
				expect(tabs[2].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: nextKey });
				expect(tabs[0].ariaSelected).toBe('true');
			});

			describe.skip('Disabled Tabs', () => {
				it.skip('Should skip disabled tabs', async () => {
					const { getByText, tabList } = initComponent(Disabled, { index: 1, vertical });
					await fireEvent.keyDown(tabList, { code: nextKey });
					let tab = getByText('Tab 6');
					expect(tab.ariaSelected).toBe('true');

					await fireEvent.keyDown(tabList, { code: previousKey });
					tab = getByText('Tab 2');
					expect(tab.ariaSelected).toBe('true');
				});

				it.skip('Should skip the edges and be infinite', async () => {
					const { findByText, findByTestId } = render(Disabled, {
						props: { disabledEdges: true }
					});
					const tabList = await findByTestId('tablist');

					await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
					const tab = await findByText('Tab 6');
					expect(tab.ariaSelected).toBe('true');
				});
			});
		});

		describe.skip('Manual Sync', () => {
			it.skip('Should return the manual active tab to the selected one after focusing it', async () => {
				const { tabList, tabs } = initComponent(Behaviour, { manual: true });
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: 'End' });
				expect(tabs[2]).toHaveFocus();

				await act(() => tabs[0].focus());
				expect(tabs[0]).toHaveFocus();

				await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
				expect(tabs[0].ariaSelected).toBe('true');
				expect(tabs[1]).toHaveFocus();
			});

			it.skip('Should return the manual active tab to the selected one after the tabList loses focus', async () => {
				const { getByText, tabList, tabs } = initComponent(Behaviour, { manual: true });
				expect(tabs[0].ariaSelected).toBe('true');

				await fireEvent.keyDown(tabList, { code: 'End' });
				expect(tabs[0].ariaSelected).toBe('true');
				expect(tabs[2]).toHaveFocus();

				const external = getByText('External');
				await act(() => external.focus());

				await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
				expect(tabs[0].ariaSelected).toBe('true');
				expect(tabs[0]).toHaveFocus();

				await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
				expect(tabs[0].ariaSelected).toBe('true');
				expect(tabs[1]).toHaveFocus();
			});
		});
	});

	describe.skip('attributes', () => {
		describe.skip('TabList', () => {
			describe.skip('aria-orientation', () => {
				it.skip('Should be horizontal by default', () => {
					const { tabList } = initComponent(Behaviour);
					expect(tabList.ariaOrientation).toBe('horizontal');
				});

				it.skip('Should be reactive', async () => {
					const { component, tabList } = initComponent(Behaviour);
					expect(tabList.ariaOrientation).toBe('horizontal');

					await act(() => component.$set({ vertical: true }));
					expect(tabList.ariaOrientation).toBe('vertical');

					await act(() => component.$set({ vertical: false }));
					expect(tabList.ariaOrientation).toBe('horizontal');
				});
			});

			describe.skip('role', () => {
				it.skip('Should be set to "tablist"', () => {
					const { tabList } = initComponent(Behaviour);
					expect(tabList).toHaveAttribute('role', 'tablist');
				});
			});
		});

		describe.skip('Tab', () => {
			describe.skip('aria-selected', () => {
				it.skip('Should be set on every tab', () => {
					const { tabs } = initComponent(Behaviour);
					expect(tabs).toHaveLength(3);
					for (const tab of tabs) {
						expect(tab.ariaSelected).toBeDefined();
					}
				});

				it.skip('Should only be set to true on the current selected tab', async () => {
					const { tabs, tabList } = initComponent(Behaviour);
					expect(tabs[0].ariaSelected).toBe('true');
					for (const tab of tabs.slice(1)) expect(tab.ariaSelected).toBe('false');

					await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
					expect(tabs[0].ariaSelected).toBe('false');
					expect(tabs[1].ariaSelected).toBe('true');
					expect(tabs[2].ariaSelected).toBe('false');
				});
			});

			describe.skip('aria-controls', () => {
				it.skip('Should only be set on the selected tab', async () => {
					const { tabs } = initComponent(Behaviour, { index: 1 });
					expect(tabs[1]).toHaveAttribute('aria-controls');

					await fireEvent.click(tabs[0]);
					expect(tabs[0]).toHaveAttribute('aria-controls');

					await fireEvent.click(tabs[2]);
					expect(tabs[2]).toHaveAttribute('aria-controls');
				});

				it.skip('Should point to the associated tabPanel id', async () => {
					const { getPanel, tabs } = initComponent(Behaviour, { index: 1 });
					let panel = getPanel();
					expect(tabs[1]).toHaveAttribute('aria-controls', panel.id);

					await fireEvent.click(tabs[0]);
					panel = getPanel();
					expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);

					await fireEvent.click(tabs[2]);
					panel = getPanel();
					expect(tabs[2]).toHaveAttribute('aria-controls', panel.id);
				});
			});

			describe.skip('role', () => {
				it.skip('Should be set to "tab"', () => {
					const { tabs } = initComponent(Behaviour);
					expect(tabs).toHaveLength(3);
					for (const tab of tabs) {
						expect(tab).toHaveAttribute('role', 'tab');
					}
				});
			});

			describe.skip('tabIndex', () => {
				it.skip('Should be 0 for the selected tab', async () => {
					const { tabs } = initComponent(Behaviour);
					expect(tabs[0]).toHaveAttribute('tabIndex', '0');

					await fireEvent.click(tabs[1]);
					expect(tabs[1]).toHaveAttribute('tabIndex', '0');

					await fireEvent.click(tabs[2]);
					expect(tabs[2]).toHaveAttribute('tabIndex', '0');
				});

				it.skip('Should be -1 for the unselected tabs', async () => {
					const { tabs } = initComponent(Behaviour);
					expect(tabs[0]).toHaveAttribute('tabIndex', '0');

					await fireEvent.click(tabs[1]);
					expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
					expect(tabs[1]).toHaveAttribute('tabIndex', '0');
					expect(tabs[2]).toHaveAttribute('tabIndex', '-1');

					await fireEvent.click(tabs[2]);
					expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
					expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
					expect(tabs[2]).toHaveAttribute('tabIndex', '0');
				});
			});
		});

		describe.skip('Panel', () => {
			describe.skip('aria-labelledby', () => {
				it.skip('Should point to the associated tab id', () => {
					const { getByText } = render(Behaviour);
					const panel = getByText('Panel 1');
					const tab = getByText('Tab 1');
					expect(panel).toHaveAttribute('aria-labelledby', tab.id);
				});
			});

			describe.skip('role', () => {
				it.skip('Should be set to "tabpanel"', () => {
					const { getByText } = render(Behaviour);
					const panel = getByText('Panel 1');
					expect(panel).toHaveAttribute('role', 'tabpanel');
				});
			});

			describe.skip('tabIndex', () => {
				it.skip('Should be set to 0', () => {
					const { panel } = initComponent(Behaviour);
					expect(panel).toHaveAttribute('tabIndex', '0');
				});
			});
		});
	});
});

describe.skip('Props', () => {
	const { Index } = samples;
	describe.skip('index', () => {
		it.skip('Should determine the initial selected tab', () => {
			const { getByText } = render(Index, { props: { index: 2 } });
			const tab = getByText('Tab 3');
			expect(tab.ariaSelected).toBe('true');
		});

		describe.skip('Invalid Index', () => {
			it.skip('Should automatically select the first tab if index is less than 0', async () => {
				const { findAllByText, findByText } = render(Index, { props: { index: -360 } });

				const tabs = await findAllByText(/Tab/);
				const panel = await findByText('Panel 1');

				expect(tabs[0].ariaSelected).toBe('true');
				expect(panel).toBeInTheDocument();
			});

			it.skip('Should automatically select the first non disabled tab if index is less than 0', async () => {
				const { findByText } = render(Index, { props: { disabled: true, index: -360 } });
				const invalidTab = await findByText('Tab 1');
				expect(invalidTab.ariaSelected).toBe('false');

				const validTab = await findByText('Tab 2');
				expect(validTab.ariaSelected).toBe('true');
			});

			it.skip('Should automatically select the last tab if index is overflowed', async () => {
				const { findByText } = render(Index, { props: { index: 360 } });
				const tab = await findByText('Tab 5');
				expect(tab.ariaSelected).toBe('true');
			});

			it.skip('Should automatically select the last non disabled tab if index is overflowed', async () => {
				const { findByText } = render(Index, { props: { disabled: true, index: 360 } });
				const invalidTab = await findByText('Tab 5');
				expect(invalidTab.ariaSelected).toBe('false');

				const validTab = await findByText('Tab 4');
				expect(validTab.ariaSelected).toBe('true');
			});

			it.skip('Should select the next non disabled tab if the index is associated with a disabled tab', async () => {
				const { findByText } = render(Index, { props: { disabled: true, index: 2 } });
				const invalidTab = await findByText('Tab 3');
				expect(invalidTab.ariaSelected).toBe('false');

				const validTab = await findByText('Tab 4');
				expect(validTab.ariaSelected).toBe('true');
			});
		});
	});

	describe.skip('Manual', () => {
		it.skip('Should make the navigation only focus the current active tab and not show its panel', async () => {
			const { panel, tabs, tabList } = initComponent(Behaviour, { manual: true });

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(panel).toBeInTheDocument();
			expect(tabs[1]).toHaveFocus();

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(panel).toBeInTheDocument();
			expect(tabs[2]).toHaveFocus();

			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(panel).toBeInTheDocument();
			expect(tabs[1]).toHaveFocus();

			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(panel).toBeInTheDocument();
			expect(tabs[0]).toHaveFocus();
		});

		it.skip('Should prevent changing the current selected tab', async () => {
			const { tabs, tabList } = initComponent(Behaviour, { manual: true });

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(tabs[0].ariaSelected).toBe('true');
		});

		it.skip('Should be false by default', async () => {
			const { tabs, tabList } = initComponent(Behaviour);

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');
		});

		it.skip('Should be reactive', async () => {
			const { component, tabs, tabList } = initComponent(Behaviour, { manual: false });

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');

			await act(() => component.$set({ manual: true }));

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');
		});
	});

	describe.skip('Vertical', () => {
		it.skip('Should make the navigation only work with the ArrowUp and ArrowDown keys', async () => {
			const { tabList, tabs } = initComponent(Behaviour, { vertical: true });
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[2].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowUp' });
			expect(tabs[1].ariaSelected).toBe('true');
		});

		it.skip('Should be false by default', async () => {
			const { tabList, tabs } = initComponent(Behaviour);
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');
		});

		it.skip('Should be reactive', async () => {
			const { component, tabList, tabs } = initComponent(Behaviour);
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[2].ariaSelected).toBe('true');

			await act(() => component.$set({ vertical: true }));

			await fireEvent.keyDown(tabList, { code: 'ArrowUp' });
			expect(tabs[1].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowUp' });
			expect(tabs[0].ariaSelected).toBe('true');

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[1].ariaSelected).toBe('true');
		});
	});
});

describe.skip('Rendering', () => {
	it.skip('Should be rendered as a div by default', () => {
		const { getByTestId } = render(TabGroup, { props: { 'data-testid': 'tab-group' } });
		const group = getByTestId('tab-group');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(TabGroup, { props: { as, 'data-testid': 'tab-group' } });
		const group = getByTestId('tab-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it.skip('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'a switch root' };
		const { getByTestId } = render(TabGroup, {
			props: {
				...attributes,
				'data-testid': 'tab-group'
			}
		});
		const group = getByTestId('tab-group');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it.skip('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(TabGroup, {
			props: { use: actions, 'data-testid': 'tab-group' }
		});
		const group = getByTestId('tab-group');
		for (const [action, parameter] of actions) {
			expect(action).toBeCalledWith(group, parameter);
		}
	});

	const { Rendering } = samples;
	describe.skip.each([
		['TabList', 'div'],
		['Tab', 'button'],
		['TabPanels', 'div'],
		['Panel', 'div']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = lowerCaseComponent;

		it.skip(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it.skip(`Should have a valid ${lowerCaseComponent} tab id`, async () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(isValidComponentName(element, 'tab', lowerCaseComponent.replace('tab', ''))).toBe(
				true
			);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it.skip('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: `a tab ${lowerCaseComponent}` };
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

		it.skip('Should be able to forward actions', async () => {
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

const { ActionComponent, IsSelected } = samples;
describe.skip('Slot Props', () => {
	describe.skip('TabGroup', () => {
		it.skip('Should expose the tabList action', async () => {
			const { component, tabList, tabs } = initComponent(ActionComponent);
			expect(tabList).toHaveAttribute('role', 'tablist');
			expect(tabList.ariaOrientation).toBe('horizontal');
			expect(isValidComponentName(tabList, 'tabs', 'list')).toBe(true);

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await act(() => component.$set({ vertical: true }));
			expect(tabList.ariaOrientation).toBe('vertical');

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[2].ariaSelected).toBe('true');
		});

		it.skip('Should expose the tabPanels action', () => {
			const { tabPanels } = initComponent(ActionComponent);
			expect(isValidComponentName(tabPanels, 'tabs', 'panels')).toBe(true);
		});
	});

	describe.skip('TabList', () => {
		it.skip('Should expose the tabList action', async () => {
			const { component, tabList, tabs } = initComponent(IsSelected);
			expect(tabList).toHaveAttribute('role', 'tablist');
			expect(tabList.ariaOrientation).toBe('horizontal');
			expect(isValidComponentName(tabList, 'tabs', 'list')).toBe(true);

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[1].ariaSelected).toBe('true');

			await act(() => component.$set({ vertical: true }));
			expect(tabList.ariaOrientation).toBe('vertical');

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[2].ariaSelected).toBe('true');
		});
	});

	describe.skip('TabPanels', () => {
		it.skip('Should expose the tabPanels action', () => {
			const { tabPanels } = initComponent(IsSelected);
			expect(isValidComponentName(tabPanels, 'tabs', 'panels')).toBe(true);
		});
	});

	describe.skip('Tab', () => {
		it.skip('Should expose the tab action', async () => {
			const { tabs, getPanel } = initComponent(IsSelected);
			for (const tab of tabs) {
				expect(tab.ariaSelected).toBeDefined();
				expect(isValidComponentName(tab, 'tabs', 'tab'));

				await fireEvent.click(tab);
				const panel = getPanel();
				expect(tab.ariaSelected).toBe('true');
				expect(tab).toHaveAttribute('aria-controls', panel.id);
				expect(panel).toHaveAttribute('aria-labelledby', tab.id);
			}
		});

		describe.skip('isSelected', () => {
			it.skip('Should expose the current selected state', async () => {
				const { tabs } = initComponent(IsSelected);
				expect(tabs[0].previousElementSibling).toHaveTextContent('true');

				await fireEvent.click(tabs[1]);
				expect(tabs[0].previousElementSibling).toHaveTextContent('false');
				expect(tabs[1].previousElementSibling).toHaveTextContent('true');

				await fireEvent.click(tabs[2]);
				expect(tabs[1].previousElementSibling).toHaveTextContent('false');
				expect(tabs[2].previousElementSibling).toHaveTextContent('true');
			});
		});
	});

	describe.skip('Panel', () => {
		it.skip('Should expose the panel action', async () => {
			const { panel, tabs } = initComponent(IsSelected);
			expect(panel).toHaveTextContent('Panel 1');
			expect(panel).toHaveAttribute('aria-labelledby', tabs[0].id);
			expect(isValidComponentName(panel, 'tabs', 'panel')).toBe(true);
		});
	});
});

describe.skip('Context', () => {
	interface ContextKeys {
		Index: any;
		initPanel: any;
		initTab: any;
		tabList: any;
		tabPanels: any;
	}

	const [init, message] = createContextParentRenderer<ContextKeys>(ContextParent, 'tabs');

	describe.skip('Unset Context', () => {
		describe.skip.each([
			['List', TabList],
			['Tab', Tab],
			['Panels', TabPanels],
			['Panel', TabPanel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered without a Tabs Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it.skip('Should throw a specific error', () => {
				expect(() => render(Component)).toThrow(message.unset);
			});
		});
	});

	describe.skip('Invalid Context', () => {
		describe.skip.each([
			['List', TabList],
			['Tab', Tab],
			['Panels', TabPanels],
			['Panel', TabPanel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered with an invalid Tabs Context', () => {
				expect(() => init.skip(Component, null)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => init.skip(Component, null)).toThrow(message.invalid);
			});

			it.skip('Should validate the context value thoroughly', () => {
				expect(() =>
					init.skip(Component, {
						Index: null,
						initPanel: null,
						initTab: null,
						tabList: null,
						tabPanels: null
					})
				).toThrow(message.invalid);
				expect(() =>
					init.skip(Component, {
						Index: { subscribe: () => 720 },
						initPanel: () => null,
						initTab: () => null,
						tabList: {},
						tabPanels: {}
					})
				).toThrow(message.invalid);
			});
		});
	});
});
