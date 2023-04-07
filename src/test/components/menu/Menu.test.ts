import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Menu, MenuButton, MenuItems } from '$lib';
import { hasTagName } from '$lib/predicate';
import { elementTagNames } from '$lib/components/render';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';
import { ElementBinder } from '$lib/core';

const cases = [samples.ActionComponent, samples.Component, samples.FragmentComponent];
describe('Behaviour', () => {
	it.each(cases)('Should be closed by default', (Component) => {
		const { getByTestId } = render(Component);
		expect(() => getByTestId('menu-panel')).toThrow();
	});

	it.each(cases)('Should toggle by clicking the button', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText(/Toggle/);
		await fireEvent.click(button);
		const panel = getByTestId('menu-panel');
		expect(panel).toBeInTheDocument();
		await fireEvent.click(button);
		expect(panel).not.toBeInTheDocument();
	});

	it.each(cases)('Should focus the menu-panel upon opening', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('menu-button');
		await fireEvent.click(button);
		const panel = getByTestId('menu-panel');
		expect(panel).toBeInTheDocument();
		expect(panel).toHaveFocus();
	});

	it.each(cases)('Should close by clicking outside the panel', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText(/Toggle/);
		const external = getByText(/External/);
		await fireEvent.click(button);
		const panel = getByTestId('menu-panel');
		expect(panel).toBeInTheDocument();
		await fireEvent.click(external);
		expect(panel).not.toBeInTheDocument();
	});

	it.each(cases)(
		'Should not activate any menu-item upon clicking the menu-button',
		async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			expect(panel).not.toHaveAttribute('aria-activedescendant');
		}
	);

	it.each(cases)('Should close by pressing Escape key', async (Component) => {
		const { getByTestId, getByText } = render(Component);
		const button = getByText(/Toggle/);
		await fireEvent.click(button);
		const panel = getByTestId('menu-panel');
		expect(panel).toBeInTheDocument();
		await fireEvent.keyDown(document, { code: 'Escape' });
		expect(panel).not.toBeInTheDocument();
	});

	describe('Attributes', () => {
		describe('menu-button', () => {
			describe('aria-controls', () => {
				it.each(cases)('Should be unset by default', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('menu-button');
					expect(button).not.toHaveAttribute('aria-controls');
				});

				it.each(cases)('Should point to the panel id', async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('menu-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});

				it('Should be reactive', async () => {
					const { component, getByTestId } = render(samples.Component);
					const button = getByTestId('menu-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					let panel = getByTestId('menu-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);
					await fireEvent.click(button);
					expect(button).not.toHaveAttribute('aria-controls', panel.id);
					await fireEvent.click(button);
					panel = getByTestId('menu-panel');
					await act(() => component.$set({ panelid: 'panel' }));
					expect(button).toHaveAttribute('aria-controls', 'panel');
				});

				it.each(cases)('Should be based on the menu-panel render state', async (Component) => {
					const { component, getByTestId } = render(Component, {
						props: { isShowingPanel: false }
					});
					const button = getByTestId('menu-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					expect(button).not.toHaveAttribute('aria-controls');
					await act(() => component.$set({ isShowingPanel: true }));
					const panel = getByTestId('menu-panel');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				});
			});

			describe('aria-expanded', () => {
				it.each(cases)('Should be set to false by default', async (Component) => {
					const { getByText } = render(Component);
					const button = getByText(/Toggle/);
					expect(button.ariaExpanded).toBe('false');
				});

				it.each(cases)('Should be true when state is open', async (Component) => {
					const { getByText } = render(Component);
					const button = getByText(/Toggle/);
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
				});

				it.each(cases)('Should be reactive', async (Component) => {
					const { getByText } = render(Component);
					const button = getByText(/Toggle/);
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				});
			});

			it.each(cases)('Should have aria-haspopup set to true', async (Component) => {
				const { getByText } = render(Component);
				const button = getByText(/Toggle/);
				expect(button.ariaHasPopup).toBe('true');
			});
		});

		describe('menu-items', () => {
			describe('aria-labelledby', () => {
				it.each(cases)(
					'Should have aria-labelledby set to the menu-button id',
					async (Component) => {
						const { getByTestId } = render(Component);
						const button = getByTestId('menu-button');
						await fireEvent.click(button);
						const panel = getByTestId('menu-panel');
						expect(panel).toHaveAttribute('aria-labelledby', button.id);
					}
				);

				it('Should be reactive', async () => {
					const { component, getByTestId } = render(samples.Component, {
						props: { buttonid: 'button' }
					});
					const button = getByTestId('menu-button');
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					expect(panel).toHaveAttribute('aria-labelledby', 'button');
					await act(() => component.$set({ buttonid: 'menu-button' }));
					expect(panel).toHaveAttribute('aria-labelledby', 'menu-button');
				});
			});

			it.each(cases)('Should have role set to menu', async (Component) => {
				const { getByTestId, getByText } = render(Component);
				const button = getByText(/Toggle/);
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				expect(panel).toBeInTheDocument();
				expect(panel.role).toBe('menu');
			});

			it.each(cases)('Should have tabIndex set to 0', async (Component) => {
				const { getByTestId, getByText } = render(Component);
				const button = getByText(/Toggle/);
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				expect(panel).toBeInTheDocument();
				expect(panel.tabIndex).toBe(0);
			});

			describe('aria-activedescendant', () => {
				it.each(cases)('Should be unset by default', async (Component) => {
					const { getByTestId, getByText } = render(Component);
					const button = getByText(/Toggle/);
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					expect(panel).not.toHaveAttribute('aria-activedescendant');
				});

				it.each(cases)('Should point to the current active menu-item', async (Component) => {
					const { getAllByTestId, getByTestId, getByText } = render(Component);
					const button = getByText(/Toggle/);
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					expect(panel).not.toHaveAttribute('aria-activedescendant');
					await fireEvent.keyDown(panel, { code: 'ArrowRight' });
					const item = getAllByTestId('menu-item')[0];
					expect(panel).toHaveAttribute('aria-activedescendant', item.id);
				});
			});
		});

		describe('menu-item', () => {
			it.each(cases)('Should have role set to menuitem', async (Component) => {
				const { getAllByTestId, getByText } = render(Component);
				const button = getByText(/Toggle/);
				await fireEvent.click(button);
				const item = getAllByTestId('menu-item')[0];
				expect(item.role).toBe('menuitem');
			});

			it.each(cases)('Should have tabIndex set to -1', async (Component) => {
				const { getAllByTestId, getByText } = render(Component);
				const button = getByText(/Toggle/);
				await fireEvent.click(button);
				const item = getAllByTestId('menu-item')[0];
				expect(item.tabIndex).toBe(-1);
			});
		});
	});

	describe('Key Match', () => {
		it.each(cases)('Should activate the item that matches the given Key', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { key: '3' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
			await fireEvent.keyDown(panel, { key: '6' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
		});

		// * invalid indexes = 0,2,4
		it.each(cases)('Should not activate a disabled item', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { disabled: true } });
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { key: '1' });
			expect(panel).not.toHaveAttribute('aria-activedescendant');
			await fireEvent.keyDown(panel, { key: '3' });
			expect(panel).not.toHaveAttribute('aria-activedescendant');
		});
	});

	describe('Navigation', () => {
		describe('menu-button', () => {
			it.each(cases)('Should open when pressing ArrowDown', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('menu-button');
				await fireEvent.keyDown(button, { code: 'ArrowDown' });
			});

			describe.each([['ArrowDown'], ['Enter'], ['Space']])('%s', (key) => {
				it.each(cases)(
					`Should open when pressing ${key} and activate first menu-item`,
					async (Component) => {
						const { getAllByTestId, getByTestId } = render(Component);
						const button = getByTestId('menu-button');
						await fireEvent.keyDown(button, { code: key });
						const panel = getByTestId('menu-panel');
						const items = getAllByTestId('menu-item');
						expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
					}
				);
			});

			it.each(cases)('Should open when pressing ArrowUp', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('menu-button');
				await fireEvent.keyDown(button, { code: 'ArrowUp' });
			});

			it.each(cases)(
				'Should open when pressing ArrowUp and activate last menu-item',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const button = getByTestId('menu-button');
					await fireEvent.keyDown(button, { code: 'ArrowUp' });
					const panel = getByTestId('menu-panel');
					const items = getAllByTestId('menu-item');
					expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
				}
			);
		});

		it.each(cases)('Should be vertical by default', async (Component) => {
			const { getAllByTestId, getByTestId, getByText } = render(Component);
			const button = getByText(/Toggle/);
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
		});

		describe.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';

			it.each(cases)(`Should activate the next Item by pressing ${nextKey}`, async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
			});

			it.each(cases)(
				`Should activate the previous Item by pressing ${previousKey}`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal }
					});
					const button = getByTestId('menu-button');
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					const items = getAllByTestId('menu-item');
					await fireEvent.keyDown(panel, { code: nextKey, ctrlKey: true });
					expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', items[4].id);
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', items[3].id);
				}
			);

			it.each(cases)(
				`Should activeate the last element upon pressing ${nextKey} + CtrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const button = getByTestId('menu-button');
					await fireEvent.click(button);
					const panel = getByTestId('menu-panel');
					const items = getAllByTestId('menu-item');
					await fireEvent.keyDown(panel, { code: nextKey, ctrlKey: true });
					expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
				}
			);

			// * valid indexes = 1,3,5
			it.each(cases)(`Should disabled elements`, async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, {
					props: { disabled: true, horizontal }
				});
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[3].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[3].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);

				await fireEvent.keyDown(panel, { code: previousKey, ctrlKey: true });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
				await fireEvent.keyDown(panel, { code: nextKey, ctrlKey: true });
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
			});

			it.each(cases)('Should be finite by default', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { disabled: true, horizontal }
				});
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			});

			it.each(cases)('Should activate last element upon pressing End', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: 'End' });
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
			});

			it.each(cases)('Should not focus any item', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveFocus();
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
				await fireEvent.keyDown(panel, { code: 'End' });
				expect(panel).toHaveFocus();
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveFocus();
				expect(panel).toHaveAttribute('aria-activedescendant', items[4].id);
				await fireEvent.keyDown(panel, { code: 'Home' });
				expect(panel).toHaveFocus();
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			});

			it.each(cases)(
				'Should click the current active item by pressing Enter or Space',
				async (Component) => {
					const onClick = vi.fn(() => {});
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal, onClick }
					});
					const button = getByTestId('menu-button');
					await fireEvent.click(button);
					let panel = getByTestId('menu-panel');
					let items = getAllByTestId('menu-item');
					await fireEvent.keyDown(panel, { code: nextKey });
					expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
					await fireEvent.keyDown(panel, { code: nextKey });
					expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
					await fireEvent.keyDown(panel, { code: 'Enter' });
					expect(onClick).toHaveBeenCalledTimes(1);
					expect(onClick).toHaveBeenCalledWith(items[1].id);

					await fireEvent.click(button);
					panel = getByTestId('menu-panel');
					items = getAllByTestId('menu-item');
					await fireEvent.keyDown(panel, { code: 'End' });
					expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
					await fireEvent.keyDown(panel, { code: 'Space' });
					expect(onClick).toHaveBeenCalledTimes(2);
					expect(onClick).toHaveBeenCalledWith(items[5].id);
				}
			);

			it.each(cases)('Should activate first element upon pressing Home', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { horizontal }
				});
				const button = getByTestId('menu-button');
				await fireEvent.click(button);
				const panel = getByTestId('menu-panel');
				const items = getAllByTestId('menu-item');
				await fireEvent.keyDown(panel, { code: 'End' });
				expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
				await fireEvent.keyDown(panel, { code: 'Home' });
				expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			});
		});
	});
});

describe('Props', () => {
	describe('horizontal', () => {
		it.each(cases)('Should turn the navigation horizontal', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { horizontal: true }
			});
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { horizontal: true }
			});
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);

			await act(() => component.$set({ horizontal: false }));
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
		});
	});

	describe('infinite', () => {
		it.each(cases)('Should turn the navigation infinite', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { infinite: true }
			});
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { infinite: true }
			});
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);

			await act(() => component.$set({ infinite: false }));
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[5].id);
			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
		});
	});
});

describe('Slot Props', () => {
	describe('isActive', () => {
		it.each(cases)('Should expose each item active state', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const bindings = getAllByTestId('binding-active');
			for (const binding of bindings) expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('menu-button');
			await fireEvent.click(button);
			const panel = getByTestId('menu-panel');
			const items = getAllByTestId('menu-item');
			const bindings = getAllByTestId('binding-active');
			for (const binding of bindings) expect(binding).toHaveTextContent('false');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(bindings[0]).toHaveTextContent('true');
			expect(panel).toHaveAttribute('aria-activedescendant', items[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(bindings[0]).toHaveTextContent('false');
			expect(bindings[1]).toHaveTextContent('true');
			expect(panel).toHaveAttribute('aria-activedescendant', items[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(bindings[1]).toHaveTextContent('false');
			expect(bindings[2]).toHaveTextContent('true');
			expect(panel).toHaveAttribute('aria-activedescendant', items[2].id);
		});
	});

	describe('isOpen', () => {
		it.each(cases)('Should expose the current open state', async (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-button');
			expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('menu-button');
			const binding = getByTestId('binding-open-button');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('true');
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(Menu, { props: { 'data-testid': 'menu-root' } });
		const group = getByTestId('menu-root');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(Menu, { props: { as, 'data-testid': 'menu-root' } });
		const group = getByTestId('menu-root');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
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

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(Menu, {
			props: { use: actions, as: 'div', 'data-testid': 'menu-root' }
		});
		const group = getByTestId('menu-root');
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});

	const { Rendering } = samples;
	describe.each([
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

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering);

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} menu id`, async () => {
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

		it('Should be able of forwarding attributes', async () => {
			const attributes = { title: `a menu ${lowerCaseComponent}` };
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

		it('Should be able of forwarding actions', async () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { use: actions }
				}
			});

			if (lowerCaseComponent.includes('item')) await open(getByTestId);

			const element = getByTestId(testId);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Context', () => {
	interface ContextKeys {
		isOpen: any;
		createMenuButton: any;
		createMenuItem: any;
		createMenuPanel: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'menu');

	describe('Unset Context', () => {
		describe.each([
			['Button', MenuButton],
			['Items', MenuItems]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered without a Menu Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(messages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe.each([
			['Button', MenuButton],
			['Items', MenuItems]
		])('%s', (name, Component) => {
			it('Should throw an error if rendered with an invalid Menu Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(messages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						isOpen: null,
						createMenuButton: null,
						createMenuItem: null,
						createMenuPanel: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init(Component, {
						isOpen: { subscribe: 96 },
						createMenuButton: { binder: new ElementBinder(), action: () => null },
						createMenuItem: null,
						createMenuPanel: 'hey'
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
