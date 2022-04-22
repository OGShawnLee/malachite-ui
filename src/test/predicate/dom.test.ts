import * as dom from '$lib/predicate/dom';
import { appendChild, useCleaner } from '@test-utils';
import { generate } from '$lib/utils';
import { useListener } from '$lib/hooks';

const { add, destroy } = useCleaner();
afterEach(() => destroy());

describe('hasTagName', () => {
	const { hasTagName } = dom;
	const tagNames = ['article', 'button', 'dialog', 'div', 'input', 'section'];

	it('Should return true if the element has the given tagName', () => {
		for (const tagName of tagNames) {
			const element = document.createElement(tagName);
			expect(hasTagName(element, tagName)).toBe(true);
		}
	});

	it('Should return false if the element does not have the given tagName', () => {
		const ul = document.createElement('ul');
		const canvas = document.createElement('canvas');
		expect(hasTagName(canvas, 'dialog')).toBe(false);
		expect(hasTagName(ul, 'div')).toBe(false);
	});
});

describe('isDisabled', () => {
	const { isDisabled } = dom;
	it('Should return true if element is disabled', () => {
		const button = document.createElement('button');
		button.disabled = true;
		expect(isDisabled(button)).toBe(true);
	});

	it('Should return true if element is not disabled', () => {
		const input = document.createElement('input');
		input.disabled = false;
		expect(isDisabled(input)).toBe(false);
	});

	it("Should work with elements that 'are not meant' to be disabled", () => {
		const div = document.createElement('div');
		div.toggleAttribute('disabled', true);
		expect(isDisabled(div)).toBe(true);

		div.toggleAttribute('disabled', false);
		expect(isDisabled(div)).toBe(false);
	});
});

describe('isFocusable', () => {
	const { isFocusable } = dom;
	it('Should return true if element is focusable', () => {
		const div = document.createElement('div');
		div.tabIndex = 0;
		expect(isFocusable(div)).toBe(true);
		div.tabIndex = 10;
		expect(isFocusable(div)).toBe(true);
	});

	it('Should return false if element is not focusable', () => {
		const div = document.createElement('div');
		expect(isFocusable(div)).toBe(false);
		div.tabIndex = -10;
		expect(isFocusable(div)).toBe(false);
	});

	it('Should return false if element is disabled', () => {
		const button = document.createElement('button');
		button.disabled = true;
		expect(isFocusable(button)).toBe(false);
	});
});

describe('isHTMLElement', () => {
	const { isHTMLElement } = dom;
	it('Should return true if value is a HTMLElement', () => {
		const elements = ['button', 'input', 'div', 'section'].map((tag) =>
			document.createElement(tag)
		);
		for (const element of elements) {
			expect(isHTMLElement(element)).toBe(true);
		}
	});

	it('Should return false if value is not a HTMLElement', () => {
		const values = [0, 'string', false, true, {}, [], () => {}];
		for (const value of values) {
			expect(isHTMLElement(value)).toBe(false);
		}
	});
});

describe('isWithin', () => {
	const { isWithin } = dom;
	it('Should return true if the parent contains the given element', () => {
		const parent = document.createElement('div');
		const child = document.createElement('button');
		parent.appendChild(child);
		expect(isWithin(parent, child)).toBe(true);
	});

	it('Should return false if the parent does not contain the given element', () => {
		const parent = document.createElement('div');
		const child = document.createElement('button');
		expect(isWithin(parent, child)).toBe(false);
	});

	it('Should return false if either the parent or child are nullish', () => {
		const parent = document.createElement('div');
		const child = document.createElement('button');

		expect(isWithin(parent, null)).toBe(false);
		expect(isWithin(parent, undefined)).toBe(false);

		expect(isWithin(null, null)).toBe(false);
		expect(isWithin(undefined, undefined)).toBe(false);

		expect(isWithin(null, child)).toBe(false);
		expect(isWithin(undefined, child)).toBe(false);
	});

	it('Should work with an array of nullable elements', () => {
		const elements = generate(3, () => document.createElement('div'));
		const child = document.createElement('span');
		expect(isWithin(elements, child)).toBe(false);

		elements[0].appendChild(child);
		expect(isWithin(elements, child)).toBe(true);

		const nullishElements = [null, ...elements, undefined];
		expect(isWithin(nullishElements, child)).toBe(true);

		const button = document.createElement('button');
		expect(isWithin(nullishElements, button)).toBe(false);

		elements[2].appendChild(button);
		expect(isWithin(nullishElements, button)).toBe(true);
	});

	it('Should work with an EventTarget', () => {
		const func = vi.fn<[Event]>(() => {});
		const parent = appendChild(document.createElement('div'));
		const child = appendChild(document.createElement('button'), parent);

		add(useListener(parent, 'click', func));
		child.click();
		expect(func).toBeCalled();

		const target = func.mock.calls[0][0].target;
		expect(isWithin(parent, target)).toBe(true);
	});
});
