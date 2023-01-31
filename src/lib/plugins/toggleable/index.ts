import type { Navigable, Toggleable } from '$lib/stores';
import type { Nullable, Toggler } from '$lib/types';
import type { ElementBinder } from '$lib/core';
import { useDOMTraversal, useListener, useWindowListener } from '$lib/hooks';
import { isEmpty, isFocusable, isHTMLElement, isNavigationKey, isWithin } from '$lib/predicate';
import { getFocusableElements } from '$lib/utils';
import { tick } from 'svelte';

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

export function handleAriaLabelledby(button: ElementBinder): Toggler.Plugin {
	return function (element) {
		return button.finalName.subscribe((name) => {
			if (name) element.setAttribute('aria-labelledby', name);
			else element.removeAttribute('aria-labelledby');
		});
	};
}

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

export function useFocusTrap(fallback?: Nullable<Element>): Toggler.Plugin {
	return function (panel: HTMLElement) {
		return useWindowListener('keydown', (event) => {
			if (this.isClosed) return;
			const children = useDOMTraversal(panel, isFocusable);
			const first = children.at(0);
			const last = children.at(-1);

			if (event.code !== 'Tab') return;
			if (isEmpty(children) && isHTMLElement(fallback) && isFocusable(fallback)) {
				event.preventDefault();
				return fallback.focus();
			}

			if (event.shiftKey) {
				if (first && first === document.activeElement) {
					event.preventDefault();
					last?.focus();
				}
			} else {
				if (last && last === document.activeElement) {
					event.preventDefault();
					first?.focus();
				}
			}
		});
	};
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

export function useNavigationStarter(navigation: Navigable): Toggler.Plugin {
	return function (button) {
		return useListener(button, 'keydown', async (event) => {
			if (!isNavigationKey(event.code)) return;
			switch (event.code) {
				case 'ArrowDown':
					if (navigation.isVertical.value) {
						this.open();
						await tick();
						return navigation.goFirst();
					}
				case 'ArrowUp':
					if (navigation.isVertical.value) {
						this.open();
						await tick();
						return navigation.goLast();
					}
			}
		});
	};
}

export function usePreventTabbing(panel: HTMLElement) {
	return useListener(panel, 'keydown', (event) => {
		if (event.code === 'Tab') event.preventDefault();
	});
}
