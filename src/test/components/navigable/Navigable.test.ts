import '@testing-library/jest-dom';
import * as samples from './samples';
import { NavigableItem } from '$lib';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { ContextParent, generateActions, isValidComponentName } from '@test-utils';
import { elementTagNames } from '$lib/components/render';
import { createContextParentRenderer } from '@test-utils';

const cases = [samples.ActionComponent, samples.Component];
describe('Navigation', () => {
	it.each(cases)('Should be horizontal by default', async (Component) => {
		const { getAllByText, getByTestId } = render(Component);
		const elements = getAllByText(/Item/); // 5 elements
		const container = getByTestId('navigable');
		await fireEvent.keyDown(container, { code: 'ArrowRight' });
		expect(elements[0]).toHaveFocus();
		await fireEvent.keyDown(container, { code: 'ArrowRight' });
		expect(elements[1]).toHaveFocus();
		await fireEvent.keyDown(container, { code: 'ArrowLeft' });
		expect(elements[0]).toHaveFocus();
	});

	it.each(cases)('Should not be global by default', async (Component) => {
		render(Component);
		await fireEvent.keyDown(document, { code: 'ArrowRight' });
		expect(document.body).toHaveFocus();
		await fireEvent.keyDown(document, { code: 'ArrowLeft' });
		expect(document.body).toHaveFocus();
		await fireEvent.keyDown(document, { code: 'ArrowDown' });
		expect(document.body).toHaveFocus();
		await fireEvent.keyDown(document, { code: 'ArrowUp' });
		expect(document.body).toHaveFocus();
	});

	describe.each(['Global', 'Local'])('%s', (mode) => {
		const global = mode === 'Global';

		describe.each([
			['Horizontal', 'ArrowRight', 'ArrowLeft'],
			['Vertical', 'ArrowDown', 'ArrowUp']
		])('%s', (orientation, nextKey, previousKey) => {
			const vertical = orientation === 'Vertical';

			it.each(cases)(`Should focus the next Item by pressing ${nextKey}`, async (Component) => {
				const { getByTestId, getAllByText } = render(Component, { props: { global, vertical } });
				const target = global ? document : getByTestId('navigable');
				const items = getAllByText(/Item/);
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[0]).toHaveFocus();
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[1]).toHaveFocus();
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[2]).toHaveFocus();
			});

			it.each(cases)(`Should focus the previous Item by pressing ${nextKey}`, async (Component) => {
				const { getByTestId, getAllByText } = render(Component, { props: { global, vertical } });
				const target = global ? document : getByTestId('navigable');
				const items = getAllByText(/Item/);
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[5]).toHaveFocus();
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[4]).toHaveFocus();
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[3]).toHaveFocus();
			});

			it.each(cases)(
				`Should focus last element upon pressing ${nextKey} + CtrlKey`,
				async (Component) => {
					const { getAllByText, getByTestId } = render(Component, {
						props: { global, vertical }
					});
					const target = global ? document : getByTestId('navigable');
					const items = getAllByText(/Item/);
					await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
					expect(items[5]).toHaveFocus();
				}
			);

			it.each(cases)(
				`Should focus first element upon pressing ${previousKey} + CtrlKey`,
				async (Component) => {
					const { getAllByText, getByTestId } = render(Component, {
						props: { global, vertical }
					});
					const target = global ? document : getByTestId('navigable');

					const items = getAllByText(/Item/);
					await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
					expect(items[5]).toHaveFocus();
					await fireEvent.keyDown(target, { code: previousKey, ctrlKey: true });
					expect(items[0]).toHaveFocus();
				}
			);

			// * valid indexes = 1,3,5
			it.each(cases)(`Should skip disabled elements`, async (Component) => {
				const { getByTestId, getAllByText } = render(Component, {
					props: { disabled: true, global, vertical }
				});
				const target = global ? document : getByTestId('navigable');
				const items = getAllByText(/Item/);
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[5]).toHaveFocus();
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[3]).toHaveFocus();
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[1]).toHaveFocus();
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[3]).toHaveFocus();
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[5]).toHaveFocus();

				await fireEvent.keyDown(target, { code: previousKey, ctrlKey: true });
				expect(items[1]).toHaveFocus();

				await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
				expect(items[5]).toHaveFocus();

				if (global) return;

				await fireEvent.keyDown(target, { code: 'Home' });
				expect(items[1]).toHaveFocus();

				await fireEvent.keyDown(target, { code: 'End' });
				expect(items[5]).toHaveFocus();
			});

			it.each(cases)('Should be infinite by default', async (Component) => {
				const { getByTestId, getAllByText } = render(Component, {
					props: { disabled: true, global, vertical }
				});
				const target = global ? document : getByTestId('navigable');
				const items = getAllByText(/Item/);
				await fireEvent.keyDown(target, { code: previousKey });
				expect(items[5]).toHaveFocus();
				await fireEvent.keyDown(target, { code: nextKey });
				expect(items[1]).toHaveFocus();
			});

			if (global) {
				it.each(cases)(
					`Should not get stuck after pressing ${nextKey} twice if focus was on an external element`,
					async (Component) => {
						const { getAllByText, getByText } = render(Component, { props: { global, vertical } });
						const external = getByText('External Button');
						await act(() => external.focus());
						expect(external).toHaveFocus();

						const items = getAllByText(/Item/);
						await fireEvent.keyDown(document, { code: nextKey });
						expect(items[0]).toHaveFocus();
						await fireEvent.keyDown(document, { code: nextKey });
						expect(items[1]).toHaveFocus();
					}
				);

				it.each(cases)("Should ignore pressing 'Home' and 'End'", async (Component) => {
					render(Component, { props: { global, vertical } });
					await fireEvent.keyDown(document, { code: 'Home' });
					expect(document.body).toHaveFocus();
					await fireEvent.keyDown(document, { code: 'End' });
					expect(document.body).toHaveFocus();
				});
			} else {
				it.each(cases)('Should focus last element upon pressing End', async (Component) => {
					const { getAllByText, getByTestId } = render(Component, { props: { global, vertical } });
					const container = getByTestId('navigable');
					const items = getAllByText(/Item/);
					await fireEvent.keyDown(container, { code: 'End' });
					expect(items[5]).toHaveFocus();
				});

				it.each(cases)('Should focus first element upon pressing Home', async (Component) => {
					const { getAllByText, getByTestId } = render(Component, { props: { global, vertical } });
					const container = getByTestId('navigable');
					const items = getAllByText(/Item/);
					await fireEvent.keyDown(container, { code: 'End' });
					expect(items[5]).toHaveFocus();
					await fireEvent.keyDown(container, { code: 'Home' });
					expect(items[0]).toHaveFocus();
				});
			}

			it.each(cases)(
				'Should update the Navigation index if an element is focused externally',
				async (Component) => {
					const { getAllByText, getByTestId } = render(Component, { props: { global, vertical } });
					const container = getByTestId('navigable');
					const items = getAllByText(/Item/);
					await act(() => items[2].focus());
					await fireEvent.keyDown(container, { code: nextKey });
					expect(items[3]).toHaveFocus();
					await act(() => items[4].focus());
					expect(items[4]).toHaveFocus();
					await fireEvent.keyDown(container, { code: previousKey });
					expect(items[3]).toHaveFocus();
				}
			);
		});
	});
});

describe('Props', () => {
	describe('Finite', () => {
		it.each(cases)('Should turn the navigation finite', async (Component) => {
			const { getAllByText, getByTestId } = render(Component, { props: { finite: true } });
			const container = getByTestId('navigable');
			const items = getAllByText(/Item/);
			await fireEvent.keyDown(container, { code: 'ArrowLeft' });
			expect(items[5]).not.toHaveFocus();
			await fireEvent.keyDown(container, { code: 'End' });
			expect(items[5]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[5]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByText, getByTestId } = render(Component, {
				props: { finite: true }
			});
			const container = getByTestId('navigable');
			const items = getAllByText(/Item/);
			await fireEvent.keyDown(container, { code: 'ArrowLeft' });
			expect(items[5]).not.toHaveFocus();
			await fireEvent.keyDown(container, { code: 'End' });
			expect(items[5]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[5]).toHaveFocus();
			await act(() => component.$set({ finite: false }));
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowLeft' });
			expect(items[5]).toHaveFocus();
		});
	});

	describe('Global', () => {
		it.each(cases)('Should set the navigation listener on the window', async (Component) => {
			const { getAllByText } = render(Component, { props: { global: true } });
			const items = getAllByText(/Item/);
			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(document, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByText, getByTestId } = render(Component, {
				props: { global: true }
			});
			const items = getAllByText(/Item/);
			const container = getByTestId('navigable');
			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await act(() => component.$set({ global: false }));
			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[2]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[3]).toHaveFocus();
		});
	});

	describe('Vertical', () => {
		it.each(cases)('Should navigate by pressing only ArrowDown and ArrowUp', async (Component) => {
			const { getAllByText, getByTestId } = render(Component, { props: { vertical: true } });
			const items = getAllByText(/Item/);
			const container = getByTestId('navigable');
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[0]).not.toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowDown' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowUp' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByText, getByTestId } = render(Component, {
				props: { vertical: true }
			});
			const items = getAllByText(/Item/);
			const container = getByTestId('navigable');
			await fireEvent.keyDown(container, { code: 'ArrowUp' });
			expect(items[5]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();
			await act(() => component.$set({ vertical: false }));
			await fireEvent.keyDown(container, { code: 'ArrowUp' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(container, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();
		});
	});
});

// const { ActionComponent, Behaviour, DisabledNavigation } = samples;
// 	describe.skip('Attributes', () => {
// 		describe.skip('Item', () => {
// 			const { Item } = samples;

// 			function initItem(
// 				props: {
// 					disabled?: Nullable<boolean>;
// 					tabIndex?: Nullable<number>;
// 					target?: 'ACTION' | 'COMPONENT';
// 					handleClick?: (event: MouseEvent) => void;
// 				} = {}
// 			) {
// 				const result = render(Item, { props });
// 				return { ...result, root: result.getByTestId('root'), item: result.getByText('Item') };
// 			}

// 			describe.skip('tabIndex', () => {
// 				describe.skip.each(['Action Component', 'Component'])('%s', (mode) => {
// 					const target = mode === 'Component' ? 'COMPONENT' : 'ACTION';

// 					it.skip('Should have tabIndex set to 0 by default', async () => {
// 						const { item } = initItem({ target });
// 						expect(item).toHaveAttribute('tabIndex', '0');
// 					});

// 					it.skip('Should not be set if the element is disabled', async () => {
// 						const { item } = initItem({ disabled: true, target });
// 						await waitFor(() => expect(item).not.toHaveAttribute('tabIndex'));
// 					});

// 					it.skip('Should be reactive and be toggled when the element is disabled', async () => {
// 						const { component, item } = initItem({ tabIndex: 3, target });
// 						expect(item).toHaveAttribute('tabIndex', '3');

// 						await act(() => component.$set({ disabled: true }));
// 						expect(item).not.toHaveAttribute('tabIndex');

// 						await act(() => component.$set({ disabled: false }));
// 						expect(item).toHaveAttribute('tabIndex', '3');
// 					});

// 					it.skip('Should be kept before being disabled and reapplied when the element is enabled again', async () => {
// 						const { component, item } = initItem({ tabIndex: 0, target });
// 						expect(item).toHaveAttribute('tabIndex', '0');

// 						await act(() => component.$set({ disabled: true }));
// 						expect(item).not.toHaveAttribute('tabIndex');

// 						await act(() => component.$set({ disabled: false }));
// 						expect(item).toHaveAttribute('tabIndex', '0');

// 						await act(() => component.$set({ tabIndex: '3' }));
// 						expect(item).toHaveAttribute('tabIndex', '3');

// 						await act(() => component.$set({ disabled: true }));
// 						await waitFor(() => expect(item).not.toHaveAttribute('tabIndex'));
// 					});
// 				});
// 			});

// 			it.skip('Should be able of forwarding click events', async () => {
// 				const func = vi.fn<[MouseEvent]>(() => {});
// 				const { item } = initItem({ handleClick: func });
// 				await fireEvent.click(item);
// 				expect(func).toBeCalled();
// 				expect(func.mock.lastCall?.[0]).toBeInstanceOf(MouseEvent);
// 			});
// 		});
// 	});
// });

const { Rendering } = samples;
describe('Rendering', () => {
	describe.each([
		['Navigable', 'div'],
		['Item', 'div']
	])('%s', (name, defaultTag) => {
		const COMPONENT_NAME = name.toLowerCase();
		const TEST_ID = `navigable-${COMPONENT_NAME}`;

		it(`Should be rendered as a ${defaultTag} by default`, async () => {
			const { getByTestId } = render(Rendering, {
				props: { [COMPONENT_NAME]: { as: defaultTag, 'data-testid': TEST_ID } }
			});
			const element = getByTestId(TEST_ID);
			expect(hasTagName(element, 'div')).toBe(true);
		});

		it(`Should have a valid ${name} Navigable id`, () => {
			const { getByTestId } = render(Rendering, {
				props: { [COMPONENT_NAME]: { 'data-testid': TEST_ID } }
			});
			const element = getByTestId(TEST_ID);
			expect(isValidComponentName(element, 'navigable'));
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
			const { getByTestId } = render(Rendering, {
				props: { [COMPONENT_NAME]: { as, 'data-testid': TEST_ID } }
			});
			const element = getByTestId(TEST_ID);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', () => {
			const attributes = { tabIndex: '4', title: 'a navigable element' };
			const { getByTestId } = render(Rendering, {
				props: { [COMPONENT_NAME]: { 'data-testid': TEST_ID, rest: { ...attributes } } }
			});
			const element = getByTestId(TEST_ID);
			const entriesAttributes = Object.entries(attributes);
			for (const [attribute, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attribute, value);
			}
		});

		it('Should be able of forwarding actions', () => {
			const actions = generateActions(3);
			const { getByTestId } = render(Rendering, {
				props: { [COMPONENT_NAME]: { 'data-testid': TEST_ID, use: actions } }
			});
			const element = getByTestId(TEST_ID);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Context', () => {
	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'navigable');

	describe('Unset Context', () => {
		describe('Item', () => {
			it('Should throw an error if rendered without a Navigable Context', () => {
				expect(() => render(NavigableItem)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(NavigableItem)).toThrow(messages.unset);
			});
		});
	});

	describe('Invalid Context', () => {
		describe('Item', () => {
			it('Should throw an error if rendered with an invalid Navigable Context', () => {
				expect(() => init(NavigableItem, { initItem: null })).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(NavigableItem, { initItem: null })).toThrow(messages.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() => init(NavigableItem, { createNavigableItem: 'Not a Function' })).toThrow(
					messages.invalid
				);
				// // TODO: HANDLE FUNCTION ERROR
				// expect(() => init(NavigableItem, { createNavigableItem: () => "We do a litTle trolling" })).toThrow(messages.invalid);
			});
		});
	});
});
