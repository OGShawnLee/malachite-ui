import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '$lib';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';

const cases = [samples.FragmentComponent, samples.Component];
describe('Behaviour', () => {
	describe('Attributes', () => {
		describe('Tab', () => {
			it.each(cases)("Should have role set to 'tab'", (Component) => {
				const { getAllByTestId } = render(Component);
				const tabs = getAllByTestId('tab');
				for (const tab of tabs) expect(tab.role).toBe('tab');
			});

			describe('aria-controls', () => {
				it.each(cases)('Should have aria-controls set to its panel id', (Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					const panel = getByTestId('tab-panel');
					expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);
				});

				it.each(cases)('Should be removed when another Tab is selected', async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const tabList = getByTestId('tab-list');
					const tabs = getAllByTestId('tab');
					const panel = getByTestId('tab-panel');
					expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);
					await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
					expect(tabs[0]).not.toHaveAttribute('aria-controls');
				});
			});

			describe('aria-selected', () => {
				it.each(cases)('Should be set', (Component) => {
					const { getAllByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					for (const tab of tabs) expect(tab.ariaSelected).toBeDefined();
				});

				it.each(cases)("Should be 'false' unless Tab is the default one", (Component) => {
					const { getAllByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					expect(tabs[0].ariaSelected).toBe('true');
					for (let index = 1; index < tabs.length; index++) {
						const tab = tabs[index];
						expect(tab.ariaSelected).toBe('false');
					}
				});

				it.each(cases)('Should be only one selected Tab at once', (Component) => {
					const { getAllByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					expect(tabs[0].ariaSelected).toBe('true');
					for (let index = 1; index < tabs.length; index++) {
						const tab = tabs[index];
						expect(tab.ariaSelected).toBe('false');
					}
				});
			});

			describe('tabIndex', () => {
				it.each(cases)('Should be set to -1 unless it is the selected one', async (Component) => {
					const { getAllByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					expect(tabs[0].tabIndex).toBe(0);
					for (let index = 1; index < tabs.length; index++) {
						const tab = tabs[index];
						expect(tab.tabIndex).toBe(-1);
					}
				});

				it.each(cases)('Should be 0 for the selected one', async (Component) => {
					const { getAllByTestId } = render(Component);
					const tabs = getAllByTestId('tab');
					expect(tabs[0].tabIndex).toBe(0);
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const tabList = getByTestId('tab-list');
					const tabs = getAllByTestId('tab');
					expect(tabs[0].tabIndex).toBe(0);
					await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
					expect(tabs[0].tabIndex).toBe(-1);
					expect(tabs[4].tabIndex).toBe(0);
					await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
					expect(tabs[4].tabIndex).toBe(-1);
					expect(tabs[0].tabIndex).toBe(0);
				});
			});
		});

		describe('TabList', () => {
			it.each(cases)("Should have role set to 'tablist'", (Component) => {
				const { getByTestId } = render(Component);
				const tabList = getByTestId('tab-list');
				expect(tabList.role).toBe('tablist');
			});

			describe('aria-orientation', () => {
				it.each(cases)("Should be set to 'horizontal' by default", (Component) => {
					const { getByTestId } = render(Component);
					const tabList = getByTestId('tab-list');
					expect(tabList.ariaOrientation).toBe('horizontal');
				});

				it.each(cases)("Should be set to 'vertical' when navigation is vertical", (Component) => {
					const { getByTestId } = render(Component, { props: { vertical: true } });
					const tabList = getByTestId('tab-list');
					expect(tabList.ariaOrientation).toBe('vertical');
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const { component, getByTestId } = render(Component, { props: { vertical: true } });
					const tabList = getByTestId('tab-list');
					expect(tabList.ariaOrientation).toBe('vertical');
					await act(() => component.$set({ vertical: false }));
					expect(tabList.ariaOrientation).toBe('horizontal');
				});
			});
		});

		describe('TabPanel', () => {
			it.each(cases)('Should have aria-labelledby set to the id of its Tab', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const tabs = getAllByTestId('tab');
				const panel = getByTestId('tab-panel');
				expect(panel).toHaveAttribute('aria-labelledby', tabs[0].id);
			});

			it.each(cases)("Should have role set tot 'tabpanel'", (Component) => {
				const { getByTestId } = render(Component);
				const panel = getByTestId('tab-panel');
				expect(panel.role).toBe('tabpanel');
			});
		});
	});

	it.each(cases)('Should select a Tab by clicking on it', async (Component) => {
		const { getAllByTestId, getByTestId } = render(Component);
		const tabs = getAllByTestId('tab');
		let panel = getByTestId('tab-panel');
		expect(tabs[0].ariaSelected).toBe('true');
		expect(panel).toHaveTextContent('Panel 1');
		await fireEvent.click(tabs[1]);
		panel = getByTestId('tab-panel');
		expect(tabs[0].ariaSelected).toBe('false');
		expect(tabs[1].ariaSelected).toBe('true');
		expect(panel).toHaveTextContent('Panel 2');
		await fireEvent.click(tabs[4]);
		panel = getByTestId('tab-panel');
		expect(tabs[1].ariaSelected).toBe('false');
		expect(tabs[4].ariaSelected).toBe('true');
		expect(panel).toHaveTextContent('Panel 5');
	});

	describe('Navigation', () => {
		it.each(cases)('Should start at index 0 by default', (Component) => {
			const { getAllByTestId } = render(Component);
			const panels = getAllByTestId('tab-panel');
			expect(panels).toHaveLength(1);
			expect(panels[0]).toHaveTextContent('Panel 1');
		});

		it.each(cases)('Should be automatic by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const tabs = getAllByTestId('tab');
			let panel = getByTestId('tab-panel');
			expect(tabs[0].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[0].ariaSelected).toBe('false');
			expect(tabs[1].ariaSelected).toBe('true');
			panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 2');
		});

		it.each(cases)('Should be horizontal by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const tabs = getAllByTestId('tab');
			let panel = getByTestId('tab-panel');
			expect(tabs[0].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			expect(tabs[0].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[0].ariaSelected).toBe('false');
			expect(tabs[1].ariaSelected).toBe('true');
			panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 2');
		});

		it.each(cases)('Should be infinite by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const tabs = getAllByTestId('tab');
			let panel = getByTestId('tab-panel');
			expect(tabs[0].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(tabs[0].ariaSelected).toBe('false');
			expect(tabs[4].ariaSelected).toBe('true');
			panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(tabs[4].ariaSelected).toBe('false');
			expect(tabs[0].ariaSelected).toBe('true');
			panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 1');
		});

		describe.each(['Automatic', 'Manual'])('%s', (mode) => {
			const manual = mode === 'Manual';

			describe.each([
				['Horizontal', 'ArrowRight', 'ArrowLeft'],
				['Vertical', 'ArrowDown', 'ArrowUp']
			])('%s', (orientation, nextKey, previousKey) => {
				const vertical = orientation === 'Vertical';

				it.each(cases)(`Should focus the next Item by pressing ${nextKey}`, async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { manual, vertical }
					});
					const tabList = getByTestId('tab-list');
					const items = getAllByTestId('tab');
					await fireEvent.keyDown(tabList, { code: nextKey });
					expect(items[0]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: nextKey });
					expect(items[1]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: nextKey });
					expect(items[2]).toHaveFocus();
				});

				it.each(cases)(
					`Should focus the previous Item by pressing ${previousKey}`,
					async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[4]).toHaveFocus();
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[3]).toHaveFocus();
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[2]).toHaveFocus();
					}
				);

				// * valid indexes: 1/3
				it.each(cases)(`Should disabled Tabs`, async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { disabled: true, manual, vertical, index: 1 }
					});
					const tabList = getByTestId('tab-list');
					const items = getAllByTestId('tab');
					let panel = getByTestId('tab-panel');
					expect(items[1].ariaSelected).toBe('true');
					expect(panel).toHaveTextContent('Panel 2');
					await fireEvent.keyDown(tabList, { code: nextKey });
					expect(items[3]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: nextKey });
					expect(items[1]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: previousKey });
					expect(items[3]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: previousKey });
					expect(items[1]).toHaveFocus();
				});

				it.each(cases)(
					'Should update the Navigation index if an element is focused externally',
					async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						await act(() => items[2].focus());
						await fireEvent.keyDown(tabList, { code: nextKey });
						expect(items[3]).toHaveFocus();
						await act(() => items[4].focus());
						expect(items[4]).toHaveFocus();
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[3]).toHaveFocus();
					}
				);

				it.each(cases)(`Should focus the first Tab by pressing Home`, async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { manual, vertical }
					});
					const tabList = getByTestId('tab-list');
					const items = getAllByTestId('tab');
					const panel = getByTestId('tab-panel');
					expect(items[0].ariaSelected).toBe('true');
					expect(panel).toHaveTextContent('Panel 1');
					await fireEvent.keyDown(tabList, { code: 'End' });
					expect(items[4]).toHaveFocus();
					await fireEvent.keyDown(tabList, { code: 'Home' });
					expect(items[0]).toHaveFocus();
				});

				it.each(cases)(`Should focus the last Tab by pressing End`, async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { manual, vertical }
					});
					const tabList = getByTestId('tab-list');
					const items = getAllByTestId('tab');
					const panel = getByTestId('tab-panel');
					expect(items[0].ariaSelected).toBe('true');
					expect(panel).toHaveTextContent('Panel 1');
					await fireEvent.keyDown(tabList, { code: 'End' });
					expect(items[4]).toHaveFocus();
				});

				it.each(cases)(
					`Should focus the previous Tab by pressing ${previousKey} + ctrlKey`,
					async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						const panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: nextKey, ctrlKey: true });
						expect(items[4]).toHaveFocus();
						await fireEvent.keyDown(tabList, { code: previousKey, ctrlKey: true });
						expect(items[0]).toHaveFocus();
					}
				);

				it.each(cases)(
					`Should focus the last Tab by pressing ${nextKey} + ctrlKey`,
					async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						const panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: nextKey, ctrlKey: true });
						expect(items[4]).toHaveFocus();
					}
				);

				if (manual) {
					it.each(cases)(`Should not change the selected Tab`, async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						const panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: previousKey });
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
					});
				} else {
					it.each(cases)(
						`Should select the next Item by pressing ${nextKey}`,
						async (Component) => {
							const { getAllByTestId, getByTestId } = render(Component, {
								props: { manual, vertical }
							});
							const tabList = getByTestId('tab-list');
							const items = getAllByTestId('tab');
							await fireEvent.keyDown(tabList, { code: nextKey });
							let panel = getByTestId('tab-panel');
							expect(items[0].ariaSelected).toBe('true');
							expect(items[0]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 1');
							await fireEvent.keyDown(tabList, { code: nextKey });
							panel = getByTestId('tab-panel');
							expect(items[0].ariaSelected).toBe('false');
							expect(items[1].ariaSelected).toBe('true');
							expect(items[1]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 2');
							await fireEvent.keyDown(tabList, { code: nextKey });
							panel = getByTestId('tab-panel');
							expect(items[1].ariaSelected).toBe('false');
							expect(items[2].ariaSelected).toBe('true');
							expect(items[2]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 3');
						}
					);

					it.each(cases)(
						`Should select the previous Item by pressing ${nextKey}`,
						async (Component) => {
							const { getAllByTestId, getByTestId } = render(Component, {
								props: { manual, vertical }
							});
							const tabList = getByTestId('tab-list');
							const items = getAllByTestId('tab');
							await fireEvent.keyDown(tabList, { code: previousKey });
							let panel = getByTestId('tab-panel');
							expect(items[4].ariaSelected).toBe('true');
							expect(items[4]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 5');
							await fireEvent.keyDown(tabList, { code: previousKey });
							panel = getByTestId('tab-panel');
							expect(items[4].ariaSelected).toBe('false');
							expect(items[3].ariaSelected).toBe('true');
							expect(items[3]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 4');
							await fireEvent.keyDown(tabList, { code: previousKey });
							panel = getByTestId('tab-panel');
							expect(items[3].ariaSelected).toBe('false');
							expect(items[2].ariaSelected).toBe('true');
							expect(items[2]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 3');
						}
					);

					it.each(cases)(`Should select the first Tab by pressing Home`, async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						let panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: 'End' });
						panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('false');
						expect(items[4].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 5');
						await fireEvent.keyDown(tabList, { code: 'Home' });
						panel = getByTestId('tab-panel');
						expect(items[4].ariaSelected).toBe('false');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
					});

					it.each(cases)(`Should select the first Tab by pressing End`, async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component, {
							props: { manual, vertical }
						});
						const tabList = getByTestId('tab-list');
						const items = getAllByTestId('tab');
						let panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
						await fireEvent.keyDown(tabList, { code: 'End' });
						panel = getByTestId('tab-panel');
						expect(items[0].ariaSelected).toBe('false');
						expect(items[4].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 5');
						await fireEvent.keyDown(tabList, { code: 'Home' });
						panel = getByTestId('tab-panel');
						expect(items[4].ariaSelected).toBe('false');
						expect(items[0].ariaSelected).toBe('true');
						expect(panel).toHaveTextContent('Panel 1');
					});

					it.each(cases)(
						`Should select the last Tab by pressing ${previousKey} + ctrlKey`,
						async (Component) => {
							const { getAllByTestId, getByTestId } = render(Component, {
								props: { manual, vertical }
							});
							const tabList = getByTestId('tab-list');
							const items = getAllByTestId('tab');
							let panel = getByTestId('tab-panel');
							expect(items[0].ariaSelected).toBe('true');
							expect(panel).toHaveTextContent('Panel 1');
							await fireEvent.keyDown(tabList, { code: nextKey, ctrlKey: true });
							panel = getByTestId('tab-panel');
							expect(items[0].ariaSelected).toBe('false');
							expect(items[4].ariaSelected).toBe('true');
							expect(items[4]).toHaveFocus();
							expect(panel).toHaveTextContent('Panel 5');
						}
					);
					it.each(cases)(
						`Should select the last Tab by pressing ${nextKey} + ctrlKey`,
						async (Component) => {
							const { getAllByTestId, getByTestId } = render(Component, {
								props: { manual, vertical }
							});
							const tabList = getByTestId('tab-list');
							const items = getAllByTestId('tab');
							const panel = getByTestId('tab-panel');
							expect(items[0].ariaSelected).toBe('true');
							expect(panel).toHaveTextContent('Panel 1');
							await fireEvent.keyDown(tabList, { code: nextKey, ctrlKey: true });
							expect(items[4]).toHaveFocus();
						}
					);
				}
			});
		});
	});
});

describe('Props', () => {
	describe('finite', () => {
		it.each(cases)('Should turn the navigation finite', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { finite: true }
			});
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(tabList, { code: 'End' });
			expect(items[4]).toHaveFocus();
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[4]).toHaveFocus();
		});

		it.each(cases)('Should be false by default (infinite)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(items[4]).toHaveFocus();
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(items[4]).toHaveFocus();
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await act(() => component.$set({ finite: true }));
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(tabList, { code: 'End' });
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[4]).toHaveFocus();
		});
	});

	describe('initialIndex', () => {
		it.each(cases)('Should change the default selected Tab', (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { index: 1 } });
			const items = getAllByTestId('tab');
			const panel = getByTestId('tab-panel');
			expect(items[1].ariaSelected).toBe('true');
			expect(panel).toHaveTextContent('Panel 2');
		});
	});

	describe('manual', () => {
		it.each(cases)('Should turn the navigation manual', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { manual: true }
			});
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			const panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			expect(items[0].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});

		it.each(cases)('Should be false by default (automatic)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			let panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('false');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			let panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('false');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');

			await act(() => component.$set({ manual: true }));

			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[0].ariaSelected).toBe('true');
			expect(items[1]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			expect(items[0].ariaSelected).toBe('true');
			expect(items[2]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});
	});

	describe('vertical', () => {
		it.each(cases)('Should turn the navigation vertical', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { vertical: true }
			});
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			let panel = getByTestId('tab-panel');
			expect(panel).toHaveTextContent('Panel 1');
			await fireEvent.keyDown(tabList, { code: 'ArrowUp' });
			panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			panel = getByTestId('tab-panel');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});

		it.each(cases)('Should be false by default (horizontal)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			let panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('false');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const tabList = getByTestId('tab-list');
			const items = getAllByTestId('tab');
			await fireEvent.keyDown(tabList, { code: 'ArrowLeft' });
			let panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('true');
			expect(items[4]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 5');
			await fireEvent.keyDown(tabList, { code: 'ArrowRight' });
			panel = getByTestId('tab-panel');
			expect(items[4].ariaSelected).toBe('false');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');

			await act(() => component.$set({ vertical: true }));

			await fireEvent.keyDown(tabList, { code: 'ArrowDown' });
			panel = getByTestId('tab-panel');
			expect(items[0].ariaSelected).toBe('false');
			expect(items[1].ariaSelected).toBe('true');
			expect(items[1]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 2');
			await fireEvent.keyDown(tabList, { code: 'ArrowUp' });
			panel = getByTestId('tab-panel');
			expect(items[1].ariaSelected).toBe('false');
			expect(items[0].ariaSelected).toBe('true');
			expect(items[0]).toHaveFocus();
			expect(panel).toHaveTextContent('Panel 1');
		});
	});
});

describe('Slot Props', () => {
	describe('Tab', () => {
		describe('isDisabled', () => {
			it('Should expose the Tab disabled state', () => {
				const { getAllByTestId } = render(samples.Component);
				const bindings = getAllByTestId('binding-disabled');
				for (const binding of bindings) expect(binding).toHaveTextContent('false');
			});

			it('Should be reactive', async () => {
				const { component, getAllByTestId } = render(samples.Component);
				const bindings = getAllByTestId('binding-disabled');
				for (const binding of bindings) expect(binding).toHaveTextContent('false');
				await act(() => component.$set({ disabled: true }));
				expect(bindings[0]).toHaveTextContent('true');
				expect(bindings[2]).toHaveTextContent('true');
				expect(bindings[4]).toHaveTextContent('true');
			});
		});

		describe('isSelected', () => {
			it('Should expose the Tab selected state', () => {
				const { getAllByTestId } = render(samples.Component);
				const bindings = getAllByTestId('binding-selected');
				expect(bindings[0]).toHaveTextContent('true');
				for (let index = 1; index < bindings.length; index++) {
					const binding = bindings[index];
					expect(binding).toHaveTextContent('false');
				}
			});

			it('Should be reactive', async () => {
				const { getAllByTestId, getByTestId } = render(samples.Component);
				const bindings = getAllByTestId('binding-selected');
				const tabList = getByTestId('tab-list');
				expect(bindings[0]).toHaveTextContent('true');
				for (let index = 1; index < bindings.length; index++) {
					const binding = bindings[index];
					expect(binding).toHaveTextContent('false');
				}
				await fireEvent.keyDown(tabList, { code: 'End' });
				expect(bindings[0]).toHaveTextContent('false');
				expect(bindings[4]).toHaveTextContent('true');
				await fireEvent.keyDown(tabList, { code: 'Home' });
				expect(bindings[0]).toHaveTextContent('true');
				expect(bindings[4]).toHaveTextContent('false');
			});
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(TabGroup, { props: { 'data-testid': 'tab-group' } });
		const group = getByTestId('tab-group');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(TabGroup, { props: { as, 'data-testid': 'tab-group' } });
		const group = getByTestId('tab-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
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

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(TabGroup, {
			props: { use: actions, 'data-testid': 'tab-group' }
		});
		const group = getByTestId('tab-group');
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});

	const { Rendering } = samples;
	describe.each([
		['TabList', 'div'],
		['Tab', 'button'],
		['TabPanels', 'div'],
		['Panel', 'div']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testId = lowerCaseComponent;

		it(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} tab id`, async () => {
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

		it('Should be able to forward attributes', async () => {
			const attributes = { title: `a tab ${lowerCaseComponent}` };
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

		it('Should be able to forward actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { use: actions }
				}
			});
			const element = getByTestId(testId);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Context', () => {
	interface ContextKeys {
		index: any;
		createPanel: any;
		createTab: any;
		createTabList: any;
		createTabPanel: any;
	}

	const [init, message] = createContextParentRenderer<ContextKeys>(ContextParent, 'tabs');

	describe('Unset Context', () => {
		describe.each([
			['List', TabList],
			['Tab', Tab],
			['Panels', TabPanels],
			['Panel', TabPanel]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered without a Tabs Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw a specific error', () => {
				expect(() => render(Component)).toThrow(message.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['List', TabList],
			['Tab', Tab],
			['Panels', TabPanels],
			['Panel', TabPanel]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid Tabs Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(message.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						index: null,
						createPanel: null,
						createTab: null,
						createTabList: null,
						createPanels: null
					})
				).toThrow(message.invalid);
				expect(() =>
					init(Component, {
						index: { subscribe: () => 720 },
						createPanel: () => null,
						createTab: () => null,
						createTabList: {},
						createPanels: {}
					})
				).toThrow(message.invalid);
			});
		});
	});
});
