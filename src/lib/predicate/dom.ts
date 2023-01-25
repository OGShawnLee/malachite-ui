import type { NavigationKey, Nullable } from '$lib/types';
import { isNullish } from '$lib/predicate';

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
