import { isNullish } from '@predicate';

// hasTagName
export function hasTagName<T extends keyof HTMLElementTagNameMap>(
	element: Element,
	tag: T
): element is HTMLElementTagNameMap[T];
export function hasTagName(element: Element, tag: string): boolean;

export function hasTagName<T extends keyof HTMLElementTagNameMap>(
	element: Element,
	tag: T | string
): element is HTMLElementTagNameMap[T] {
	return element.tagName === tag.toUpperCase();
}

export function isDisabled(element: HTMLElement | EventTarget) {
	return (
		isHTMLElement(element) &&
		(element.getAttribute('disabled') === 'true' || element.hasAttribute('disabled'))
	);
}

export function isFocusable(element: HTMLElement | EventTarget) {
	return isHTMLElement(element) && !isDisabled(element) && element.tabIndex >= 0;
}

export function isHTMLElement(val: unknown): val is HTMLElement {
	return val instanceof HTMLElement;
}

export function isWithin(
	root: Nullable<Node | Document> | Nullable<Node | Document>[],
	target: Nullable<Node | EventTarget>
) {
	if (isNullish(root) || isNullish(target)) return false;

	if (target instanceof Node) {
		if (root instanceof Array) return root.some((element) => element?.contains(target));
		return root.contains(target);
	}

	return false;
}