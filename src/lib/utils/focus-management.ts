import { useDOMTraversal } from '@hooks';
import { isFocusable, isWithin } from '@predicate';
import { findElement } from '@utils';

export function focusFirstElement(
	container: HTMLElement,
	options: {
		fallback?: Nullable<HTMLElement>;
		initialFocus?: Nullable<HTMLElement>;
		predicate?: (child: HTMLElement) => boolean;
	} = {}
) {
	const { fallback, initialFocus, predicate } = options;

	if (initialFocus && isWithin(container, initialFocus)) {
		if (predicate && predicate(initialFocus)) return initialFocus.focus();
		return initialFocus.focus();
	}

	const callback = predicate
		? (node: HTMLElement) => isFocusable(node) && predicate(node)
		: isFocusable;
	const first = findElement(container, callback);
	if (first) return first.focus();
	if (fallback && callback(fallback)) {
		fallback.focus();
	}
}

export function getFocusableElements(container: Element, callback?: (child: Element) => unknown) {
	if (callback)
		return useDOMTraversal(
			container,
			(child) => callback(child) && isFocusable(child)
		) as HTMLElement[];
	return useDOMTraversal(container, isFocusable) as HTMLElement[];
}
