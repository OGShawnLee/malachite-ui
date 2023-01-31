import type { Navigable } from '$lib/stores';
import type { Navigation, Plugin } from '$lib/types';
import { useCleanup, useListener, useWindowListener } from '$lib/hooks';
import {
	isDisabled,
	isHTMLElement,
	isHorizontalNavigationKey,
	isNavigationKey,
	isVerticalNavigationKey
} from '$lib/predicate';

export const handleAriaOrientation: Plugin<Navigable> = function (panel) {
	return this.isVertical.subscribe((isVertical) => {
		panel.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
	});
};

export const handleNavigation: Navigation.Handler = function (event) {
	if (!isNavigationKey(event.code)) return;

	const isNavigationRoot = event.target === event.currentTarget;
	const isNavigationElement =
		isNavigationRoot || (isHTMLElement(event.target) && this.isNavigationElement(event.target));
	if (!this.isGlobal.value && !isNavigationElement) return;

	if (isVerticalNavigationKey(event.code) && this.isVertical.value) event.preventDefault();
	if (isHorizontalNavigationKey(event.code) && this.isHorizontal) event.preventDefault();

	switch (event.code) {
		case 'ArrowDown':
		case 'ArrowRight':
		case 'End':
			if (event.code === 'End') {
				event.preventDefault();
				if (this.isGlobal.value) return;
			}
			return this.handleNextKey(event.code, event.ctrlKey);
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'Home':
			if (event.code === 'Home') {
				event.preventDefault();
				if (this.isGlobal.value) return;
			}
			return this.handleBackKey(event.code, event.ctrlKey);
		case 'Enter':
		case 'Space':
			if (this.isFocusEnabled.value) return;
			const element = this.at(this.manualIndex.value);
			if (element) {
				if (event.code === 'Enter') event.preventDefault();
				element.click();
			}
	}
};

export const useHoverMove: Plugin<Navigable> = function (element) {
	return useListener(element, 'mousemove', (event) => {
		if (!isHTMLElement(event.target) || isDisabled(event.target)) return;
		const index = this.findIndex((element) => element === event.target);
		if (index > -1) this.interact(index, false);
	});
};

export const useKeyMatch: Plugin<Navigable> = function (element) {
	return useCleanup(
		useListener(element, 'keydown', ({ key }) => {
			if (isNavigationKey(key)) return;
			key = key.toLowerCase();
			const index = this.findIndex((element) => {
				if (isDisabled(element)) return;
				return element.textContent?.toLowerCase().trim().startsWith(key);
			});
			if (index > -1) this.interact(index, false);
		})
	);
};

export const useResetOnLeave: Plugin<Navigable> = function () {
	return useCleanup(
		useWindowListener('click', (event) => {
			if (!isHTMLElement(event.target) || this.isWithin(event.target)) return;
			this.index.set(0);
		}),
		useWindowListener('focusin', (event) => {
			if (!isHTMLElement(event.target) || this.isWithin(event.target)) return;
			this.index.set(0);
		})
	);
};
