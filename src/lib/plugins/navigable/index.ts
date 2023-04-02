import type { Navigable } from '$lib/stores';
import type { Navigation, Plugin, ReadableRef } from '$lib/types';
import { useCleanup, useListener, useWindowListener } from '$lib/hooks';
import {
	isDisabled,
	isHTMLElement,
	isHorizontalNavigationKey as isHorizontalKey,
	isNavigationKey,
	isVerticalNavigationKey as isVerticalKey
} from '$lib/predicate';
import { hasFocus, isEnabled } from '$lib/predicate/dom';

export function getRadioGroupNavigationHandler(
	toolbar: { isVertical: ReadableRef<boolean> } | undefined
): Navigation.Handler {
	if (!toolbar) return handleNavigation;
	return function (event) {
		if (!isNavigationKey(event.code)) return;
		const isHorizontalToolbar = !toolbar.isVertical.value();
		switch (event.code) {
			case 'ArrowDown':
				if (toolbar.isVertical.value()) return;
				if (this.isVertical.value()) event.preventDefault();
				return this.handleNextKey(event.code, event.ctrlKey, false);
			case 'ArrowUp':
				if (toolbar.isVertical.value()) return;
				if (this.isVertical.value()) event.preventDefault();
				return this.handleBackKey(event.code, event.ctrlKey, false);
			case 'ArrowLeft':
				if (isHorizontalToolbar) return;
				if (this.isHorizontal) event.preventDefault();
				return this.handleBackKey(event.code, event.ctrlKey, false);
			case 'ArrowRight':
				if (isHorizontalToolbar) return;
				if (this.isHorizontal) event.preventDefault();
				return this.handleNextKey(event.code, event.ctrlKey, false);
		}
	};
}

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
	if (!this.isGlobal.value() && !isNavigationElement) return;

	if (isVerticalKey(event.code) && this.isVertical.value()) event.preventDefault();
	if (isHorizontalKey(event.code) && this.isHorizontal) event.preventDefault();

	switch (event.code) {
		case 'ArrowDown':
		case 'ArrowRight':
		case 'End':
			if (event.code === 'End') {
				event.preventDefault();
				if (this.isGlobal.value()) return;
				return this.handleNextKey(event.code, event.ctrlKey);
			}

			if (this.isFocusEnabled.value() && this.index.value() === 0) {
				const element = this.at(0);
				if (element && !hasFocus(element) && !event.ctrlKey && isEnabled(element)) {
					if (this.isHorizontal && isHorizontalKey(event.code)) return element.focus();
					if (this.isVertical.value() && isVerticalKey(event.code)) return element.focus();
				}
			}

			return this.handleNextKey(event.code, event.ctrlKey);
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'Home':
			if (event.code === 'Home') {
				event.preventDefault();
				if (this.isGlobal.value()) return;
			}
			return this.handleBackKey(event.code, event.ctrlKey);
		case 'Enter':
		case 'Space':
			if (this.isFocusEnabled.value()) return;
			const element = this.at(this.manualIndex.value());
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
