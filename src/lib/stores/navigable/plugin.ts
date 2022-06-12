import type { Navigable } from '$lib/stores';
import type { Unsubscriber } from 'svelte/store';
import { isDisabled, isHTMLElement, isWithin } from '$lib/predicate';
import {
	useCleanup,
	useClickOutside,
	useCollector,
	useListener,
	useWindowListener
} from '$lib/hooks';

export function useActiveHover(this: Navigable, parent: HTMLElement) {
	return useCleanup(
		useWindowListener('mousemove', ({ target }) => {
			if (!isHTMLElement(target) || target === this.activeElement || isDisabled(target)) return;
			const index = this.primitive.elements.indexOf(target);
			if (index > -1) this.interact(index, false);
		}),
		useListener(parent, 'mouseleave', () => this.Waiting.set(true))
	);
}

export function useFocusOut(
	element: HTMLElement,
	onFocusLeave: (context: {
		element: HTMLElement;
		event: FocusEvent;
		target: EventTarget | null;
	}) => void
): Unsubscriber {
	return useWindowListener('focusin', (event) => {
		const { target } = event;
		if (isWithin(element, target)) return;
		onFocusLeave({ element, event, target });
	});
}

export function useFocusSync(this: Navigable, panel: HTMLElement) {
	const onPanelFocusWithin = () => {
		const target = document.activeElement;
		if (isHTMLElement(target)) {
			const index = this.indexOf(target);
			if (this.isSelected(index)) return;
			this.set(index, false);
		}
	};

	let isEventAdded = false;

	function addEventListener() {
		if (isEventAdded) return;
		panel.addEventListener('focusin', onPanelFocusWithin);
		isEventAdded = true;
	}

	function removeEventListener() {
		panel.removeEventListener('focusin', onPanelFocusWithin);
		isEventAdded = false;
	}

	if (isWithin(panel, document.activeElement)) addEventListener();

	return useCleanup(
		useWindowListener('focusin', () => {
			if (isWithin(panel, document.activeElement)) addEventListener();
			else removeEventListener();
		}),
		removeEventListener
	);
}

export function useManualSync(this: Navigable, parent: HTMLElement) {
	let isEventAdded = false;

	const onChildrenFocus = (event: FocusEvent) => {
		if (!this.isManual) return;

		if (isHTMLElement(event.target) && this.isSelected(event.target))
			this.ManualIndex.set(this.index);

		if (!isWithin(parent, event.target)) onFocusLeft();
	};

	const onFocusLeft = () => {
		this.ManualIndex.set(this.index);
		parent.removeEventListener('focusin', onChildrenFocus, true);
		isEventAdded = false;
	};

	return useCollector({
		beforeCollection: () => {
			isEventAdded = false;
			parent.removeEventListener('focusin', onChildrenFocus);
		},
		init: () =>
			useListener(parent, 'focusin', () => {
				if (isEventAdded) return;
				parent.addEventListener('focusin', onChildrenFocus);
				isEventAdded = true;
			})
	});
}

export function useKeyMatch(this: Navigable, panel: HTMLElement) {
	const keyEvent = { isKeyPressed: false, keys: new Set<string>() };

	const findIndexWithTextContent = () => {
		return this.primitive.elements.findIndex((element) => {
			if (isDisabled(element)) return;
			const text = element.textContent?.toLowerCase();
			const keyText = Array.from(keyEvent.keys).join('').toLowerCase();
			return text?.startsWith(keyText);
		});
	};

	return useCleanup(
		useListener(panel, 'keydown', ({ key }) => {
			keyEvent.isKeyPressed = true;
			keyEvent.keys.add(key);
		}),
		useListener(panel, 'keyup', () => {
			if (!keyEvent.isKeyPressed) return;

			const index = findIndexWithTextContent();
			if (index > -1) this.interact(index);

			keyEvent.isKeyPressed = false;
			keyEvent.keys.clear();
		})
	);
}

export function useResetOnLeave(this: Navigable, panel: HTMLElement) {
	return useCleanup(
		useClickOutside(panel, () => this.Index.set(0)),
		useFocusOut(panel, () => this.Index.set(0))
	);
}
