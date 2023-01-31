import type { Nullable } from '$lib/types';
import { useDOMTraversal, useListener } from '$lib/hooks';
import { isFocusable, isWithin } from '$lib/predicate';
import { findElement } from '$lib/utils';

export function focusFirstChildElement(
	container: HTMLElement,
	options: {
		fallback?: Nullable<HTMLElement>;
		initialFocus?: Nullable<HTMLElement>;
		isValidTarget?: (child: HTMLElement) => unknown;
	} = {}
) {
	const { fallback, initialFocus, isValidTarget } = options;
	const isValidFocusElement = isValidTarget
		? (element: HTMLElement) => isFocusable(element) && isValidTarget(element)
		: isFocusable;
	if (initialFocus && isWithin(container, initialFocus) && isValidFocusElement(initialFocus))
		return initialFocus.focus();

	const child = findElement(container, isValidFocusElement);
	child ? child.focus() : fallback?.focus();
}

export function getFocusableChildren(
	container: HTMLElement,
	callback?: (child: Element) => unknown
) {
	if (callback)
		return useDOMTraversal(
			container,
			(child) => isFocusable(child) && callback(child)
		) as HTMLElement[];
	return useDOMTraversal(container, isFocusable) as HTMLElement[];
}

export function preventTabbing(element: HTMLElement) {
	return useListener(element, 'keydown', (event) => {
		if (event.code === 'Tab') event.preventDefault();
	});
}
