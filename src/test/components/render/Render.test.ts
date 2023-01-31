import '@testing-library/jest-dom';
import Render, { elementTagNames } from '$lib/components/render';
import * as samples from './samples';
import { act, cleanup, fireEvent, render } from '@testing-library/svelte';
import { hasTagName } from '$lib/predicate';
import { generateActions } from '@test-utils';

afterEach(() => cleanup());

const { BindElement, Events } = samples;
describe.skip('attributes', () => {
	it.skip('Should be possible to forward attributes', async () => {
		const attributes: [string, number | string][] = [
			['data-random', 'random'],
			['tabIndex', 5],
			['title', 'a title'],
			['class', 'element element--active']
		];

		const objectAttributes = attributes.reduce((object, [attr, value]) => {
			return (object[attr] = value), object;
		}, {} as { [key: string]: number | string });

		for (const as of elementTagNames) {
			const result = render(Render, {
				props: { ...objectAttributes, as, 'data-testid': `render-${as}` }
			});
			const element = await result.findByTestId(`render-${as}`);

			for (const [attr, value] of attributes) {
				expect(element).toHaveAttribute(attr, String(value));
			}

			result.component.$destroy();
		}
	});

	it.skip('Should forward disabled', async () => {
		for (const as of ['button', 'input']) {
			const { component, findByTestId } = render(Render, {
				props: { as, 'data-testid': `render-${as}`, disabled: true }
			});
			const element = await findByTestId(`render-${as}`);
			expect(element).toBeDisabled();

			await act(() => component.$set({ disabled: false }));
			expect(element).not.toBeDisabled();

			component.$destroy();
		}
	});
});

describe.skip('bind', () => {
	it.skip('Should be possible to bind to the element', async () => {
		for (const as of elementTagNames) {
			const func = vi.fn(() => {});
			const { findByTestId } = render(BindElement, { props: { as, func } });
			const element = await findByTestId(`[bind]-element-${as}`);
			expect(func).toBeCalledWith(element);
		}
	});

	it.skip('Should be possible to bind to the value', async () => {
		const { component, findByTestId } = render(Render, {
			props: { as: 'input', value: 'Master Chief', 'data-testid': 'render-input' }
		});
		const element = (await findByTestId('render-input')) as HTMLInputElement;
		expect(element.value).toBe('Master Chief');

		await act(() => component.$set({ value: 'Cortana' }));
		expect(element.value).toBe('Cortana');
	});
});

describe.skip('rendering', () => {
	it.skip('Should render a slot by default', () => {
		const { findByTestId } = render(Render, { props: { 'data-testid': 'element' } });
		async function danger() {
			return await findByTestId('element');
		}
		expect(danger()).rejects.toBeUndefined();
	});

	it.each(elementTagNames)('Should be able to render a %s', async (as) => {
		const { findByTestId } = render(Render, {
			props: { as, 'data-testid': 'render' }
		});
		const element = await findByTestId('render');
		expect(hasTagName(element, as)).toBe(true);
	});
});

describe.skip('Action Forwarding', () => {
	it.each(elementTagNames)('Should be able of forwarding actions', async (as) => {
		const actions = generateActions(3);
		const { findByTestId } = render(Render, {
			props: { as, use: actions, 'data-testid': `render-${as}` }
		});
		const element = await findByTestId(`render-${as}`);
		for (const [action, index] of actions) {
			expect(action).toBeCalledWith(element, index);
		}
	});
});

const {} = samples;
describe.skip('Events', () => {
	function initComponent(props: {
		handleBlur: (event: FocusEvent) => void;
		handleClick?: (event: MouseEvent) => void;
		handleFocus: (event: FocusEvent) => void;
	}) {
		const result = render(Events, { props });
		return { ...result, element: result.getByText('Render') };
	}

	describe.skip('Blur', () => {
		it.skip('Should be able of forwarding a blur listener', async () => {
			const handleBlur = vi.fn(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleBlur });
			await act(() => element.focus());
			await act(() => element.blur());
			expect(handleBlur).toBeCalledTimes(1);

			await act(() => element.focus());
			await act(() => element.blur());
			expect(handleBlur).toBeCalledTimes(2);
		});

		it.skip('Should pass the FocusEvent', async () => {
			const handleBlur = vi.fn<[FocusEvent]>(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleBlur });
			await act(() => element.focus());
			await act(() => element.blur());
			expect(handleBlur.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
		});
	});

	describe.skip('Click', () => {
		it.skip('Should be able of forwarding a click listener', async () => {
			const handleClick = vi.fn(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleClick });
			await fireEvent.click(element);
			expect(handleClick).toBeCalledTimes(1);
			await fireEvent.click(element);
			expect(handleClick).toBeCalledTimes(2);
		});

		it.skip('Should pass the MouseEvent', async () => {
			const handleClick = vi.fn<[MouseEvent]>(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleClick });
			await fireEvent.click(element);
			expect(handleClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
		});
	});

	describe.skip('Focus', () => {
		it.skip('Should be able of forwarding a focus listener', async () => {
			const handleFocus = vi.fn(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleFocus });
			await act(() => element.focus());
			expect(handleFocus).toBeCalledTimes(1);

			await act(() => element.blur());

			await act(() => element.focus());
			expect(handleFocus).toBeCalledTimes(2);
		});

		it.skip('Should pass the FocusEvent', async () => {
			const handleFocus = vi.fn<[FocusEvent]>(() => {});
			// @ts-ignore
			const { element } = initComponent({ handleFocus });
			await act(() => element.focus());
			expect(handleFocus.mock.calls[0][0]).toBeInstanceOf(FocusEvent);
		});
	});
});
