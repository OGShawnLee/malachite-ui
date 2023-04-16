import type { NavigationKey, Nullable } from '$lib/types';
import { isNullish } from '$lib/predicate/core';

// area, base, br, col, command, embed, hr, img, input, keygen, link, meta, param, source, track, wbr

export const VOID_TAGS = {
	area: true,
	base: true,
	br: true,
	col: true,
	command: true,
	embed: true,
	hr: true,
	img: true,
	input: true,
	keygen: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true
};

export function hasFocus(element: Element) {
	return document.activeElement === element;
}

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

export function isEnabled(target: Nullable<EventTarget | HTMLElement>) {
	return isNotDisabled(target);
}

export function isChildless(container: HTMLElement) {
	return !container.hasChildNodes();
}

export function isClient() {
	try {
		return !!window;
	} catch {
		return false;
	}
}

export function isDisabled(element: HTMLElement | EventTarget) {
	return (
		isHTMLElement(element) &&
		(element.getAttribute('disabled') === 'true' || element.hasAttribute('disabled'))
	);
}

export function isFocusable(element: HTMLElement | EventTarget, strict = true) {
	if (!isHTMLElement(element) || isDisabled(element)) return false;
	return element.tabIndex >= (strict ? 0 : -1);
}

export function isHorizontalNavigationKey(code: string): code is 'ArrowRight' | 'ArrowLeft' {
	return code === 'ArrowRight' || code === 'ArrowLeft';
}

export function isHTMLElement(val: unknown): val is HTMLElement {
	return val instanceof HTMLElement;
}

export function isNavigationKey(code: string): code is NavigationKey {
	return (
		code in
		{
			ArrowUp: true,
			ArrowRight: true,
			ArrowLeft: true,
			ArrowDown: true,
			End: true,
			Enter: true,
			Home: true,
			Space: true
		}
	);
}

export function isNotDisabled(val: Nullable<EventTarget | HTMLElement>) {
	return isHTMLElement(val) && !isDisabled(val);
}

export function isValidHTMLElementID(id: string) {
	const regex = /^[A-Za-z]+[\w\-\:\.]*$/;
	return regex.test(id);
}

export function isVerticalNavigationKey(code: string): code is 'ArrowDown' | 'ArrowUp' {
	return code === 'ArrowDown' || code === 'ArrowUp';
}

export function isVoidElement(tag: string) {
	return tag.toLowerCase() in VOID_TAGS;
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
