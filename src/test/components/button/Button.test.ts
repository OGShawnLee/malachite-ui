import '@testing-library/jest-dom';
import * as samples from './samples';
import { act, fireEvent, render } from '@testing-library/svelte';
import { isDisabled } from '$lib/predicate';

const cases = [samples.Component, samples.FragmentComponent];
describe('Behaviour', () => {
	describe('Attributes', () => {
		describe('aria-pressed', () => {
			it.each(cases)('Should be set', (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('button');
				expect(button.ariaPressed).toBeDefined();
			});

			it.each(cases)('Should be set to false by default', (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('button');
				expect(button.ariaPressed).toBe('false');
			});

			it.each(cases)('Should be reactive', async (Component) => {
				const { getByTestId } = render(Component);
				const button = getByTestId('button');
				expect(button.ariaPressed).toBe('false');
				await fireEvent.click(button);
				expect(button.ariaPressed).toBe('true');
			});
		});

		it.each(cases)("Should have role set 'button'", (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('button');
			expect(button.role).toBe('button');
		});

		it.each(cases)("Should have type set to 'button'", (Component) => {
			const { getByTestId } = render(Component);
			const button = getByTestId('button');
			expect(button.type).toBe('button');
		});
	});

	it.each(cases)('Should not be pressed by default', (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('button');
		expect(button.ariaPressed).toBe('false');
	});

	it.each(cases)('Should toggle when clicked', async (Component) => {
		const { getByTestId } = render(Component);
		const button = getByTestId('button');
		expect(button.ariaPressed).toBe('false');
		await fireEvent.click(button);
		expect(button.ariaPressed).toBe('true');
	});

	it.each(cases)('Should not toggle if it is disabled', async (Component) => {
		const { getByTestId } = render(Component, { props: { disabled: true } });
		const button = getByTestId('button');
		expect(button.ariaPressed).toBe('false');
		await fireEvent.click(button);
		expect(button.ariaPressed).toBe('false');
	});
});

describe('Props', () => {
	describe('disabled', () => {
		it.each(cases)('Should set the disabled state', (Component) => {
			const { getByTestId } = render(Component, { props: { disabled: true } });
			const button = getByTestId('button');
			expect(button.disabled).toBe(true);
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { disabled: true } });
			const button = getByTestId('button');
			expect(button.disabled).toBe(true);
			await act(() => component.$set({ disabled: false }))
			expect(button.disabled).toBe(false);
		});
	});

	describe('pressed', () => {
		it.each(cases)('Should set the pressed state', (Component) => {
			const { getByTestId } = render(Component, { props: { pressed: true } });
			const button = getByTestId('button');
			expect(button.ariaPressed).toBe('true');
		});

		it.each(cases)('Should be reactive', async (Component) => {
			const { component, getByTestId } = render(Component, { props: { pressed: true } });
			const button = getByTestId('button');
			expect(button.ariaPressed).toBe('true');
			await act(() => component.$set({ pressed: false }));
			expect(button.ariaPressed).toBe('false');
		});
	});
});

describe('Slot Props', () => {
	describe('is-disabled', () => {
		it('Should expose the current disabled state', () => {
			const { getByTestId } = render(samples.Component);
			const binding = getByTestId('binding-disabled');
			expect(binding).toHaveTextContent('false');
		});

		it('Should be reactive', async () => {
			const { component, getByTestId } = render(samples.Component);
			const binding = getByTestId('binding-disabled');
			expect(binding).toHaveTextContent('false');
			await act(() => component.$set({ disabled: true }));
			expect(binding).toHaveTextContent('true');
		});
	});
});
