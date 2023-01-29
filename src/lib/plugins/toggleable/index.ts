import type { Toggleable } from '$lib/stores';
import type { Nullable, Toggler } from '$lib/types';
import type { ElementBinder } from '$lib/core';
import { useWindowListener } from '$lib/hooks';
import { isEmpty, isHTMLElement, isWithin } from '$lib/predicate';
import { getFirstAndLast, getFocusableElements } from '$lib/utils';

export function handleAriaControls(panel: ElementBinder): Toggler.Plugin {
	return function (element) {
		return panel.finalName.subscribe((name) => {
			if (name) element.setAttribute('aria-controls', name);
			else element.removeAttribute('aria-controls');
		});
	};
}

export const handleAriaExpanded: Toggler.Plugin = function (element) {
	return this.isOpen.subscribe((isOpen) => {
		element.ariaExpanded = '' + isOpen;
	});
};

export const useCloseClickOutside: Toggler.Plugin = function () {
	return useWindowListener('click', (event) => {
		const { target } = event;
		if (this.isClosed || !isHTMLElement(target) || this.isWithinElements(target)) return;
		this.close(event);
	});
};

export const useCloseEscapeKey: Toggler.Plugin = function () {
	return useWindowListener('keydown', (event) => {
		if (this.isClosed || event.code !== 'Escape') return;
		this.close(event);
	});
};

export const useCloseFocusLeave: Toggler.Plugin = function (panel) {
	return useWindowListener('focusin', (event) => {
		const { target } = event;
		if (this.isClosed || target === document || target === window || !isHTMLElement(target)) return;
		if (this.isFocusForced.value && !isWithin(panel, target)) return this.close(event);
		if (this.isWithinElements(target) || this.group?.isWithinElements(target)) return;
		this.close(event);
	});
};

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
export function useHidePanelFocusOnClose(this: Toggleable, panel: HTMLElement) {
	const children = getFocusableElements(panel);
	const tabIndexes = children.map(({ tabIndex }) => tabIndex);
	return this.isOpen.subscribe((isOpen) => {
		if (isOpen) {
			children.forEach((child, index) => (child.tabIndex = tabIndexes[index]));
		} else children.forEach((child) => (child.tabIndex = -1));
	});
}
