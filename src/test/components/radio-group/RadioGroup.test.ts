import '@testing-library/jest-dom';
import { RadioGroup } from '$lib';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Component, FragmentComponent, Rendering } from './samples';
import { findByTestId, fuseElementsName, useRange } from '@test-utils';
import { hasTagName } from '$lib/predicate';
import { generateActions, isValidComponentName } from '@test-utils';
import { elementTagNames } from '$lib/components/render';

// * default value: 'Vincent Law' -> RadioGroupOption at index 4 (last one)

const cases = [Component, FragmentComponent];
describe('Attributes', () => {
	describe('RadioGroup', () => {
		it.each(cases)("Should have role set to 'radiogroup'", () => {
			const { getAllByTestId, getByTestId } = render(Component);
			const group = getByTestId('radio');
			expect(group.role).toBe('radiogroup');
		});

		describe('aria-describedby', () => {
			it.each(cases)("Should point to all RadioGroupDescription's of its scope", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const descriptions = getAllByTestId('radio-description-group');
				const group = getByTestId('radio');
				expect(group).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
			});

			it.each(cases)("Should not include the RadioGroupOption's descriptions", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const group = getByTestId('radio');
				const descriptions = getAllByTestId('radio-description-option');
				const attribute = group.getAttribute('aria-describedby');
				for (const description of descriptions) {
					expect(attribute.search(description.id)).toBe(-1);
				}
			});

			it.each(cases)("Should be undefined if there are no RadioGroupDescription's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const group = getByTestId('radio');
				expect(group).not.toHaveAttribute('aria-describedby');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const group = getByTestId('radio');
				expect(group).not.toHaveAttribute('aria-describedby');
				await act(() => amount.increment());
				const descriptions = getAllByTestId('radio-description-group');
				expect(group).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
			});
		});

		describe('aria-labelledby', () => {
			it.each(cases)("Should point to all RadioGroupLabel's of its scope", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const labels = getAllByTestId('radio-label-group');
				const group = getByTestId('radio');
				expect(group).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});

			it.each(cases)("Should not include the RadioGroupOption's labels", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const group = getByTestId('radio');
				const labels = getAllByTestId('radio-label-option');
				const attribute = group.getAttribute('aria-labelledby');
				for (const label of labels) {
					expect(attribute.search(label.id)).toBe(-1);
				}
			});

			it.each(cases)("Should be undefined if there are no RadioGroupLabel's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const group = getByTestId('radio');
				expect(group).not.toHaveAttribute('aria-labelledby');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const group = getByTestId('radio');
				expect(group).not.toHaveAttribute('aria-labelledby');
				await act(() => amount.increment());
				const labels = getAllByTestId('radio-label-group');
				expect(group).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});
		});
	});

	describe('RadioGroupLabel', () => {
		describe('for', () => {
			it.each(cases)(
				'Should point to the RadioGroup id when it has no RadioGroupOption context',
				(Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const labels = getAllByTestId('radio-label-group');
					const group = getByTestId('radio');
					for (const label of labels) {
						expect(label.for).toBe(group.id);
					}
				}
			);

			it.each(cases)('Should point to the RadioGroupOption id when it has context', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					const labels = findByTestId(option, 'radio-label-option');
					for (const label of labels) {
						expect(label.for).toBe(option.id);
					}
				}
			});
		});
	});

	describe('RadioGroupOption', () => {
		describe('aria-checked', () => {
			it.each(cases)('Should be false by default unless it is the checked one', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (let index = 0; index < options.length - 1; index++) {
					const option = options[index];
					expect(option.ariaChecked).toBe('false');
				}
			});

			it.each(cases)('Should be true for the checked one', (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				expect(options[4].ariaChecked).toBe('true');
			});

			it.each(cases)('Should be only one checked at a time', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (let index = 0; index < options.length - 1; index++) {
					const option = options[index];
					expect(option.ariaChecked).toBe('false');
				}
				expect(options[4].ariaChecked).toBe('true');
				await fireEvent.click(options[1]);
				for (let index = 0; index < options.length; index++) {
					const option = options[index];
					if (index === 1) expect(option.ariaChecked).toBe('true');
					else expect(option.ariaChecked).toBe('false');
				}
				await fireEvent.click(options[3]);
				for (let index = 0; index < options.length; index++) {
					const option = options[index];
					if (index === 3) expect(option.ariaChecked).toBe('true');
					else expect(option.ariaChecked).toBe('false');
				}
			});
		});

		it.each(cases)("Should have role set to 'radio'", (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const options = getAllByTestId('radio-option');
			for (const option of options) {
				expect(option.role).toBe('radio');
			}
		});

		describe('aria-describedby', () => {
			it.each(cases)("Should point to all RadioGroupDescription's of its scope", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					const descriptions = findByTestId(option, 'radio-description-option');
					expect(option).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
				}
			});

			it.each(cases)("Should not include the RadioGroupOption's descriptions", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const descriptions = getAllByTestId('radio-description-group');
				const options = getAllByTestId('radio-option');
				for (const description of descriptions) {
					for (const option of options) {
						const attribute = option.getAttribute('aria-describedby');
						expect(attribute.search(description.id)).toBe(-1);
					}
				}
			});

			it.each(cases)("Should be undefined if there are no RadioGroupDescription's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					expect(option).not.toHaveAttribute('aria-describedby');
				}
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					expect(option).not.toHaveAttribute('aria-describedby');
					await act(() => amount.increment());
					const descriptions = findByTestId(option, 'radio-description-option');
					expect(option).toHaveAttribute('aria-describedby', fuseElementsName(descriptions));
					await act(() => amount.reset());
				}
			});
		});

		describe('aria-labelledby', () => {
			it.each(cases)("Should point to all RadioGroupLabel's of its scope", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					const labels = findByTestId(option, 'radio-label-option');
					expect(option).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
				}
			});

			it.each(cases)("Should not include the RadioGroupOption's labels", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const labels = getAllByTestId('radio-label-group');
				const options = getAllByTestId('radio-option');
				for (const label of labels) {
					for (const option of options) {
						const attribute = option.getAttribute('aria-labelledby');
						expect(attribute.search(label.id)).toBe(-1);
					}
				}
			});

			it.each(cases)("Should be undefined if there are no RadioGroupLabel's", (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { amount: useRange(0) }
				});
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					expect(option).not.toHaveAttribute('aria-labelledby');
				}
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const amount = useRange(0);
				const { getAllByTestId, getByTestId } = render(Component, { props: { amount } });
				const options = getAllByTestId('radio-option');
				for (const option of options) {
					expect(option).not.toHaveAttribute('aria-labelledby');
					await act(() => amount.increment());
					const labels = findByTestId(option, 'radio-label-option');
					expect(option).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
					await act(() => amount.reset());
				}
			});
		});

		describe('tabIndex', () => {
			it.each(cases)('Should be set to -1 unless it is the checked one', (Component) => {
				const { getAllByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				for (let index = 0; index < options.length - 1; index++) {
					const option = options[index];
					expect(option.tabIndex).toBe(-1);
				}
			});

			it.each(cases)('Should be set to 0 for the checked one', (Component) => {
				const { getAllByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				expect(options[4].tabIndex).toBe(0);
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { getAllByTestId } = render(Component);
				const options = getAllByTestId('radio-option');
				expect(options[4].tabIndex).toBe(0);
				await fireEvent.click(options[2]);
				expect(options[4].tabIndex).toBe(-1);
				expect(options[2].tabIndex).toBe(0);
				await fireEvent.click(options[3]);
				expect(options[2].tabIndex).toBe(-1);
				expect(options[3].tabIndex).toBe(0);
			});
		});
	});
});

describe('Behaviour', () => {
	it.each(cases)(
		'Should automatically select the RadioGroupOption that matches the RadioGroup value',
		(Component) => {
			const { getAllByTestId } = render(Component);
			const options = getAllByTestId('radio-option');
			const bindings = getAllByTestId('binding-selected');
			expect(bindings[4]).toHaveTextContent('true');
			expect(options[4].ariaChecked).toBe('true');
			expect(options[4].tabIndex).toBe(0);
		}
	);

	it.each(cases)(
		'Should check a RadioGroupOption by clicking on it and change the RadioGroup value',
		async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const options = getAllByTestId('radio-option');
			const binding = getByTestId('binding-value-group');
			const values = getAllByTestId('option-value');
			for (let index = 0; index < options.length; index++) {
				const option = options[index];
				const optionValue = values[index].textContent;
				await fireEvent.click(option);
				expect(option.ariaChecked).toBe('true');
				expect(binding).toHaveTextContent(optionValue);
			}
		}
	);

	describe('Navigation', () => {
		it.each(cases)('Should be vertical by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const group = getByTestId('radio');
			const options = getAllByTestId('radio-option');
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[3]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[2]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[1]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[2]).toHaveFocus();
		});

		it.each(cases)('Should be infinite', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const group = getByTestId('radio');
			const options = getAllByTestId('radio-option');
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[0]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[4]).toHaveFocus();
		});

		describe.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const horizontal = orientation === 'Horizontal';

			// * Selected Item Index -> 4
			it.each(cases)('Should start from the current checked option', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const group = getByTestId('radio');
				const options = getAllByTestId('radio-option');
				await fireEvent.keyDown(group, { code: previousKey });
				expect(options[3]).toHaveFocus();
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[4]).toHaveFocus();
				await fireEvent.keyDown(group, { code: previousKey });
				expect(options[3]).toHaveFocus();
			});

			it.each(cases)(`Should focus the next Item by pressing ${nextKey}`, async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const group = getByTestId('radio');
				const options = getAllByTestId('radio-option');
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[0]).toHaveFocus();
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[1]).toHaveFocus();
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[2]).toHaveFocus();
			});

			it.each(cases)(
				`Should focus the previous Item by pressing ${previousKey}`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					await fireEvent.keyDown(group, { code: previousKey });
					expect(options[3]).toHaveFocus();
					await fireEvent.keyDown(group, { code: previousKey });
					expect(options[2]).toHaveFocus();
					await fireEvent.keyDown(group, { code: previousKey });
					expect(options[1]).toHaveFocus();
				}
			);

			it.each(cases)('Should focus the first option by pressing Home', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const group = getByTestId('radio');
				const options = getAllByTestId('radio-option');
				await fireEvent.keyDown(group, { code: 'Home' });
				expect(options[0]).toHaveFocus();
			});

			it.each(cases)(
				`Should focus the first option by pressing ${previousKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					await fireEvent.keyDown(group, { code: previousKey, ctrlKey: true });
					expect(options[0]).toHaveFocus();
				}
			);

			it.each(cases)(
				`Should focus the last option by pressing ${nextKey} + ctrlKey`,
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					await fireEvent.keyDown(group, { code: previousKey, ctrlKey: true });
					expect(options[0]).toHaveFocus();
					await fireEvent.keyDown(group, { code: nextKey, ctrlKey: true });
					expect(options[4]).toHaveFocus();
				}
			);

			it.each(cases)('Should focus the last option by pressing End', async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
				const group = getByTestId('radio');
				const options = getAllByTestId('radio-option');
				await fireEvent.keyDown(group, { code: 'Home' });
				expect(options[0]).toHaveFocus();
				await fireEvent.keyDown(group, { code: 'End' });
				expect(options[4]).toHaveFocus();
			});

			it.each(cases)(
				'Should automatically change the value with the focused RadioGroupOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const binding = getByTestId('binding-value-group');
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					const values = getAllByTestId('option-value');
					await fireEvent.keyDown(group, { code: 'Home' });
					let currentOption = options[0];
					expect(currentOption).toHaveFocus();
					expect(binding).toHaveTextContent(values[0].textContent);
					await fireEvent.keyDown(group, { code: 'End' });
					currentOption = options[4];
					expect(currentOption).toHaveFocus();
					expect(binding).toHaveTextContent(values[4].textContent);
					await fireEvent.keyDown(group, { code: previousKey });
					currentOption = options[3];
					expect(currentOption).toHaveFocus();
					expect(binding).toHaveTextContent(values[3].textContent);
					await fireEvent.keyDown(group, { code: nextKey });
					currentOption = options[4];
					expect(currentOption).toHaveFocus();
					expect(binding).toHaveTextContent(values[4].textContent);
				}
			);

			it.each(cases)(
				'Should automatically change the aria-checked attribute for the focused and previously focused RadioGroupOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[4].ariaChecked).toBe('false');
					expect(options[0].ariaChecked).toBe('true');
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[0].ariaChecked).toBe('false');
					expect(options[1].ariaChecked).toBe('true');
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[1].ariaChecked).toBe('false');
					expect(options[2].ariaChecked).toBe('true');
					await fireEvent.keyDown(group, { code: previousKey });
					expect(options[1].ariaChecked).toBe('true');
					expect(options[2].ariaChecked).toBe('false');
				}
			);

			it.each(cases)(
				'Should automatically change the tabIndex attribute for the focused and previously focused RadioGroupOption',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal } });
					const group = getByTestId('radio');
					const options = getAllByTestId('radio-option');
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[4].tabIndex).toBe(-1);
					expect(options[0].tabIndex).toBe(0);
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[0].tabIndex).toBe(-1);
					expect(options[1].tabIndex).toBe(0);
					await fireEvent.keyDown(group, { code: nextKey });
					expect(options[1].tabIndex).toBe(-1);
					expect(options[2].tabIndex).toBe(0);
					await fireEvent.keyDown(group, { code: previousKey });
					expect(options[1].tabIndex).toBe(0);
					expect(options[2].tabIndex).toBe(-1);
				}
			);

			// * Valid Indexes: 1,3
			it.each(cases)("Should skip disabled RadioGroupOptions's", async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { disabled: true, horizontal, value: 'Ichigo Kurosaki' }
				});
				const group = getByTestId('radio');
				const options = getAllByTestId('radio-option');
				expect(options[1].ariaChecked).toBe('true');
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[3]).toHaveFocus('true');
				await fireEvent.keyDown(group, { code: nextKey });
				expect(options[1]).toHaveFocus('true');
				await fireEvent.keyDown(group, { code: previousKey });
				expect(options[3]).toHaveFocus('true');
			});
		});
	});
});

describe('Props', () => {
	describe('horizontal', () => {
		it.each(cases)('Should turn the Navigation horizontal', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, { props: { horizontal: true } });
			const bindings = getAllByTestId('binding-selected');
			const group = getByTestId('radio');
			const options = getAllByTestId('radio-option');
			await fireEvent.keyDown(group, { code: 'ArrowRight' });
			expect(options[0]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowRight' });
			expect(options[1]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowLeft' });
			expect(options[0]).toHaveFocus();
		});

		it.each(cases)('Should be false by default (vertical)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const bindings = getAllByTestId('binding-selected');
			const group = getByTestId('radio');
			const options = getAllByTestId('radio-option');
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[0]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[1]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component);
			const bindings = getAllByTestId('binding-selected');
			const group = getByTestId('radio');
			const options = getAllByTestId('radio-option');
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[0]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowDown' });
			expect(options[1]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowUp' });
			expect(options[0]).toHaveFocus();
			await act(() => component.$set({ horizontal: true }));
			await fireEvent.keyDown(group, { code: 'ArrowRight' });
			expect(options[1]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowRight' });
			expect(options[2]).toHaveFocus();
			await fireEvent.keyDown(group, { code: 'ArrowLeft' });
			expect(options[1]).toHaveFocus();
		});
	});

	describe('value', () => {
		// Ichigo Kurosaki -> index 1
		it.each(cases)('Should set the initial RadioGroup value', (Component) => {
			const { getByTestId } = render(Component, { props: { value: 'Ichigo Kurosaki' } });
			const binding = getByTestId('binding-value-group');
			expect(binding).toHaveTextContent('Ichigo Kurosaki');
		});

		it.each(cases)(
			'Should change the initial checked RadioGroupOption if values match',
			(Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { value: 'Ichigo Kurosaki' }
				});
				const binding = getByTestId('binding-value-group');
				const options = getAllByTestId('radio-option');
				expect(binding).toHaveTextContent('Ichigo Kurosaki');
				expect(options[1].ariaChecked).toBe('true');
			}
		);

		// ? might change
		it.each(cases)('Should not be reactive (from parent to child)', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { value: 'Ichigo Kurosaki' }
			});
			const binding = getByTestId('binding-value-group');
			const options = getAllByTestId('radio-option');
			expect(binding).toHaveTextContent('Ichigo Kurosaki');
			expect(options[1].ariaChecked).toBe('true');
			await act(() => component.$set({ value: 'Vincent Law' }));
			expect(binding).toHaveTextContent('Ichigo Kurosaki');
			expect(options[1].ariaChecked).toBe('true');
		});

		it.each(cases)('Should be reactive (from child to parent)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { value: 'Ichigo Kurosaki' }
			});
			const globalBinding = getByTestId('binding-value-global');
			const binding = getByTestId('binding-value-group');
			const options = getAllByTestId('radio-option');
			expect(globalBinding).toHaveTextContent('Ichigo Kurosaki');
			expect(binding).toHaveTextContent('Ichigo Kurosaki');
			expect(options[1].ariaChecked).toBe('true');
			await fireEvent.click(options[3]);
			expect(globalBinding).toHaveTextContent('Naruto Uzumaki');
			expect(binding).toHaveTextContent('Naruto Uzumaki');
			expect(options[3].ariaChecked).toBe('true');
		});
	});
});

describe('Slot Props', () => {
	describe('isSelected', () => {
		it.each(cases)('Should expose the RadioGroupOption checked state', (Component) => {
			const { getAllByTestId } = render(Component);
			const bindings = getAllByTestId('binding-selected');
			for (let index = 0; index < 3; index++) {
				const binding = bindings[index];
				expect(binding).toHaveTextContent('false');
			}
			expect(bindings[4]).toHaveTextContent('true');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const bindings = getAllByTestId('binding-selected');
			const options = getAllByTestId('radio-option');
			await fireEvent.click(options[0]);
			expect(bindings[3]).toHaveTextContent('false');
			expect(bindings[0]).toHaveTextContent('true');
			await fireEvent.click(options[2]);
			expect(bindings[0]).toHaveTextContent('false');
			expect(bindings[2]).toHaveTextContent('true');
			await fireEvent.click(options[4]);
			expect(bindings[2]).toHaveTextContent('false');
			expect(bindings[4]).toHaveTextContent('true');
		});
	});

	describe('value', () => {
		it.each(cases)('Should expose the current value from the RadioGroup scope', (Component) => {
			const { getByTestId } = render(Component);
			const binding = getByTestId('binding-value-group');
			expect(binding).toHaveTextContent('Vincent Law');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const binding = getByTestId('binding-value-group');
			expect(binding).toHaveTextContent('Vincent Law');
			const options = getAllByTestId('radio-option');
			const values = getAllByTestId('option-value');
			for (let index = 0; index < options.length; index++) {
				const option = options[index];
				await fireEvent.click(option);
				const value = values[index].textContent;
				expect(binding).toHaveTextContent(value);
			}
		});
	});
});

describe('Rendering', () => {
	it('Should be rendered as a div by default', () => {
		const { getByTestId } = render(RadioGroup, { props: { 'data-testid': 'radio-group' } });
		const group = getByTestId('radio-group');
		expect(hasTagName(group, 'div')).toBe(true);
	});

	it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
		const { getByTestId } = render(RadioGroup, { props: { as, 'data-testid': 'radio-group' } });
		const group = getByTestId('radio-group');
		expect(hasTagName(group, as)).toBe(true);
	});

	it('Should be able of forwarding attributes', async () => {
		const attributes = { tabIndex: '4', title: 'an amazing radio-group' };
		const { getByTestId } = render(RadioGroup, {
			props: {
				...attributes,
				'data-testid': 'radio-group'
			}
		});
		const group = getByTestId('radio-group');
		const entriesAttributes = Object.entries(attributes);
		for (const [attr, value] of entriesAttributes) {
			expect(group).toHaveAttribute(attr, value);
		}
	});

	it('Should be able of forwarding actions', () => {
		const actions = generateActions(3);
		const { getByTestId } = render(RadioGroup, {
			props: { use: actions, 'data-testid': 'radio-group' }
		});
		const group = getByTestId('radio-group');
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
		}
	});

	describe.each([
		['Description', 'div'],
		['Option', 'div'],
		['Label', 'label']
	])('Radio%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const testid = 'radio-' + lowerCaseComponent;

		it(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testid);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} radio id`, async () => {
			const { getByTestId } = render(Rendering);
			const element = getByTestId(testid);
			expect(isValidComponentName(element, 'radio-group')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const element = getByTestId(testid);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forward attributes', async () => {
			const attributes = { title: `a radio ${lowerCaseComponent}` };
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

		it('Should be able to forward actions', async () => {
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
