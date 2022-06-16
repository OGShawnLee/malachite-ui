import type { Unsubscriber } from 'svelte/store';
import { isWithin } from '$lib/predicate';
import { useWindowListener } from './useWindowListener';

export function useClickOutside<T extends HTMLElement | HTMLElement[]>(
	element: T,
	onClickOutside: (context: { element: T; event: MouseEvent; target: EventTarget | null }) => void
): Unsubscriber {
	return useWindowListener('click', (event) => {
		if (event.defaultPrevented) return;
		const { target } = event;
		if (isWithin(element, target)) return;
		onClickOutside({ element, event, target });
	});
}
