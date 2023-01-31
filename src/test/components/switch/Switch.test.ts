import '@testing-library/jest-dom';
import type { SvelteComponent } from 'svelte';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { Switch, SwitchDescription, SwitchLabel } from '$lib/components';
import { hasTagName } from '$lib/predicate';
import {
	ContextParent,
	createContextParentRenderer,
	fuseElementsName,
	generateActions,
	isValidComponentName,
	useRange,
	useToggle
} from '@test-utils';
import { elementTagNames } from '$lib/components/render';
import { getContextKey, useDOMTraversal } from '$lib/hooks';

function initComponent(Component: typeof SvelteComponent, props = {}) {
	const result = render(Component, { props });
	const button = result.getByTestId('switch-root');

	function getAllLabels(textContext = 'Switch Label') {
		return result.getAllByText(textContext);
	}

	function getAllDescriptions(textContext = 'Switch Description') {
		return result.getAllByText(textContext);
	}

	function getHolder(testId = 'switch-isChecked-holder') {
		return result.getByTestId(testId);
	}

	return { ...result, getAllLabels, getAllDescriptions, getHolder, button };
}

const { ActionComponent, Behaviour, Descriptions, Labels, SlotComponent } = samples;

describe.skip('Behaviour', () => {
	it.skip('Should be unchecked by default', () => {
		const { getHolder } = initComponent(Behaviour);
		const holder = getHolder();
		expect(holder).toHaveTextContent('false');
	});

	it.skip('Should be toggled by clicking on it', async () => {
		const { button, getHolder } = initComponent(Behaviour);
		const holder = getHolder();

		await fireEvent.click(button);
		expect(holder).toHaveTextContent('true');

		await fireEvent.click(button);
		expect(holder).toHaveTextContent('false');
	});

	describe.skip('attributes', () => {
		describe.skip('aria-checked', () => {
			it.skip('Should be false by default', () => {
				const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
				expect(button.ariaChecked).toBe('false');
			});

			it.skip('Should be reactive', async () => {
				const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
				expect(button.ariaChecked).toBe('false');

				await fireEvent.click(button);
				expect(button.ariaChecked).toBe('true');

				await fireEvent.click(button);
				expect(button.ariaChecked).toBe('false');
			});
		});

		describe.skip('aria-describe.skipdby', () => {
			it.skip('Should not be set if there are not descriptions', () => {
				const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
				expect(button).not.toHaveAttribute('aria-describe.skipdby');
			});

			it.skip('Should point to all the descriptions id', () => {
				const { button, getAllDescriptions } = initComponent(Descriptions);
				const descriptions = getAllDescriptions();
				expect(descriptions).toHaveLength(3);
				expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));
			});

			it.skip('Should be reactive', async () => {
				const amount = useRange(0);
				const { button, getAllDescriptions } = initComponent(Descriptions, {
					descriptions: amount
				});
				expect(button).not.toHaveAttribute('aria-describe.skipdby');

				await act(() => amount.set(1));
				let descriptions = getAllDescriptions();
				expect(descriptions).toHaveLength(1);
				expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));

				await act(() => amount.set(5));
				descriptions = getAllDescriptions();
				expect(descriptions).toHaveLength(5);
				expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));

				await act(() => amount.set(0));
				expect(button).not.toHaveAttribute('aria-describe.skipdby');
			});
		});

		describe.skip('aria-labelledby', () => {
			it.skip('Should not be set if there are not labels', () => {
				const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
				expect(button).not.toHaveAttribute('aria-labelledby');
			});

			it.skip('Should point to all the labels id', () => {
				const { button, getAllLabels } = initComponent(Labels);
				const labels = getAllLabels();
				expect(labels).toHaveLength(3);
				expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
			});

			it.skip('Should be reactive', async () => {
				const amount = useRange(0);
				const { button, getAllLabels } = initComponent(Labels, { labels: amount });
				expect(button).not.toHaveAttribute('aria-labelledby');

				await act(() => amount.set(1));
				let labels = getAllLabels();
				expect(labels).toHaveLength(1);
				expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));

				await act(() => amount.set(5));
				labels = getAllLabels();
				expect(labels).toHaveLength(5);
				expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));

				await act(() => amount.set(0));
				expect(button).not.toHaveAttribute('aria-labelledby');
			});
		});

		describe.skip('role', () => {
			it.skip('Should be set to switch', () => {
				const { getByTestId } = render(Switch, { props: { 'data-testid': 'switch-root' } });
				const button = getByTestId('switch-root');
				expect(button).toHaveAttribute('role', 'switch');
			});
		});

		describe.skip('type', () => {
			it.skip('Should be set to button', () => {
				const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
				expect(button).toHaveAttribute('type', 'button');
			});

			it.skip('Should not be set if it is not rendered as a button', () => {
				const { button } = initComponent(Switch, { as: 'nav', 'data-testid': 'switch-root' });
				expect(button).not.toHaveAttribute('type');
			});
		});
	});

	it.each([
		['action component', ActionComponent],
		['slot component', SlotComponent]
	])('Should work rendered as a %s', async (name, Component) => {
		const amount = useRange(0);
		const [checked, toggle] = useToggle(false);
		const { button, getAllDescriptions, getAllLabels } = initComponent(Component, {
			amount,
			checked
		});

		expect(button.ariaChecked).toBe('false');
		await fireEvent.click(button);
		expect(button.ariaChecked).toBe('true');

		await act(() => toggle());
		expect(button.ariaChecked).toBe('false');
		await act(() => toggle());
		expect(button.ariaChecked).toBe('true');

		expect(button).not.toHaveAttribute('aria-describe.skipdby');
		expect(button).not.toHaveAttribute('aria-labelledby');
		await act(() => amount.set(3));
		const descriptions = getAllDescriptions();
		const labels = getAllLabels();
		expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));
		expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
		await act(() => amount.set(0));
		expect(button).not.toHaveAttribute('aria-labelledby');
		expect(button).not.toHaveAttribute('aria-describe.skipdby');

		expect(button).toHaveAttribute('role', 'switch');
		expect(button).toHaveAttribute('type', 'button');
		expect(isValidComponentName(button, 'switch')).toBe(true);
	});

	const { ForwardedActions } = samples;
	it.skip('Should work with forwarded actions', async () => {
		const amount = useRange(0);
		const [checked, toggle] = useToggle(false);
		const { button, getAllDescriptions, getAllLabels } = initComponent(ForwardedActions, {
			amount,
			checked
		});

		expect(button.ariaChecked).toBe('false');
		await fireEvent.click(button);
		expect(button.ariaChecked).toBe('true');

		await act(() => toggle());
		expect(button.ariaChecked).toBe('false');
		await act(() => toggle());
		expect(button.ariaChecked).toBe('true');

		expect(button).not.toHaveAttribute('aria-describe.skipdby');
		expect(button).not.toHaveAttribute('aria-labelledby');
		await act(() => amount.set(3));
		const descriptions = getAllDescriptions();
		const labels = getAllLabels();
		expect(button).toHaveAttribute('aria-describe.skipdby', fuseElementsName(descriptions));
		expect(button).toHaveAttribute('aria-labelledby', fuseElementsName(labels));
		await act(() => amount.set(0));
		expect(button).not.toHaveAttribute('aria-labelledby');
		expect(button).not.toHaveAttribute('aria-describe.skipdby');

		expect(button).toHaveAttribute('role', 'switch');
		expect(button).toHaveAttribute('type', 'button');
		expect(isValidComponentName(button, 'switch')).toBe(true);
	});

	describe.skip('Label', () => {
		const { Passive } = samples;
		it.skip('Should toggle the Switch upon clicking by default', async () => {
			const { getByText } = render(Passive);
			const label = getByText('Component Label');

			const button = getByText('Switch');
			expect(button.ariaChecked).toBe('false');

			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('true');

			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('false');
		});

		it.skip('Should work with an action component', async () => {
			const { getByText } = render(Passive);
			const label = getByText('Action Component Label');

			const button = getByText('Switch');
			expect(button.ariaChecked).toBe('false');

			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('true');

			await fireEvent.click(label);
			expect(button.ariaChecked).toBe('false');
		});
	});
});

describe.skip('Events', () => {
	it.skip('Should forward click events', async () => {
		const click = vi.fn<[MouseEvent]>(() => {});
		const { getByTestId } = render(Behaviour, { props: { click } });
		const button = getByTestId('switch-root');
		await fireEvent.click(button);
		expect(click).toBeCalled();
		expect(click.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
	});
});

describe.skip('Multiple', () => {
	const { Multiple } = samples;

	it.skip('Each Switch should have independent state', async () => {
		const { getAllByRole, getByTestId } = render(Multiple);
		const buttons = getAllByRole('switch');
		const pairs = buttons.reduce((list, button, index) => {
			const holder = getByTestId(`switch-${index}-isChecked-holder`);
			return list.push([button, holder]), list;
		}, [] as [HTMLElement, HTMLElement][]);

		for (const [button, holder] of pairs) {
			expect(button.ariaChecked).toBe('false');
			expect(holder).toHaveTextContent('false');
		}

		const [first, second, third] = pairs;
		await fireEvent.click(first[0]);
		expect(first[1]).toHaveTextContent('true');
		expect(second[1]).toHaveTextContent('false');
		expect(third[1]).toHaveTextContent('false');

		await fireEvent.click(third[0]);
		expect(first[1]).toHaveTextContent('true');
		expect(second[1]).toHaveTextContent('false');
		expect(third[1]).toHaveTextContent('true');
	});

	it.skip('Each Switch should have an unique id', () => {
		const { getAllByText } = render(Multiple);
		const buttons = getAllByText('Switch');
		for (const button of buttons) {
			expect(isValidComponentName(button, 'switch')).toBe(true);
		}
	});

	it.skip('Each Description and Label should have an appropiate and unique id', () => {
		const { container, getAllByText } = render(Multiple);
		const buttons = getAllByText('Switch');
		for (const button of buttons) {
			const buttonIndex = (button.id.match(/\d+/g)?.[0] || 0).toString();
			expect(isValidComponentName(button, 'switch')).toBe(true);

			const descriptions = useDOMTraversal(container, ({ id }) => {
				return id.includes(buttonIndex) && id.includes('description');
			});

			expect(descriptions).toHaveLength(3);
			for (const description of descriptions) {
				expect(isValidComponentName(description as HTMLElement, 'switch', 'description'));
			}

			const labels = useDOMTraversal(container, ({ id }) => {
				return id.includes(buttonIndex) && id.includes('label');
			});

			expect(labels).toHaveLength(3);
			for (const label of labels) {
				expect(isValidComponentName(label as HTMLElement, 'switch', 'label'));
			}
		}
	});
});

describe.skip('Props', () => {
	describe.skip('isChecked', () => {
		it.skip('Should be set to false by default', () => {
			const { button, getHolder } = initComponent(Behaviour);
			const holder = getHolder();
			expect(button.ariaChecked).toBe('false');
			expect(holder).toHaveTextContent('false');
		});

		it.skip('Should determine the checked state', () => {
			const { button, getHolder } = initComponent(Behaviour, { checked: true });
			const holder = getHolder();
			expect(button.ariaChecked).toBe('true');
			expect(holder).toHaveTextContent('true');
		});

		it.skip('Should be reactive', async () => {
			const { button, component, getHolder } = initComponent(Behaviour);
			const holder = getHolder();
			expect(button.ariaChecked).toBe('false');
			expect(holder).toHaveTextContent('false');

			await act(() => component.$set({ checked: true }));
			expect(button.ariaChecked).toBe('true');
			expect(holder).toHaveTextContent('true');

			await act(() => component.$set({ checked: false }));
			expect(button.ariaChecked).toBe('false');
			expect(holder).toHaveTextContent('false');
		});
	});

	describe.skip('Label', () => {
		describe.skip('passive', () => {
			const { Passive } = samples;
			it.skip('Should be set to false by default', async () => {
				const { getByText } = render(Passive);
				const label = getByText('Component Label');
				const button = getByText('Switch');

				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('true');

				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');
			});

			it.skip('Should prevent toggling the Switch if set to true', async () => {
				const { getByText } = render(Passive, { props: { passive: true } });
				const label = getByText('Component Label');
				const actionLabel = getByText('Action Component Label');
				const button = getByText('Switch');

				await fireEvent.click(actionLabel);
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');

				await fireEvent.click(actionLabel);
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');
			});

			it.skip('Should be reactive', async () => {
				const { component, getByText } = render(Passive);
				const label = getByText('Component Label');
				const actionLabel = getByText('Action Component Label');
				const button = getByText('Switch');

				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('true');

				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');

				await fireEvent.click(actionLabel);
				expect(button.ariaChecked).toBe('true');

				await fireEvent.click(actionLabel);
				expect(button.ariaChecked).toBe('false');

				await act(() => component.$set({ passive: true }));

				await fireEvent.click(actionLabel);
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');

				await fireEvent.click(actionLabel);
				await fireEvent.click(label);
				expect(button.ariaChecked).toBe('false');
			});
		});
	});
});

describe.skip('Rendering', () => {
	const { Rendering } = samples;
	describe.skip('Switch', () => {
		it.skip('Should be rendered as a button by default', () => {
			const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
			expect(hasTagName(button, 'button')).toBe(true);
		});

		it.skip('Should have a valid switch component id', () => {
			const { button } = initComponent(Switch, { 'data-testid': 'switch-root' });
			expect(isValidComponentName(button, 'switch')).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', (as) => {
			const { button } = initComponent(Switch, { as, 'data-testid': 'switch-root' });
			expect(hasTagName(button, as)).toBe(true);
		});

		it.skip('Should be able of forwarding attributes', async () => {
			const attributes = { tabIndex: '4', title: 'a switch root' };
			const { button } = initComponent(Switch, {
				...attributes,
				'data-testid': 'switch-root'
			});
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(button).toHaveAttribute(attr, value);
			}
		});

		it.skip('Should be able of forwarding actions', () => {
			const actions = generateActions(3);
			const { button } = initComponent(Switch, { use: actions, 'data-testid': 'switch-root' });
			for (const [action, parameter] of actions) {
				expect(action).toBeCalledWith(button, parameter);
			}
		});
	});

	describe.skip.each([
		['Description', 'p'],
		['Label', 'label']
	])('%s', (name, defaultTag) => {
		const lowerCaseComponent = name.toLowerCase();
		const textContent = `Switch ${name}`;

		it.skip(`Should be rendered as a ${defaultTag} by default`, () => {
			const { getByText } = initComponent(Rendering);
			const element = getByText(textContent);
			expect(hasTagName(element, defaultTag));
		});

		it.skip(`Should have a valid ${lowerCaseComponent} switch id`, async () => {
			const { getByText } = initComponent(Rendering);
			const element = getByText(textContent);
			expect(isValidComponentName(element, 'switch', lowerCaseComponent)).toBe(true);
		});

		it.each(elementTagNames)('Should be able to be rendered as a %s', async (as) => {
			const { getByText } = initComponent(Rendering, { [lowerCaseComponent]: { as } });
			const element = getByText(textContent);
			expect(hasTagName(element, as)).toBe(true);
		});

		it.skip('Should be able to forward attributes', async () => {
			const attributes = { tabIndex: '4', title: `a popover ${lowerCaseComponent}` };
			const { getByText } = initComponent(Rendering, {
				[lowerCaseComponent]: { rest: attributes }
			});
			const element = getByText(textContent);
			const entriesAttributes = Object.entries(attributes);
			for (const [attr, value] of entriesAttributes) {
				expect(element).toHaveAttribute(attr, value);
			}
		});

		it.skip('Should be able to forward actions', async () => {
			const actions = generateActions(3);
			const { getByText } = initComponent(Rendering, {
				[lowerCaseComponent]: { use: actions }
			});
			const element = getByText(textContent);
			for (const [action, index] of actions) {
				expect(action).toBeCalledWith(element, index);
			}
		});
	});
});

describe.skip('Slot Props', () => {
	describe.skip('isChecked', () => {
		it.skip('Should be set to false by default', () => {
			const { getHolder } = initComponent(Behaviour);
			const holder = getHolder();
			expect(holder).toHaveTextContent('false');
		});

		it.skip('Should be reactive', async () => {
			const { button, getHolder } = initComponent(Behaviour);
			const holder = getHolder();
			expect(holder).toHaveTextContent('false');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('true');

			await fireEvent.click(button);
			expect(holder).toHaveTextContent('false');
		});
	});
});

// PLACING THIS BEFORE OTHER TESTS CORRUPTS THEIR CONTEXT
describe.skip('Context', () => {
	interface ContextKeys {
		Checked: any;
		button: any;
		initDescription: any;
		initLabel: any;
	}

	const [init, messages] = createContextParentRenderer<ContextKeys>(ContextParent, 'switch');

	describe.skip('Unset Context', () => {
		describe.skip.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered without a Switch Context', () => {
				expect(() => render(Component)).toThrow();
			});

			it.skip('Should try to fallback to a SwitchGroup Context', () => {
				expect(() => render(Component)).toThrow(
					`Unable to Find ${getContextKey('switch-group')} Context. Did you set it?`
				);
			});
		});
	});

	describe.skip('Invalid Context', () => {
		describe.skip('Switch', () => {
			interface GroupContextkeys {
				Checked: any;
				InitDescription: any;
				InitLabel: any;
				initDescription: any;
				initLabel: any;
			}

			const [init, message] = createContextParentRenderer<GroupContextkeys>(
				ContextParent,
				'switch-group'
			);

			it.skip('Should throw if given an invalid SwitchGroup Context', () => {
				expect(() => init.skip(Switch, null)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => init.skip(Switch, null)).toThrow(message.invalid);
			});

			it.skip('Should validate the context value thoroughly', () => {
				expect(() =>
					init.skip(Switch, {
						Checked: null,
						initDescription: null,
						InitDescription: null,
						initLabel: null,
						InitLabel: null
					})
				).toThrow(message.invalid);
				expect(() =>
					init.skip(Switch, {
						Checked: { subscribe: () => 64 },
						initDescription: {},
						InitDescription: {},
						initLabel: 'Not a Function',
						InitLabel: false
					})
				).toThrow(message.invalid);
			});
		});

		describe.skip.each([
			['Description', SwitchDescription],
			['Label', SwitchLabel]
		])('%s', (name, Component) => {
			it.skip('Should throw an error if rendered with an invalid Switch Context', () => {
				expect(() => init.skip(Component, null)).toThrow();
			});

			it.skip('Should throw an specific error', () => {
				expect(() => init.skip(Component, null)).toThrow(messages.invalid);
			});

			it.skip('Should validate the context value thoroughly', () => {
				expect(() =>
					init.skip(Component, {
						Checked: null,
						button: null,
						initLabel: null,
						initDescription: null
					})
				).toThrow(messages.invalid);
				expect(() =>
					init.skip(Component, {
						Checked: { subscribe: () => 64 },
						button: {},
						initLabel: false,
						initDescription: {}
					})
				).toThrow(messages.invalid);
			});
		});
	});
});
