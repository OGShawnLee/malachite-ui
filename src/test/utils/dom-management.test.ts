import '@testing-library/jest-dom';
import * as dom from '$lib/utils/dom-management';
import { Render } from '$lib/components';
import { hasTagName } from '$lib/predicate';
import { render } from '@testing-library/svelte';

describe.skip('setAttribute', () => {
	const { setAttribute } = dom;
	it.skip('Should set the given attritute and value', () => {
		const div = document.createElement('div');
		setAttribute(div, ['tabIndex', '3']);
		expect(div).toHaveAttribute('tabIndex', '3');
	});

	it.skip('Should not set the given attribute if it is already set', () => {
		const div = document.createElement('div');
		div.setAttribute('role', 'dialog');
		setAttribute(div, ['role', 'menu']);
		expect(div).toHaveAttribute('role', 'dialog');
	});

	describe.skip('options', () => {
		describe.skip('overwrite', () => {
			it.skip('Should set the given attribute even if it is already set', () => {
				const div = document.createElement('div');
				div.tabIndex = 10;
				setAttribute(div, ['tabIndex', '0'], { overwrite: true });
				expect(div).toHaveAttribute('tabIndex', '0');
			});

			it.skip('Should work in Svelte actions', async () => {
				function action(element: HTMLElement) {
					setAttribute(element, ['role', 'heading'], {
						overwrite: true
					});
				}

				const { findByTestId } = render(Render, {
					props: { as: 'div', 'data-testid': 'element', role: 'random', use: [[action]] }
				});
				const element = await findByTestId('element');
				expect(element).toHaveAttribute('role', 'heading');
			});
		});

		describe.skip('predicate', () => {
			it.skip('Should only set the given attribute if the element passes the predicate', () => {
				const div = document.createElement('div');
				setAttribute(div, ['type', 'submit'], {
					predicate: (element) => hasTagName(element, 'button')
				});
				expect(div).not.toHaveAttribute('type');
			});

			it.skip('Should work with overwrite', () => {
				const div = document.createElement('div');
				div.tabIndex = 10;
				setAttribute(div, ['tabIndex', '0'], {
					overwrite: true,
					predicate: (element) => element.tabIndex < 0
				});
				expect(div).toHaveAttribute('tabIndex', '10');
			});
		});
	});
});
