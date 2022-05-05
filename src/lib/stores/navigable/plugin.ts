import type { Navigable } from '$lib/stores';
import { isDisabled, isHTMLElement, isWithin } from '$lib/predicate';
import { useCleanup, useCollector, useListener, useWindowListener } from '$lib/hooks';

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
