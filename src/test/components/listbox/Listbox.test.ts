import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/svelte';
import { ActionComponent, Component, FragmentComponent, Rendering } from './samples';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '$lib';
import { hasTagName } from '$lib/predicate';
import { generateActions, isValidComponentName } from '@test-utils';
import { elementTagNames } from '$lib/components/render';

// * default value: 'Vincent Law' -> ListboxOption at index 4 (last one)

const cases = [ActionComponent, Component, FragmentComponent];
describe('Attributes', () => {
	describe('ListboxLabel', () => {
		it.each(cases)('Should have for pointing to the ListboxPanel', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			const label = getByTestId('listbox-label');
			expect(button.ariaHasPopup).toBe('true');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			expect(label.for).toBe(panel.id);
		});
	});

	describe('ListboxButton', () => {
		it.each(cases)('Should have aria-haspopup set to true', (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			expect(button.ariaHasPopup).toBe('true');
		});

		describe('aria-controls', () => {
			it.each(cases)('Should be undefined by default', (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				expect(button).not.toHaveAttribute('aria-controls');
			});

			it.each(cases)('Should point to the ListboxOptions id', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				expect(button).not.toHaveAttribute('aria-controls');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				expect(button).toHaveAttribute('aria-controls', panel.id);
			});

			it.each(cases)(
				'Should be based on the ListboxOptions render state rather than the open state',
				async (Component) => {
					const { component, getByTestId } = render(Component, {
						props: { isShowingPanel: false }
					});
					const button = getByTestId('listbox-button');
					expect(button).not.toHaveAttribute('aria-controls');
					await fireEvent.click(button);
					expect(button).not.toHaveAttribute('aria-controls');
					await act(() => component.$set({ isShowingPanel: true }));
					const panel = getByTestId('listbox-options');
					expect(button).toHaveAttribute('aria-controls', panel.id);
				}
			);
		});

		describe('aria-expanded', () => {
			it.each(cases)('Should be false by default', (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				expect(button.ariaExpanded).toBe('false');
			});

			it.each(cases)('Should be true when state is open', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				expect(button.ariaExpanded).toBe('false');
				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('true');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				expect(button.ariaExpanded).toBe('false');
				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('true');
				await fireEvent.click(button);
				expect(button.ariaExpanded).toBe('false');
			});
		});
	});

	describe('ListboxOptions', () => {
		describe('aria-activedescendant', () => {
			it.each(cases)('Should point to the current selected ListboxOption id', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			});

			it.each(cases)(
				'Should be undefined if there is no selected ListboxOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).not.toHaveAttribute('aria-activedescendant');
				}
			);

			it.each(cases)('Should be reactive', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				expect(panel).not.toHaveAttribute('aria-activedescendant');
				await fireEvent.keyDown(panel, { code: 'ArrowDown' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				await fireEvent.keyDown(panel, { code: 'ArrowDown' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
				await fireEvent.keyDown(panel, { code: 'ArrowUp' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			});
		});

		describe('aria-labelledby', () => {
			it.each(cases)(
				'Should point to the combined id of the ListboxButton and ListboxLabel',
				async (Component) => {
					const { getByTestId } = render(Component);
					const button = getByTestId('listbox-button');
					const label = getByTestId('listbox-label');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					try {
						expect(panel).toHaveAttribute('aria-labelledby', label.id + ' ' + button.id);
					} catch {
						expect(panel).toHaveAttribute('aria-labelledby', button.id + ' ' + label.id);
					}
				}
			);
		});

		it.each(cases)('Shoud have tabIndex set to 0', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			expect(panel.tabIndex).toBe(0);
		});
	});

	describe('ListboxOption', () => {
		describe('aria-selected', () => {
			it.each(cases)('Should be false by default', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const options = getAllByTestId('listbox-option');
				for (const option of options) {
					expect(option.ariaSelected).toBe('false');
				}
			});

			it.each(cases)('Should be true for the current selected ListboxOption', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const options = getAllByTestId('listbox-option');
				expect(options[4].ariaSelected).toBe('true');
			});

			it.each(cases)('Should change when a ListboxOption is selected', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				let options = getAllByTestId('binding-selected');
				for (let index = 0; index < options.length; index++) {
					let option = options[index];
					await fireEvent.click(option); // panel is closed
					await fireEvent.click(button); // reopen
					options = getAllByTestId('listbox-option');
					option = options[index];
					expect(option.ariaSelected).toBe('true');
				}
			});

			it.each(cases)('Should only be one ListboxOption selected at once', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				let options = getAllByTestId('binding-selected');
				for (let index = 0; index < options.length; index++) {
					let option = options[index];
					await fireEvent.click(option); // panel is closed
					await fireEvent.click(button); // reopen
					options = getAllByTestId('listbox-option');
					option = options[index];
					expect(option.ariaSelected).toBe('true');
					for (let innerIndex = 0; innerIndex < index; innerIndex++) {
						const option = options[innerIndex];
						expect(option.ariaSelected).toBe('false');
					}
				}
			});
		});
	});
});

describe('Behaviour', () => {
	describe('Opening', () => {
		it.each(cases)('Should toggle by clicking the ListboxButton', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			expect(panel).toBeInTheDocument();
		});

		it.each(cases)('Should open by pressing ArrowDown and ArrowUp', async (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.keyDown(button, { code: 'ArrowDown' });
			let panel = getByTestId('listbox-options');
			expect(panel).toBeInTheDocument();
			await fireEvent.click(button);
			expect(panel).not.toBeInTheDocument();
			await fireEvent.keyDown(button, { code: 'ArrowUp' });
			panel = getByTestId('listbox-options');
			expect(panel).toBeInTheDocument();
		});

		describe('Missing Selected Item', () => {
			it.each(cases)(
				'Should not activate any ListboxOption if opened with a click',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).not.toHaveAttribute('aria-activedescendant');
				}
			);

			it.each(cases)(
				'Should open by pressing ArrowDown and activate first ListboxOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.keyDown(button, { code: 'ArrowDown' });
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				}
			);

			it.each(cases)(
				'Should open by pressing ArrowUp and activate last ListboxOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.keyDown(button, { code: 'ArrowUp' });
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
				}
			);

			it.each(cases)(
				'Should open by pressing Space and active first ListboxOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.keyDown(button, { code: 'Space' });
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				}
			);

			it.each(cases)(
				'Should open by pressing Enter and active first ListboxOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
					const button = getByTestId('listbox-button');
					await fireEvent.keyDown(button, { code: 'Enter' });
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				}
			);
		});
	});

	describe('Closing', () => {
		it.each(cases)(
			'Should close by clicking outside of the ListboxOptions element',
			async (Component) => {
				const { getByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				await fireEvent.click(document.body);
				expect(panel).not.toBeInTheDocument();
			}
		);

		it.each(cases)('Should close by pressing Escape', async (Component) => {
			const { getByTestId } = render(Component, { props: { value: null } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			await fireEvent.keyDown(document.body, { code: 'Escape' });
			expect(panel).not.toBeInTheDocument();
		});

		it.each(cases)('Should close upon clicking a ListboxOption', async (Component) => {
			const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			let panel = getByTestId('listbox-options');
			let options = getAllByTestId('binding-selected');
			for (let index = 0; index < options.length; index++) {
				const option = options[index];
				await fireEvent.click(option);
				expect(panel).not.toBeInTheDocument();
				await fireEvent.click(button);
				panel = getByTestId('listbox-options');
				options = getAllByTestId('listbox-option');
			}
		});
	});

	it.each(cases)('Should automatically focus the ListboxOptions element', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('listbox-button');
		await fireEvent.click(button);
		const panel = getByTestId('listbox-options');
		expect(panel).toHaveFocus();
	});

	it.each(cases)(
		'Should automatically activate and select the ListboxOption that matches the initial value',
		async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			expect(options[4].ariaSelected).toBe('true');
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
		}
	);

	describe('Key Match', () => {
		it.each(cases)(
			'Should activate the ListboxOption whose textContent starts with the given key',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				const values = getAllByTestId('option-value');
				for (let index = 0; index < values.length; index++) {
					const value = values[index].textContent;
					const option = options[index];
					await fireEvent.keyDown(panel, { key: value[0] });
					expect(panel).toHaveAttribute('aria-activedescendant', option.id);
				}
			}
		);
	});

	describe('Navigation', () => {
		it.each(cases)('Should be vertical by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
		});

		it.each(cases)('Should be finite by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'End' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
		});

		it.each(cases)('Should be start at current selected ListboxOption', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
		});

		describe.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';

			it.each(cases)(`Should activate the next Item by pressing ${nextKey}`, async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { horizontal, value: null }
				});
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			});

			it.each(cases)(
				`Should activate the previous Item by pressing ${nextKey}`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal }
					});
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
				}
			);

			it.each(cases)('Should activate the last Item by pressing End', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { horizontal }
				});
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				await fireEvent.keyDown(panel, { code: 'Home' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				await fireEvent.keyDown(panel, { code: 'End' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			});

			it.each(cases)('Should activate the first Item by pressing Home', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { horizontal }
				});
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				await fireEvent.keyDown(panel, { code: 'Home' });
				expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			});

			it.each(cases)(
				`Should activate the last Item by pressing ${nextKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal }
					});
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					await fireEvent.keyDown(panel, { code: 'Home' });
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
					await fireEvent.keyDown(panel, { code: nextKey, ctrlKey: true });
					expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
				}
			);

			it.each(cases)(
				`Should activate the first Item by pressing ${previousKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal }
					});
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					await fireEvent.keyDown(panel, { code: previousKey, ctrlKey: true });
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
				}
			);

			it.each(cases)('Should skip disabled ListboxOptions', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { disabled: true, horizontal, value: null }
				});
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const panel = getByTestId('listbox-options');
				const options = getAllByTestId('listbox-option');
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
				await fireEvent.keyDown(panel, { code: previousKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
				await fireEvent.keyDown(panel, { code: nextKey });
				expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
			});

			it.each(cases)(
				'Should not select any ListboxOption (change current value)',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, {
						props: { horizontal }
					});
					const button = getByTestId('listbox-button');
					const binding = getByTestId('binding-value-listbox');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[3].id);
					expect(binding).toHaveTextContent('Vincent Law');
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
					expect(binding).toHaveTextContent('Vincent Law');
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
					expect(binding).toHaveTextContent('Vincent Law');
					await fireEvent.keyDown(panel, { code: previousKey });
					expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
					expect(binding).toHaveTextContent('Vincent Law');
				}
			);

			it.each(cases)(
				'Should not remove focus from the ListboxOptions element',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const panel = getByTestId('listbox-options');
					const options = getAllByTestId('listbox-option');
					for (let index = 0; index < options.length; index++) {
						await fireEvent.keyDown(panel, { code: 'ArrowDown' });
						expect(panel).toHaveFocus();
					}
				}
			);
		});
	});
});

describe('Props', () => {
	describe('horizontal', () => {
		it.each(cases)('Should turn the Navigation horizontal', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { horizontal: true, value: null }
			});
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
		});

		it.each(cases)('Should be false by default (vertical)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { value: null } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { value: null }
			});
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);

			await act(() => component.$set({ horizontal: true }));

			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
			await fireEvent.keyDown(panel, { code: 'ArrowRight' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[2].id);
			await fireEvent.keyDown(panel, { code: 'ArrowLeft' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[1].id);
		});
	});

	describe('infinite', () => {
		it.each(cases)('Should turn the Navigation infinite', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { infinite: true } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
		});

		it.each(cases)('Should be false by default (finite)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const panel = getByTestId('listbox-options');
			const options = getAllByTestId('listbox-option');
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			await fireEvent.keyDown(panel, { code: 'Home' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);

			await act(() => component.$set({ infinite: true }));

			await fireEvent.keyDown(panel, { code: 'ArrowUp' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[4].id);
			await fireEvent.keyDown(panel, { code: 'ArrowDown' });
			expect(panel).toHaveAttribute('aria-activedescendant', options[0].id);
		});
	});
});

describe('Slot Props', () => {
	describe('isOpen', () => {
		it.each(cases)('Should expose the current open state', (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-listbox');
			expect(binding).toHaveTextContent('false');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-listbox');
			const button = getByTestId('listbox-button');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('true');
		});

		it.each(cases)('Should be exposed from the ListboxLabel scope', async (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-label');
			const button = getByTestId('listbox-button');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('true');
		});

		it.each(cases)('Should be exposed from the ListboxButton scope', async (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-open-button');
			const button = getByTestId('listbox-button');
			expect(binding).toHaveTextContent('false');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('true');
		});
	});

	describe('ListboxButton', () => {
		describe('isActive', () => {
			it.each(cases)('Should be false by default', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-active');
				const panel = getByTestId('listbox-options');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
			});

			it.each(cases)(
				'Should only be true for the current active ListboxOption',
				async (Component) => {
					const { getByTestId, getAllByTestId } = render(Component);
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const bindings = getAllByTestId('binding-active');
					const panel = getByTestId('listbox-options');
					expect(bindings[4]).toHaveTextContent('true');
					for (let index = 0; index < bindings.length - 3; index++) {
						const binding = bindings[index];
						expect(binding).toHaveTextContent('false');
					}
				}
			);

			it.each(cases)('Should be reactive', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-active');
				const panel = getByTestId('listbox-options');
				for (let index = 0; index < bindings.length; index++) {
					const binding = bindings[index];
					await fireEvent.keyDown(panel, { code: 'ArrowDown' });
					expect(binding).toHaveTextContent('true');
				}
			});
		});

		describe('isSelected', () => {
			it.each(cases)('Should be false by default', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-selected');
				const panel = getByTestId('listbox-options');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
			});

			it.each(cases)(
				'Should only be true for the current selected ListboxOption',
				async (Component) => {
					const { getByTestId, getAllByTestId } = render(Component);
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const bindings = getAllByTestId('binding-selected');
					const panel = getByTestId('listbox-options');
					expect(bindings[4]).toHaveTextContent('true');
					for (let index = 0; index < bindings.length - 3; index++) {
						const binding = bindings[index];
						expect(binding).toHaveTextContent('false');
					}
				}
			);

			it.each(cases)('Should not change while navigating', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-selected');
				const panel = getByTestId('listbox-options');
				for (let index = 0; index < bindings.length; index++) {
					const binding = bindings[index];
					await fireEvent.keyDown(panel, { code: 'ArrowDown' });
					expect(binding).toHaveTextContent('false');
				}
			});

			it.each(cases)('Should change when a ListboxOption is selected', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				let bindings = getAllByTestId('binding-selected');
				let options = getAllByTestId('binding-selected');
				for (let index = 0; index < bindings.length; index++) {
					let binding = bindings[index];
					const option = options[index];
					await fireEvent.click(option); // panel is closed
					await fireEvent.click(button); // reopen
					bindings = getAllByTestId('binding-selected');
					binding = bindings[index];
					options = getAllByTestId('listbox-option');
					expect(binding).toHaveTextContent('true');
				}
			});
		});

		describe('isDisabled', () => {
			it('Should be false by default', async () => {
				const { getByTestId, getAllByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-disabled');
				const panel = getByTestId('listbox-options');
				for (const binding of bindings) {
					expect(binding).toHaveTextContent('false');
				}
			});

			it('Should be true when the ListboxOption is disabled', async () => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { disabled: true } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-disabled');
				const panel = getByTestId('listbox-options');
				expect(bindings[0]).toHaveTextContent('true');
				expect(bindings[1]).toHaveTextContent('false');
				expect(bindings[2]).toHaveTextContent('true');
				expect(bindings[3]).toHaveTextContent('false');
				expect(bindings[4]).toHaveTextContent('true');
			});

			it('Should be reactive', async () => {
				const { component, getByTestId, getAllByTestId } = render(Component);
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-disabled');
				const panel = getByTestId('listbox-options');
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

			it.each(cases)(
				'Should only be true for the current selected ListboxOption',
				async (Component) => {
					const { getByTestId, getAllByTestId } = render(Component);
					const button = getByTestId('listbox-button');
					await fireEvent.click(button);
					const bindings = getAllByTestId('binding-selected');
					const panel = getByTestId('listbox-options');
					expect(bindings[4]).toHaveTextContent('true');
					for (let index = 0; index < bindings.length - 3; index++) {
						const binding = bindings[index];
						expect(binding).toHaveTextContent('false');
					}
				}
			);

			it.each(cases)('Should not change while navigating', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				const bindings = getAllByTestId('binding-selected');
				const panel = getByTestId('listbox-options');
				for (let index = 0; index < bindings.length; index++) {
					const binding = bindings[index];
					await fireEvent.keyDown(panel, { code: 'ArrowDown' });
					expect(binding).toHaveTextContent('false');
				}
			});

			it.each(cases)('Should change when a ListboxOption is selected', async (Component) => {
				const { getByTestId, getAllByTestId } = render(Component, { props: { value: null } });
				const button = getByTestId('listbox-button');
				await fireEvent.click(button);
				let bindings = getAllByTestId('binding-selected');
				let options = getAllByTestId('binding-selected');
				for (let index = 0; index < bindings.length; index++) {
					let binding = bindings[index];
					const option = options[index];
					await fireEvent.click(option); // panel is closed
					await fireEvent.click(button); // reopen
					bindings = getAllByTestId('binding-selected');
					binding = bindings[index];
					options = getAllByTestId('listbox-option');
					expect(binding).toHaveTextContent('true');
				}
			});
		});
	});

	describe('value', () => {
		it.each(cases)('Should expose the current value from the Listbox scope', (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-value-listbox');
			expect(binding).toHaveTextContent('Vincent Law');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const binding = getByTestId('binding-value-listbox');
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			expect(binding).toHaveTextContent('Vincent Law');
			let options = getAllByTestId('listbox-option');
			let values = getAllByTestId('option-value');
			for (let index = 0; index < options.length; index++) {
				const option = options[index];
				const value = values[index].textContent;
				await fireEvent.click(option);
				expect(binding).toHaveTextContent(value);
				await fireEvent.click(button);
				options = getAllByTestId('listbox-option');
				values = getAllByTestId('option-value');
			}
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(Listbox, { props: { 'data-testid': 'listbox' } });
		const group = getByTestId('listbox');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(Listbox, { props: { as, 'data-testid': 'listbox' } });
		const group = getByTestId('listbox');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'an amazing listbox' };
		const { getByTestId } = render(Listbox, {
			props: {
				...attributes,
				'data-testid': 'listbox'
			}
		});
		const group = getByTestId('listbox');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(Listbox, {
			props: { use: actions, 'data-testid': 'listbox' }
		});
		const group = getByTestId('listbox');
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});

	describe.each([
		['Button', 'button'],
		['Options', 'ul'],
		['Option', 'li'],
		['Label', 'label']
	])('Listbox%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testid = 'listbox-' + lowerCaseComponent;

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const element = getByTestId(testid);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} radio id`, async () => {
			const { getByTestId } = render(Rendering);
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const element = getByTestId(testid);
			expect(isValidComponentName(element, 'listbox')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const element = getByTestId(testid);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', async () => {
			const attributes = { title: `a listbox ${lowerCaseComponent}` };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
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
			const button = getByTestId('listbox-button');
			await fireEvent.click(button);
			const element = getByTestId(testid);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});
