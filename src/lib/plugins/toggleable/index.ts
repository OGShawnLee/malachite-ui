import type { Toggleable } from '$lib/stores';
import type { Nullable } from '$lib/types';
import { useWindowListener } from '$lib/hooks';
import { isEmpty, isHTMLElement, isWithin } from '$lib/predicate';
import { getFirstAndLast, getFocusableElements } from '$lib/utils';

export function handleClickOutside(this: Toggleable) {
	return useWindowListener('click', (event) => {
		if (this.isClosed || isWithin(this.tuple, event.target)) return;
		this.close(event);
	});
}

export function handleEscapeKey(this: Toggleable) {
	return useWindowListener('keydown', (event) => {
		if (this.isOpen && event.code === 'Escape') this.close(event);
	});
}

export function handleFocusLeave(this: Toggleable, panel: HTMLElement) {
	return useWindowListener('focusin', (event) => {
		if (this.isClosed || event.target === window || event.target === document.body) return;
		if (this.isFocusForced && !isWithin(panel, event.target)) return this.close(event);
		if (isWithin(this.tuple, event.target)) return;

		this.close(event);
	});
}

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
