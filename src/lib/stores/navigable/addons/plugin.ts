import type { Navigable } from '$lib/stores';
import { isHTMLElement, isWithin } from '$lib/predicate';
import { useCollector, useListener } from '$lib/hooks';

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
