import type { Unsubscriber } from 'svelte/store';
import { isWithin } from '$lib/predicate';
import { useWindowListener } from './useWindowListener';

export function useFocusOutside<T extends HTMLElement | HTMLElement[]>(
	element: T,
	onFocusOutside: (context: { element: T; event: FocusEvent; target: EventTarget | null }) => void
): Unsubscriber {
	return useWindowListener('focusin', (event) => {
		if (event.defaultPrevented) return;
		const { target } = event;
		if (isWithin(element, target)) return;
		onFocusOutside({ element, event, target });
	});
}
