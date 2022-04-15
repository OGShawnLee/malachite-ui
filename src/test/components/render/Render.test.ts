import '@testing-library/jest-dom';
import Render, { elementTagNames } from '@components/render';
import { BindElement, BindValue } from './samples';
import { act, cleanup, render } from '@testing-library/svelte';
import { hasTagName } from '@predicate';
import { generateActions } from '@test-utils';

afterEach(() => cleanup());

describe('attributes', () => {
	it('Should be possible to forward attributes', async () => {
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

	it('Should forward disabled', async () => {
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

describe('bind', () => {
	it('Should be possible to bind to the element', async () => {
		for (const as of elementTagNames) {
			const func = vi.fn(() => {});
			const { findByTestId } = render(BindElement, { props: { as, func } });
			const element = await findByTestId(`[bind]-element-${as}`);
			expect(func).toBeCalledWith(element);
		}
	});

	it('Should be possible to bind to the value', async () => {
		const { component, findByTestId } = render(Render, {
			props: { as: 'input', value: 'Master Chief', 'data-testid': 'render-input' }
		});
		const element = (await findByTestId('render-input')) as HTMLInputElement;
		expect(element.value).toBe('Master Chief');

		await act(() => component.$set({ value: 'Cortana' }));
		expect(element.value).toBe('Cortana');
	});
});

describe('rendering', () => {
	it('Should render a slot by default', () => {
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

describe('Action Forwarding', () => {
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
