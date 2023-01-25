import '@testing-library/jest-dom';
import * as samples from './samples';
import type { SvelteComponent } from 'svelte';
import type { Readable } from 'svelte/store';
import { type ContextKeys, NavigableItem } from '$lib/components/navigable';
import { act, fireEvent, render, waitFor } from '@testing-library/svelte';
import { elementTagNames } from '$lib/components/render';
import { hasTagName } from '$lib/predicate';
import {
	ContextParent,
	createContextParentRenderer,
	generateActions,
	isValidComponentName
} from '@test-utils';
import type { Nullable } from '$lib/types';

function initComponent(
	Component: typeof SvelteComponent,
	props: {
		finite?: Readable<boolean> | boolean;
		global?: Readable<boolean> | boolean;
		vertical?: Readable<boolean> | boolean;
	} = {}
) {
	const result = render(Component, { props });
	const external = {
		button: result.getByText('External Button'),
		container: result.getByText('External Container')
	};

	const root = result.getByTestId('root');
	const items = result.getAllByText(/Item/);
	return { ...result, external, root, items };
}

const { ActionComponent, Behaviour, DisabledNavigation } = samples;
describe('Behaviour', () => {
	describe('Navigation', () => {
		it('Should be horizontal by default', async () => {
			const { root, items } = initComponent(Behaviour);

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(document.activeElement).toBe(document.body);

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(document.activeElement).toBe(document.body);

			await fireEvent.keyDown(root, { code: 'ArrowLeft' });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
		});

		it('Should be local by default', async () => {
			const { root, items } = initComponent(Behaviour);

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowLeft' });
			expect(items[1]).toHaveFocus();
		});

		describe.each(['Global', 'Local'])('%s', (mode) => {
			const global = mode === 'Global';

			describe.each([
				['Horizontal', 'ArrowRight', 'ArrowLeft'],
				['Vertical', 'ArrowDown', 'ArrowUp']
			])('%s', (orientation, nextKey, previousKey) => {
				const vertical = orientation === 'Vertical';

				it(`Should focus the next Item by pressing ${nextKey}`, async () => {
					const { root, items } = initComponent(Behaviour, { global, vertical });
					const target = global ? document : root;

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[0]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[1]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[2]).toHaveFocus();
				});

				it(`Should focus the previous Item by pressing ${previousKey}`, async () => {
					const { root, items } = initComponent(Behaviour, { global, vertical });
					const target = global ? document : root;

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[2]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[1]).toHaveFocus();
				});

				// * VALID ITEMS INDEXES --> 1, 3, 5
				it('Should skip disabled Items', async () => {
					const { root, items } = initComponent(DisabledNavigation, { global, vertical });
					const target = global ? document : root;

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[1]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[5]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[1]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
					expect(items[5]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey, ctrlKey: true });
					expect(items[1]).toHaveFocus();

					if (global) return;

					await fireEvent.keyDown(target, { code: 'End' });
					expect(items[5]).toHaveFocus();

					await fireEvent.keyDown(target, { code: 'Home' });
					expect(items[1]).toHaveFocus();
				});

				it('Should be infinite', async () => {
					const { root, items } = initComponent(Behaviour, { global, vertical });
					const target = global ? document : root;

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[0]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[0]).toHaveFocus();
				});

				if (global) {
					it(`Should not get stuck after pressing ${nextKey} twice if focus was on an external element`, async () => {
						const { items, external } = initComponent(Behaviour, { global, vertical });
						await act(() => external.button.focus());
						expect(external.button).toHaveFocus();

						await fireEvent.keyDown(document, { code: nextKey });
						expect(items[0]).toHaveFocus();

						await fireEvent.keyDown(document, { code: nextKey });
						expect(items[1]).toHaveFocus();
					});

					it(`Should focus the last Item upon pressing ctrlKey + ${nextKey}`, async () => {
						const { items } = initComponent(Behaviour, { global, vertical });

						await fireEvent.keyDown(document, { code: nextKey, ctrlKey: true });
						expect(items[3]).toHaveFocus();
					});

					it('Should ignore pressing End', async () => {
						const { items } = initComponent(Behaviour, { global, vertical });

						await fireEvent.keyDown(document, { code: 'End', ctrlKey: true });
						expect(items[3]).not.toHaveFocus();
						expect(document.body).toHaveFocus();
					});

					it(`Should focus the first Item upon pressing ctrlKey + ${previousKey}`, async () => {
						const { items } = initComponent(Behaviour, { global, vertical });

						await fireEvent.keyDown(document, { code: nextKey, ctrlKey: true });
						expect(items[3]).toHaveFocus();

						await fireEvent.keyDown(document, { code: previousKey, ctrlKey: true });
						expect(items[0]).toHaveFocus();
					});

					it('Should ignore pressing Home', async () => {
						const { items } = initComponent(Behaviour, { global, vertical });

						await fireEvent.keyDown(document, { code: 'Home', ctrlKey: true });
						expect(items[0]).not.toHaveFocus();
						expect(document.body).toHaveFocus();
					});
				} else {
					it(`Should focus the last Item upon pressing End or ctrlKey + ${nextKey}`, async () => {
						const { root, items } = initComponent(Behaviour, { global, vertical });
						const target = global ? document : root;

						await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
						expect(items[3]).toHaveFocus();

						await fireEvent.keyDown(target, { code: 'Home' });
						expect(items[0]).toHaveFocus();

						await fireEvent.keyDown(target, { code: 'End' });
						expect(items[3]).toHaveFocus();
					});

					it(`Should focus the first Item upon pressing Home or ctrlKey + ${previousKey}`, async () => {
						const { root, items } = initComponent(Behaviour, { vertical });

						await fireEvent.keyDown(root, { code: 'End' });
						expect(items[3]).toHaveFocus();

						await fireEvent.keyDown(root, { code: previousKey, ctrlKey: true });
						expect(items[0]).toHaveFocus();

						await fireEvent.keyDown(root, { code: 'End' });
						expect(items[3]).toHaveFocus();

						await fireEvent.keyDown(root, { code: 'Home' });
						expect(items[0]).toHaveFocus();
					});
				}

				it('Should sync the Navigation if any of the Items are focused externally', async () => {
					const { root, items } = initComponent(Behaviour, { global, vertical });

					const target = global ? document : root;

					await act(() => items[0].focus());
					expect(items[0]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[1]).toHaveFocus();

					await act(() => items[3].focus());
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[0]).toHaveFocus();
				});

				it('Should work rendered as an Action Component / Slot Component', async () => {
					const { items, root } = initComponent(ActionComponent, { global, vertical });
					const target = global ? document : root;

					await fireEvent.keyDown(target, { code: nextKey });
					expect(items[0]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey });
					expect(items[3]).toHaveFocus();

					await fireEvent.keyDown(target, { code: previousKey, ctrlKey: true });
					expect(items[0]).toHaveFocus();

					await fireEvent.keyDown(target, { code: nextKey, ctrlKey: true });
					expect(items[3]).toHaveFocus();
				});
			});
		});
	});

	describe('Attributes', () => {
		describe('Item', () => {
			const { Item } = samples;

			function initItem(
				props: {
					disabled?: Nullable<boolean>;
					tabIndex?: Nullable<number>;
					target?: 'ACTION' | 'COMPONENT';
					handleClick?: (event: MouseEvent) => void;
				} = {}
			) {
				const result = render(Item, { props });
				return { ...result, root: result.getByTestId('root'), item: result.getByText('Item') };
			}

			describe('tabIndex', () => {
				describe.each(['Action Component', 'Component'])('%s', (mode) => {
					const target = mode === 'Component' ? 'COMPONENT' : 'ACTION';

					it('Should have tabIndex set to 0 by default', async () => {
						const { item } = initItem({ target });
						expect(item).toHaveAttribute('tabIndex', '0');
					});

					it('Should not be set if the element is disabled', async () => {
						const { item } = initItem({ disabled: true, target });
						await waitFor(() => expect(item).not.toHaveAttribute('tabIndex'));
					});

					it('Should be reactive and be toggled when the element is disabled', async () => {
						const { component, item } = initItem({ tabIndex: 3, target });
						expect(item).toHaveAttribute('tabIndex', '3');

						await act(() => component.$set({ disabled: true }));
						expect(item).not.toHaveAttribute('tabIndex');

						await act(() => component.$set({ disabled: false }));
						expect(item).toHaveAttribute('tabIndex', '3');
					});

					it('Should be kept before being disabled and reapplied when the element is enabled again', async () => {
						const { component, item } = initItem({ tabIndex: 0, target });
						expect(item).toHaveAttribute('tabIndex', '0');

						await act(() => component.$set({ disabled: true }));
						expect(item).not.toHaveAttribute('tabIndex');

						await act(() => component.$set({ disabled: false }));
						expect(item).toHaveAttribute('tabIndex', '0');

						await act(() => component.$set({ tabIndex: '3' }));
						expect(item).toHaveAttribute('tabIndex', '3');

						await act(() => component.$set({ disabled: true }));
						await waitFor(() => expect(item).not.toHaveAttribute('tabIndex'));
					});
				});
			});

			it('Should be able of forwarding click events', async () => {
				const func = vi.fn<[MouseEvent]>(() => {});
				const { item } = initItem({ handleClick: func });
				await fireEvent.click(item);
				expect(func).toBeCalled();
				expect(func.mock.lastCall?.[0]).toBeInstanceOf(MouseEvent);
			});
		});
	});
});

const { Events } = samples;
describe('Events', () => {
	function initComponent(props: {
		handleBlur: (event: FocusEvent) => void;
		handleClick?: (event: MouseEvent) => void;
		handleFocus: (event: FocusEvent) => void;
	}) {
		const result = render(Events, { props });
		return { ...result, element: result.getByText('Item') };
	}

	it('Should be able of forwarding a blur listener', async () => {
		const handleBlur = vi.fn<[FocusEvent]>(() => {});
		// @ts-ignore
		const { element } = initComponent({ handleBlur });
		await act(() => element.focus());
		await act(() => element.blur());
		expect(handleBlur).toBeCalledTimes(1);

		await act(() => element.focus());
		await act(() => element.blur());
		expect(handleBlur).toBeCalledTimes(2);
		expect(handleBlur.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
	});

	it('Should be able of forwarding a click listener', async () => {
		const handleClick = vi.fn<[MouseEvent]>(() => {});
		// @ts-ignore
		const { element } = initComponent({ handleClick });
		await fireEvent.click(element);
		expect(handleClick).toBeCalledTimes(1);

		await fireEvent.click(element);
		expect(handleClick).toBeCalledTimes(2);
		expect(handleClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
	});

	it('Should be able of forwarding a focus listener', async () => {
		const handleFocus = vi.fn<[FocusEvent]>(() => {});
		// @ts-ignore
		const { element } = initComponent({ handleFocus });
		await act(() => element.focus());
		expect(handleFocus).toBeCalledTimes(1);

		await act(() => element.blur());

		await act(() => element.focus());
		expect(handleFocus).toBeCalledTimes(2);
		expect(handleFocus.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
	});
});

describe('Props', () => {
	describe('Finite', () => {
		it('Should make the navigation finite', async () => {
			const { root, items } = initComponent(Behaviour, { finite: true });

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'End' });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[3]).toHaveFocus();
		});

		it('Should be false by default', async () => {
			const { root, items } = initComponent(Behaviour);

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowLeft' });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();
		});

		it('Should be reactive', async () => {
			const { component, root, items } = initComponent(Behaviour, { finite: true });

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowLeft' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'End' });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[3]).toHaveFocus();

			await act(() => component.$set({ finite: false }));

			await fireEvent.keyDown(root, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowLeft' });
			expect(items[3]).toHaveFocus();
		});

		it('Should work propertly with Global and Vertical navigation', async () => {
			const { items } = initComponent(Behaviour, { finite: true, global: true, vertical: true });

			await fireEvent.keyDown(document, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowUp' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowDown', ctrlKey: true });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowDown' });
			expect(items[3]).toHaveFocus();
		});
	});

	describe('Global', () => {
		it('Should allow the navigation to be triggered without having to focus the Navigable element', async () => {
			const { items } = initComponent(Behaviour, { global: true });

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowRight', ctrlKey: true });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowLeft', ctrlKey: true });
			expect(items[0]).toHaveFocus();
		});

		it('Should be false by default', async () => {
			const { items } = initComponent(Behaviour);

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[0]).not.toHaveFocus();
			expect(document.body).toHaveFocus();
		});

		it('Should be reactive', async () => {
			const { component, items } = initComponent(Behaviour, { global: true });

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();

			await act(() => component.$set({ global: false }));

			await fireEvent.keyDown(document, { code: 'ArrowRight' });
			expect(items[1]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowLeft' });
			expect(items[1]).toHaveFocus();

			await act(() => component.$set({ global: true }));

			await fireEvent.keyDown(document, { code: 'ArrowRight', ctrlKey: true });
			expect(items[3]).toHaveFocus();

			await fireEvent.keyDown(document, { code: 'ArrowLeft', ctrlKey: true });
			expect(items[0]).toHaveFocus();
		});
	});

	describe('Vertical', () => {
		it('Should make the navigation move with the ArrowUp and ArrowDown keys', async () => {
			const { root, items } = initComponent(Behaviour, { vertical: true });

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(items[1]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(items[3]).toHaveFocus();
		});

		it('Should be false by default', async () => {
			const { root, items } = initComponent(Behaviour);

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(items[0]).not.toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(items[3]).not.toHaveFocus();
		});

		it('Should be reactive', async () => {
			const { component, root, items } = initComponent(Behaviour);

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(items[0]).not.toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(items[3]).not.toHaveFocus();

			await act(() => component.$set({ vertical: true }));

			await fireEvent.keyDown(root, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();

			await fireEvent.keyDown(root, { code: 'ArrowUp' });
			expect(items[3]).toHaveFocus();
		});
	});
});

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
			for (const [action, parameter] of actions) {
				expect(action).toBeCalledWith(element, parameter);
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
				expect(() => init(NavigableItem, { initItem: 'Not a Function' })).toThrow(messages.invalid);
				// TODO: HANDLE FUNCTION ERROR
				// expect(() => init(NavigableItem, { initItem: () => "We do a litTle trolling" })).toThrow(messages.invalid);
			});
		});
	});
});
