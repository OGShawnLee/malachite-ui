import '@testing-library/jest-dom';
import * as samples from './samples';
import { Accordion, AccordionButton, AccordionHeader, AccordionItem, AccordionPanel } from '$lib';
import { act, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { ContextParent, generateActions, isValidComponentName } from '@test-utils';
import { elementTagNames } from '$lib/components/render';
import { createContextParentRenderer } from '@test-utils';
import { getContextKey } from '$lib/hooks';

const cases = [samples.ActionComponent, samples.Component, samples.FragmentComponent];
describe('Attributes', () => {
	describe('accordion-button', () => {
		describe('aria-controls', () => {
			it.each(cases)('Should not be set by default', (Component) => {
				const { getAllByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for (const button of buttons) expect(button).not.toHaveAttribute('aria-controls');
			});

			it.each(cases)(
				'Should point to its accordion-panel when its accordion-item state is open',
				async (Component) => {
					const { getAllByTestId, getByTestId } = render(Component);
					const buttons = getAllByTestId('accordion-button');
					for await (const button of buttons) {
						await fireEvent.click(button);
						const panel = getByTestId('accordion-panel');
						expect(button).toHaveAttribute('aria-controls', panel.id);
					}
				}
			);

			it.each(cases)('Should be based on its accordion-panel render state', async (Component) => {
				const { component, getAllByTestId, getByTestId } = render(Component, {
					props: { isShowingPanel: false }
				});
				const button = getAllByTestId('accordion-button')[0];
				expect(button).not.toHaveAttribute('aria-controls');
				await fireEvent.click(button);
				expect(button).not.toHaveAttribute('aria-controls');
				await act(() => component.$set({ isShowingPanel: true }));
				const panel = getByTestId('accordion-panel');
				expect(button).toHaveAttribute('aria-controls', panel.id);
			});
		});

		describe('aria-disabled', () => {
			it.each(cases)('Should be false by default', (Component) => {
				const { getAllByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for (const button of buttons) {
					expect(button.ariaDisabled).toBe('false');
				}
			});

			it.each(cases)('Should be true when item is disabled', (Component) => {
				const { getAllByTestId } = render(Component, { props: { disabled: true } });
				const buttons = getAllByTestId('accordion-button');
				expect(buttons[0].ariaDisabled).toBe('true');
				expect(buttons[2].ariaDisabled).toBe('true');
				expect(buttons[4].ariaDisabled).toBe('true');
			});

			it('Should be reactive', async () => {
				const { component, getAllByTestId } = render(samples.Component, {
					props: { disabled: true }
				});
				const buttons = getAllByTestId('accordion-button');
				expect(buttons[0].ariaDisabled).toBe('true');
				expect(buttons[2].ariaDisabled).toBe('true');
				expect(buttons[4].ariaDisabled).toBe('true');
				await act(() => component.$set({ disabled: false }));
				for (const button of buttons) {
					expect(button.ariaDisabled).toBe('false');
				}
			});
		});

		describe('aria-expanded', () => {
			it.each(cases)('Should be false by default', (Component) => {
				const { getAllByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for (const button of buttons) expect(button.ariaExpanded).toBe('false');
			});

			it.each(cases)('Should be true when its accordion-item is open', async (Component) => {
				const { getAllByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for await (const button of buttons) {
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
				}
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { getAllByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for await (const button of buttons) {
					expect(button.ariaExpanded).toBe('false');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('true');
					await fireEvent.click(button);
					expect(button.ariaExpanded).toBe('false');
				}
			});
		});
	});

	describe('accordion-panel', () => {
		it.each(cases)(
			'Should have aria-labelledby set to its accordion-button id',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for await (const button of buttons) {
					await fireEvent.click(button);
					const panel = getByTestId('accordion-panel');
					expect(panel).toHaveAttribute('aria-labelledby', button.id);
				}
			}
		);

		it.each(cases)('Should have role set to "region"', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const buttons = getAllByTestId('accordion-button');
			for await (const button of buttons) {
				await fireEvent.click(button);
				const panel = getByTestId('accordion-panel');
				expect(panel.role).toBe('region');
			}
		});
	});
});

describe('Behaviour', () => {
	it.each(cases)('Should not render any accordion-panel by default', (Component) => {
		const { getAllByTestId, getByTestId } = render(Component);
		expect(() => getAllByTestId('accordion-panel')).toThrow();
	});

	describe('accordion-button', () => {
		it.each(cases)('Should toggle its accordion-item state by clicking it', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const buttons = getAllByTestId('accordion-button');
			for await (const button of buttons) {
				await fireEvent.click(button);
				const panel = getByTestId('accordion-panel');
				expect(button).toHaveAttribute('aria-controls', panel.id);
				expect(button.ariaExpanded).toBe('true');
				expect(panel).toHaveAttribute('aria-labelledby', button.id);
				await fireEvent.click(button);
				expect(button).not.toHaveAttribute('aria-controls');
				expect(button.ariaExpanded).toBe('false');
				expect(panel).not.toBeInTheDocument();
			}
		});
	});

	describe('Navigation', () => {
		it.each(cases)('Should be infinite by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
		});

		it.each(cases)('Should be vertical', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
		});

		it.each(cases)(
			'Should focus the next accordion-button by pressing ArrowDown',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
				expect(buttons[0]).toHaveFocus();
				await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
				expect(buttons[1]).toHaveFocus();
				await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
				expect(buttons[2]).toHaveFocus();
			}
		);

		it.each(cases)(
			'Should focus the previous accordion-button by pressing ArrowUp',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
				expect(buttons[4]).toHaveFocus();
				await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
				expect(buttons[3]).toHaveFocus();
				await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
				expect(buttons[2]).toHaveFocus();
			}
		);

		it.each(cases)('Should focus the first accordion-item by pressing Home', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(buttons[0]).toHaveFocus();
		});

		it.each(cases)(
			'Should focus the first accordion-item by ArrowUp + ctrlKey',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				await fireEvent.keyDown(accordion, { code: 'End' });
				expect(buttons[4]).toHaveFocus();
				await fireEvent.keyDown(accordion, { code: 'ArrowUp', ctrlKey: true });
				expect(buttons[0]).toHaveFocus();
			}
		);

		it.each(cases)('Should focus the last accordion-item by pressing End', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[4]).toHaveFocus();
		});

		it.each(cases)(
			'Should focus the last accordion-item by pressing ArrowDown + ctrlKey',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				await fireEvent.keyDown(accordion, { code: 'ArrowDown', ctrlKey: true });
				expect(buttons[4]).toHaveFocus();
			}
		);

		it.each(cases)(
			'Should sync navigation when an accordion-item is focused externally',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				await act(() => buttons[3].focus());
				await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
				expect(buttons[4]).toHaveFocus();
			}
		);

		// * valid indexes: 1/3
		it.each(cases)('Should disabled accordion-items', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { disabled: true }
			});
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[1]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[3]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[1]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[3]).toHaveFocus();
		});
	});
});

describe('Props', () => {
	describe('disabled', () => {
		it.each(cases)('Should disable navigation', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { noNavigation: true }
			});
			const accordion = getByTestId('accordion-container');
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(document.body).toHaveFocus();
		});

		it.each(cases)('Should be false by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const items = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(items[1]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(items[0]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { noNavigation: true }
			});
			const accordion = getByTestId('accordion-container');
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(document.body).toHaveFocus();

			await act(() => component.$set({ noNavigation: false }));
			const items = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(items[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(items[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(items[3]).toHaveFocus();
		});
	});

	describe('finite', () => {
		it.each(cases)('Should turn the navigation finite', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { finite: true }
			});
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(buttons[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();
		});

		it.each(cases)('Should be false by default (infinite)', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[4]).toHaveFocus();
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { finite: true }
			});
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'End' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[4]).toHaveFocus();

			await act(() => component.$set({ finite: false }));

			await fireEvent.keyDown(accordion, { code: 'Home' });
			expect(buttons[0]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowUp' });
			expect(buttons[4]).toHaveFocus();
			await fireEvent.keyDown(accordion, { code: 'ArrowDown' });
			expect(buttons[0]).toHaveFocus();
		});
	});

	describe('unique', () => {
		it.each(cases)('Should allow only open panel at a time', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component, {
				props: { unique: true }
			});
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			for (const button of buttons) {
				await fireEvent.click(button);
				const panels = getAllByTestId('accordion-panel');
				expect(panels).toHaveLength(1);
			}
		});

		it.each(cases)('Should be true by default', async (Component) => {
			const { getAllByTestId, getByTestId } = render(Component);
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			for (const button of buttons) {
				await fireEvent.click(button);
				const panels = getAllByTestId('accordion-panel');
				expect(panels).toHaveLength(1);
			}
		});

		it.each(cases)(
			'Should allow multiple open accordion-items when set to false',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component, {
					props: { unique: false }
				});
				const accordion = getByTestId('accordion-container');
				const buttons = getAllByTestId('accordion-button');
				for (const button of buttons) await fireEvent.click(button);
				const panels = getAllByTestId('accordion-panel');
				expect(panels).toHaveLength(5);
			}
		);

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getAllByTestId, getByTestId } = render(Component, {
				props: { unique: false }
			});
			const accordion = getByTestId('accordion-container');
			const buttons = getAllByTestId('accordion-button');
			for (const button of buttons) await fireEvent.click(button);
			let panels = getAllByTestId('accordion-panel');
			expect(panels).toHaveLength(5);

			await act(() => component.$set({ unique: true }));

			for (const button of buttons) await fireEvent.click(button);
			for (const button of buttons) await fireEvent.click(button);
			panels = getAllByTestId('accordion-panel');
			expect(panels).toHaveLength(1);
		});
	});
});

describe('Slot Props', () => {
	describe('close', () => {
		it.each(cases)(
			'Should expose the close function from accordion-item and accordion-panel scope',
			async (Component) => {
				const { getAllByTestId, getByTestId } = render(Component);
				const buttons = getAllByTestId('accordion-button');
				for (const button of buttons) {
					await fireEvent.click(button);
					const panel = getByTestId('accordion-panel');
					const closeButton = getByTestId('button-close');
					await fireEvent.click(closeButton);
					expect(panel).not.toBeInTheDocument();
				}
			}
		);
	});

	describe('isDisabled', () => {
		it('Should expose the accordion-button disabled state', () => {
			const { getAllByTestId } = render(samples.Component, { props: { disabled: true } });
			const bindings = getAllByTestId('binding-disabled');
			expect(bindings[0]).toHaveTextContent('true');
			expect(bindings[1]).toHaveTextContent('false');
			expect(bindings[2]).toHaveTextContent('true');
			expect(bindings[3]).toHaveTextContent('false');
			expect(bindings[4]).toHaveTextContent('true');
		});

		it('Should be reactive', async () => {
			const { component, getAllByTestId } = render(samples.Component);
			const bindings = getAllByTestId('binding-disabled');
			for (const binding of bindings) expect(binding).toHaveTextContent('false');
			await act(() => component.$set({ disabled: true }));
			expect(bindings[0]).toHaveTextContent('true');
			expect(bindings[1]).toHaveTextContent('false');
			expect(bindings[2]).toHaveTextContent('true');
			expect(bindings[3]).toHaveTextContent('false');
			expect(bindings[4]).toHaveTextContent('true');
		});
	});

	describe('isOpen', () => {
		it.each(cases)('Should expose the accordion-item open state', (Component) => {
			const { getAllByTestId } = render(Component);
			const bindings = getAllByTestId('binding-open-item');
			for (const binding of bindings) {
				expect(binding).toHaveTextContent('false');
			}
		});

		it.each(cases)('Should be exposed from the accordion-button scope', (Component) => {
			const { getAllByTestId } = render(Component);
			const bindings = getAllByTestId('binding-open-button');
			for (const binding of bindings) {
				expect(binding).toHaveTextContent('false');
			}
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { getAllByTestId } = render(Component);
			const buttons = getAllByTestId('accordion-button');
			const bindings = getAllByTestId('binding-open-button');
			for (let index = 0; index < buttons.length; index++) {
				const button = buttons[index];
				const binding = bindings[index];
				expect(binding).toHaveTextContent('false');
				await fireEvent.click(button);
				expect(binding).toHaveTextContent('true');
			}
		});
	});
});

const { Rendering } = samples;
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
		const attributes = { title: 'an accordion root' };
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
		for (const action of actions) {
			expect(action).toBeCalledWith(group);
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
			const button = getByTestId('button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			expect(hasTagName(element, defaultTag));
		});

		it(`Should have a valid ${lowerCaseComponent} accordion id`, async () => {
			const { getByTestId } = render(Rendering);
			const button = getByTestId('button');
			await fireEvent.click(button);
			const element = getByTestId(testId);

			if (lowerCaseComponent === 'item') return;

			expect(isValidComponentName(element, 'accordion', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByTestId } = render(Rendering, { props: { [lowerCaseComponent]: { as } } });
			const button = getByTestId('button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			expect(hasTagName(element, as)).toBe(true);
		});

		it('Should be able of forwarding attributes', async () => {
			const attributes = { title: `an accordion ${lowerCaseComponent}` };
			const { getByTestId } = render(Rendering, {
				props: {
					[lowerCaseComponent]: { rest: attributes }
				}
			});

			const button = getByTestId('button');
			await fireEvent.click(button);
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

			const button = getByTestId('button');
			await fireEvent.click(button);
			const element = getByTestId(testId);
			for (const action of actions) {
				expect(action).toBeCalledWith(element);
			}
		});
	});
});

describe('Context', () => {
	describe('Unset Context', () => {
		describe('Item', () => {
			it('Should throw if rendered without an Accordion Context', () => {
				expect(() => render(AccordionItem)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(AccordionItem)).toThrow(
					`Unable to Find ${getContextKey('accordion')} Context. Did you set it?`
				);
			});
		});

		interface ContextKeys {
			isOpen: any;
			button: any;
			close: any;
			panel: any;
			createAccordionButton: any;
			createAccordionHeading: any;
			createAccordionPanel: any;
		}

		const [init, message] = createContextParentRenderer<ContextKeys>(
			ContextParent,
			'accordion-item'
		);

		describe.each([
			['Header', AccordionHeader],
			['Button', AccordionButton],
			['Panel', AccordionPanel]
		])('%', (name, Component) => {
			it('Should throw if rendered without an AccordionItem Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => render(Component)).toThrow(message.unset);
			});
		});

		describe.each([
			['Header', AccordionHeader],
			['Button', AccordionButton],
			['Panel', AccordionPanel]
		])('%', (name, Component) => {
			it('Should throw an error if rendered with an invalid Accordion Context', () => {
				expect(() => init(Component, null)).toThrow();
			});

			it('Should throw an specific error', () => {
				expect(() => init(Component, null)).toThrow(message.invalid);
			});

			it('Should validate the context value thoroughly', () => {
				expect(() =>
					init(Component, {
						isOpen: null,
						button: null,
						close: null,
						panel: null,
						createAccordionButton: null,
						createAccordionHeading: null,
						createAccordionPanel: null
					})
				).toThrow(message.invalid);
				expect(() =>
					init(Component, {
						isOpen: { subscribe: () => 64 },
						button: null,
						close: () => {},
						panel: null,
						createAccordionButton: null,
						createAccordionHeading: null,
						createAccordionPanel: null
					})
				).toThrow(message.invalid);
			});
		});
	});
});
