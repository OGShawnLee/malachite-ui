import type { Unsubscriber } from 'svelte/store';
import useWindowListener from './useWindowListener';
import { isWithin } from '$lib/predicate';

export default function useFocusOutside<T extends HTMLElement | HTMLElement[]>(
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
