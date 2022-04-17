import type { Toggleable } from '@stores';
import { getFirstAndLast, getFocusableElements } from '@utils';
import { useWindowListener } from '@hooks';
import { isEmpty, isHTMLElement, isWithin } from '@predicate';

export function useFocusTrap(this: Toggleable, panel: HTMLElement) {
	const fallback = document.activeElement;
	const children = getFocusableElements(panel);

	const handleFocus = (event: Event, target: Nullable<EventTarget | HTMLElement>) => {
		event.preventDefault();
		if (isHTMLElement(target)) target.focus();
	};

	return useWindowListener('keydown', (event) => {
		if (event.code !== 'Tab' || !this.isOpen) return;

		const active = document.activeElement;
		const [first, last] = getFirstAndLast(children);

		if (!isWithin(panel, event.target)) return handleFocus(event, first ?? fallback);

		if ((isEmpty(children) && !fallback) || children.length === 1) return event.preventDefault();
		if (isEmpty(children)) return handleFocus(event, fallback);

		if (active === first && event.shiftKey) return handleFocus(event, last);
		if (active === last && !event.shiftKey) return handleFocus(event, first);
	});
}

/** Prevents tabbing inside the panel during a leaving transition */
export function usePreventInternalFocus(this: Toggleable, panel: HTMLElement) {
	const children = getFocusableElements(panel);
	const tabIndexes = children.map(({ tabIndex }) => tabIndex);
	return this.subscribe((isOpen) => {
		if (isOpen) {
			children.forEach((child, index) => (child.tabIndex = tabIndexes[index]));
		} else children.forEach((child) => (child.tabIndex = -1));
	});
}
