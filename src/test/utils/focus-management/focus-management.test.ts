import '@testing-library/jest-dom';
import Component from './__base.svelte';
import * as utils from '$lib/utils/focus-management';
import { cleanup, render } from '@testing-library/svelte';
import { findElement } from '$lib/utils';
import { hasTagName } from '$lib/predicate';

afterEach(() => cleanup());

const containers = {
	focusable: 'focusable-container',
	nested: 'nested-container',
	invalid: 'invalid-container'
};

describe('focusFirstChildElement', () => {
	it('Should focus the first focusable element', () => {
		const { container } = render(Component);
		utils.focusFirstChildElement(container);
		const button = findElement(container, (element) => element.textContent === 'Focusable');
		expect(button).toHaveFocus();
	});

	it('Should ignore disabled and negative tabIndex elements', async () => {
		const { findByTestId } = render(Component);
		const container = await findByTestId(containers.invalid);
		utils.focusFirstChildElement(container);
		expect(document.body).toHaveFocus();
	});

	it('Should only focus the first element inside the given container', async () => {
		const { findByTestId } = render(Component);
		const container = await findByTestId(containers.nested);
		utils.focusFirstChildElement(container);
		expect(container.firstElementChild).toHaveFocus();
	});

	describe('options', () => {
		describe('fallback', () => {
			it('Should focus the given fallback element if no focusable element is found', async () => {
				const { container, findByTestId } = render(Component);
				const invalidContainer = await findByTestId(containers.invalid);
				const fallback = findElement(container, (element) => hasTagName(element, 'button'));
				utils.focusFirstChildElement(invalidContainer, { fallback });
				expect(fallback).toHaveFocus();
			});
		});

		describe('initialFocus', () => {
			it('Should always focus the initialFocus element', async () => {
				const { findByTestId } = render(Component);
				const container = await findByTestId(containers.focusable);
				const nestedContainer = await findByTestId(containers.nested);
				const initialFocus = nestedContainer.firstElementChild;
				utils.focusFirstChildElement(container, { initialFocus: initialFocus as HTMLElement });

				expect(initialFocus).toHaveFocus();
			});
		});

		describe('predicate', () => {
			it('Should only focus the element that matches the given predicate', async () => {
				const { container } = render(Component);
				const heading = findElement(container, (element) => hasTagName(element, 'h1'));
				utils.focusFirstChildElement(container, {
					isValidTarget: (element) => hasTagName(element, 'h1')
				});
				expect(heading).toHaveFocus();
			});
		});
	});
});

describe.skip('getFocusableItems', () => {
	it.skip('Should return all focusable elements recursively', () => {
		const { container } = render(Component);
		const elements = utils.getFocusableElements(container);
		expect(elements).toHaveLength(6);
	});

	it.skip('Should ignore disabled elements and negative tabIndex', async () => {
		const { findByTestId } = render(Component);
		const container = await findByTestId(containers.invalid);
		const elements = utils.getFocusableElements(container);
		expect(elements).toHaveLength(0);
	});

	it.skip('Should return only the focusable elements inside the given container', async () => {
		const { findByTestId } = render(Component);
		const container = await findByTestId(containers.nested);
		const elements = utils.getFocusableElements(container);
		expect(elements).toHaveLength(2);
	});

	describe.skip('predicate', () => {
		it.skip('Should return only the elements that match the predicate', async () => {
			const { container } = render(Component);
			const elements = utils.getFocusableElements(container, (element) => {
				return element.textContent === 'Nested';
			});
			expect(elements).toHaveLength(1);
		});
	});
});
